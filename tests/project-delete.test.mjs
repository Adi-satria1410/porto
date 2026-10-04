import test from 'node:test';
import assert from 'node:assert/strict';
import { deleteProject } from '../js/project-delete-service.mjs';

const id = '11111111-1111-4111-8111-111111111111';
const project = { id, status: 'published', updated_at: 'before' };
const hidden = { id, updated_at: 'after' };
const file = { id: 'file', name: 'screen.png' };
function fake({ admin = true, db = [{ data: project }, { data: hidden }, { data: { id } }], lists = [{ data: [file] }, { data: [] }], removals = [{}] } = {}) {
  const calls = [];
  return {
    calls,
    auth: { getSession: async () => ({ data: { session: {} } }), getUser: async () => ({ data: { user: { id: 'admin' } } }) },
    rpc: async () => ({ data: admin }),
    from(table) {
      assert.equal(table, 'projects');
      const query = {};
      for (const method of ['select','eq','update','delete']) query[method] = (...args) => { calls.push([method,...args]); return query; };
      query.single = query.maybeSingle = async () => { assert.ok(db.length); return db.shift(); };
      return query;
    },
    storage: { from(bucket) {
      assert.equal(bucket, 'project-screenshots');
      return {
        async list(folder, options) { calls.push(['list',folder,options]); assert.ok(lists.length); return lists.shift(); },
        async remove(paths) { calls.push(['remove',paths]); assert.ok(removals.length); return removals.shift(); },
      };
    } },
  };
}
test('non-admin and invalid project IDs cannot delete', async () => {
  const client = fake({ admin: false });
  await assert.rejects(deleteProject(client,id)); assert.equal(client.calls.length,0);
  await assert.rejects(deleteProject(fake(),'../another-project'), /tidak valid/);
});
test('published project is hidden before files, then row deleted with concurrency guard', async () => {
  const client = fake(); await deleteProject(client,id);
  assert.ok(client.calls.findIndex(c=>c[0]==='update') < client.calls.findIndex(c=>c[0]==='remove'));
  assert.ok(client.calls.findIndex(c=>c[0]==='remove') < client.calls.findIndex(c=>c[0]==='delete'));
  assert.deepEqual(client.calls.find(c=>c[0]==='remove')[1],[`${id}/screen.png`]);
  assert.ok(client.calls.some(c=>c[0]==='eq' && c[1]==='updated_at' && c[2]==='after'));
});
test('failed hide stops before storage access', async () => {
  const client=fake({db:[{data:project},{error:true}]});
  await assert.rejects(deleteProject(client,id),/disiapkan/);
  assert.ok(!client.calls.some(c=>c[0]==='list'||c[0]==='delete'));
});
test('storage listing failure leaves project row intact', async () => {
  const client=fake({lists:[{error:true}]});
  await assert.rejects(deleteProject(client,id),/tetap draft/);
  assert.ok(!client.calls.some(c=>c[0]==='remove'||c[0]==='delete'));
});
test('failed removal retains metadata and project for retry', async () => {
  const client=fake({removals:[{error:true}]});
  await assert.rejects(deleteProject(client,id),/belum berhasil dihapus/);
  assert.ok(!client.calls.some(c=>c[0]==='delete'));
});
test('paginated orphan files are also cleaned in bounded batches', async () => {
  const first=Array.from({length:100},(_,i)=>({id:String(i),name:`file${i}.png`}));
  const client=fake({lists:[{data:first},{data:[file]},{data:[]}],removals:[{},{}]});
  await deleteProject(client,id);
  assert.deepEqual(client.calls.filter(c=>c[0]==='list').map(c=>c[2].offset),[0,100,0]);
  assert.deepEqual(client.calls.filter(c=>c[0]==='remove').map(c=>c[1].length),[100,1]);
});
test('draft without files can be deleted, and missing row retry is harmless', async () => {
  const client=fake({db:[{data:{...project,status:'draft'}},{data:hidden},{data:{id}}],lists:[{data:[]},{data:[]}]});
  await deleteProject(client,id);assert.ok(!client.calls.some(c=>c[0]==='remove'));
  const missing=fake({db:[{data:null}]});await deleteProject(missing,id);
  assert.ok(!missing.calls.some(c=>c[0]==='update'||c[0]==='list'));
});
test('unexpected folder paths are never deleted', async () => {
  const client=fake({lists:[{data:[{id:'file',name:'../other.png'}]}]});
  await assert.rejects(deleteProject(client,id),/tidak dikenali/);
  assert.ok(!client.calls.some(c=>c[0]==='remove'));
});
test('files remaining after remove prevent database deletion', async () => {
  const client=fake({lists:[{data:[file]},{data:[file]}]});
  await assert.rejects(deleteProject(client,id),/dipastikan kosong/);
  assert.ok(!client.calls.some(c=>c[0]==='delete'));
});
test('failed final delete or conflicting update reports incomplete deletion', async () => {
  for(const result of [{error:true},{data:null}]) {
    await assert.rejects(deleteProject(fake({db:[{data:project},{data:hidden},result]}),id),/belum terkonfirmasi/);
  }
});
