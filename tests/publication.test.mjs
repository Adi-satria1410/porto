import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePublication, changePublication, loadPublished, orderedImages, safeDemo } from '../js/services/publication.mjs';
const project = { id: 'p', title: 'Demo', description: 'Description', technologies: ['HTML'], demo_url: null, sort_order: 0, status: 'draft', updated_at: 'timestamp' };
const image = { id: 'a', storage_path: 'p/a.png', is_cover: false, sort_order: 0, created_at: '2026-01-01' };
function fake(results, { admin = true, downloadError = false } = {}) {
  const calls = [];
  const client = {
    calls,
    auth: { getSession: async () => ({ data: { session: {} } }), getUser: async () => ({ data: { user: { id: 'owner' } } }) },
    rpc: async () => ({ data: admin }),
    storage: { from: () => ({ download: async () => { calls.push(['download']); return { data: downloadError ? null : {}, error: downloadError }; } }) },
    from(table) {
      const query = {};
      for (const method of ['select', 'eq', 'order', 'range', 'update']) {
        query[method] = (...args) => { calls.push([table, method, ...args]); return query; };
      }
      const next = () => { assert.ok(results.length); return Promise.resolve(results.shift()); };
      query.single = next; query.then = (resolve, reject) => next().then(resolve, reject); return query;
    },
  };
  return client;
}
test('publication requires description, technologies and image, but demo is optional', () => {
  assert.doesNotThrow(() => validatePublication(project, [image]));
  assert.throws(() => validatePublication({ ...project, description: '' }, [image]));
  assert.throws(() => validatePublication({ ...project, technologies: [] }, [image]));
  assert.throws(() => validatePublication(project, []));
});
test('non-admin cannot change status', async () => {
  const client = fake([], { admin: false });
  await assert.rejects(changePublication(client, 'p', true));
  assert.equal(client.calls.length, 0);
});
test('publish checks files and uses optimistic concurrency', async () => {
  const client = fake([{ data: project }, { data: [image] }, { data: { id: 'p' } }]);
  await changePublication(client, 'p', true);
  assert.ok(client.calls.some(call => call[0] === 'download'));
  assert.ok(client.calls.some(call => call[1] === 'update' && call[2].status === 'published'));
  assert.ok(client.calls.some(call => call[1] === 'eq' && call[2] === 'updated_at' && call[3] === 'timestamp'));
});
test('unreadable image prevents publish', async () => {
  const client = fake([{ data: project }, { data: [image] }], { downloadError: true });
  await assert.rejects(changePublication(client, 'p', true), /Screenshot/);
  assert.ok(!client.calls.some(call => call[1] === 'update'));
});
test('unpublish works even without valid images and reports update failures', async () => {
  const client = fake([{ data: { ...project, status: 'published' } }, { data: { id: 'p' } }]);
  await changePublication(client, 'p', false);
  assert.ok(!client.calls.some(call => call[0] === 'download'));
  assert.ok(client.calls.some(call => call[1] === 'update' && call[2].status === 'draft'));
  const failed = fake([{ data: { ...project, status: 'published' } }, { error: true }]);
  await assert.rejects(changePublication(failed, 'p', false), /Muat ulang/);
});
test('public query explicitly filters published and paginates', async () => {
  const client = fake([{ data: [], count: 0 }]);
  assert.deepEqual(await loadPublished(client, 1), { projects: [], count: 0 });
  assert.ok(client.calls.some(call => call[1] === 'eq' && call[2] === 'status' && call[3] === 'published'));
  assert.deepEqual(client.calls.at(-1), ['projects', 'range', 9, 17]);
  await assert.rejects(loadPublished(fake([{ error: true }])), /belum dapat dimuat/);
});
test('cover sorting does not mutate data and unsafe demo links are omitted', () => {
  const rows = [image, { ...image, id: 'b', sort_order: 10, is_cover: true }];
  assert.equal(orderedImages(rows)[0].id, 'b'); assert.equal(rows[0].id, 'a');
  assert.equal(safeDemo('javascript:alert(1)'), null);
  assert.equal(safeDemo('https://user:password@example.com'), null);
  assert.equal(safeDemo(null), null);
  assert.equal(safeDemo('https://example.com'), 'https://example.com/');
});
