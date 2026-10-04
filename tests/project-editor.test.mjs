import test from 'node:test';
import assert from 'node:assert/strict';
import { projectValues, validateImage, saveDraft, uploadScreenshot, deleteScreenshot, setCover } from '../js/project-editor-service.mjs';

const values = { title: ' Demo ', description: ' Test ', technologies: 'HTML, CSS, HTML, ', demo_url: '', sort_order: '0' };
const file = { type: 'image/png', size: 1024 };
const image = { id: 'image', project_id: 'project', storage_path: 'project/image.png' };
const draft = { data: { id: 'project', status: 'draft' } };

function fake(results, { uploadError = null, removeError = null } = {}) {
  const calls = [];
  const bucket = {
    upload: async (...args) => { calls.push(['upload', ...args]); return { error: uploadError }; },
    remove: async (...args) => { calls.push(['remove', ...args]); return { error: removeError }; },
  };
  return {
    calls, storage: { from: () => bucket },
    from(table) {
      const chain = {};
      for (const method of ['select', 'insert', 'update', 'delete', 'eq']) {
        chain[method] = (...args) => { calls.push([table, method, ...args]); return chain; };
      }
      const next = () => {
        assert.ok(results.length, 'Unexpected database request');
        return Promise.resolve(results.shift());
      };
      chain.single = chain.maybeSingle = next;
      chain.then = (resolve, reject) => next().then(resolve, reject);
      return chain;
    },
  };
}
test('project fields normalize tags, optional demo and integer order', () => {
  assert.deepEqual(projectValues(values), { title: 'Demo', description: 'Test', technologies: ['HTML', 'CSS'], demo_url: null, sort_order: 0 });
  for (const demo_url of ['javascript:alert(1)', 'https://name:password@example.com', 'not a URL']) {
    assert.throws(() => projectValues({ ...values, demo_url }));
  }
  for (const sort_order of ['-1', '1.2', '2147483648']) assert.throws(() => projectValues({ ...values, sort_order }));
  assert.throws(() => projectValues({ ...values, title: ' ' }));
});
test('image validation rejects unsupported, empty and oversized uploads', () => {
  assert.equal(validateImage(file), 'png');
  assert.throws(() => validateImage({ type: 'image/svg+xml', size: 100 }));
  assert.throws(() => validateImage({ ...file, size: 0 }));
  assert.throws(() => validateImage({ ...file, size: 5242881 }));
});
test('new project is forced to draft and edits only target drafts', async () => {
  const client = fake([draft, draft]);
  await saveDraft(client, null, values);
  assert.equal(client.calls.find(call => call[1] === 'insert')[2].status, 'draft');
  await saveDraft(client, 'project', values);
  assert.ok(client.calls.some(call => call[1] === 'eq' && call[2] === 'status' && call[3] === 'draft'));
});
test('published project rejects screenshot upload', async () => {
  const client = fake([{ data: { status: 'published' } }]);
  await assert.rejects(uploadScreenshot(client, 'project', file, 'Desktop', 0), /hanya mengedit draft/);
  assert.ok(!client.calls.some(call => call[0] === 'upload'));
});
test('failed metadata insert cleans up only after confirming no row exists', async () => {
  const client = fake([draft, { error: true }, { data: null }]);
  await assert.rejects(uploadScreenshot(client, 'project', file, 'Desktop', 0), /dibersihkan/);
  assert.equal(client.calls.filter(call => call[0] === 'remove').length, 1);
});
test('lost insert response preserves successfully committed upload', async () => {
  const client = fake([draft, { error: true }, { data: image }]);
  assert.deepEqual(await uploadScreenshot(client, 'project', file, 'Desktop', 0), image);
  assert.ok(!client.calls.some(call => call[0] === 'remove'));
});
test('uncertain metadata state does not delete a potentially linked file', async () => {
  const client = fake([draft, { error: true }, { error: true }]);
  await assert.rejects(uploadScreenshot(client, 'project', file, 'Desktop', 0), /belum dapat dipastikan/);
  assert.ok(!client.calls.some(call => call[0] === 'remove'));
});
test('failed file removal preserves metadata for retry', async () => {
  const client = fake([draft], { removeError: true });
  await assert.rejects(deleteScreenshot(client, image), /Metadata tetap disimpan/);
  assert.ok(!client.calls.some(call => call[1] === 'delete'));
});
test('failed cover assignment reports fallback after clearing previous cover', async () => {
  const client = fake([draft, {}, { error: true }]);
  await assert.rejects(setCover(client, image), /Gambar pertama/);
});
