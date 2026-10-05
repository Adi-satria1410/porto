import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyAdmin, validateConfig, loadProjects } from '../js/services/admin.mjs';

function authClient({ session = true, valid = true, admin = true, rpcError = null } = {}) {
  return {
    auth: {
      getSession: async () => ({ data: { session: session ? {} : null }, error: null }),
      getUser: async () => ({ data: { user: valid ? { id: 'owner' } : null }, error: valid ? null : new Error() }),
    },
    rpc: async (name) => {
      assert.equal(name, 'is_portfolio_admin');
      return { data: admin, error: rpcError };
    },
  };
}

test('missing configuration and secret keys are rejected', () => {
  assert.throws(() => validateConfig({ url: '', publishableKey: '' }));
  assert.throws(() => validateConfig({ url: 'https://example.supabase.co', publishableKey: 'sb_secret_test' }));
  assert.throws(() => validateConfig({ url: 'http://example.supabase.co', publishableKey: 'sb_publishable_test' }));
  assert.doesNotThrow(() => validateConfig({ url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test' }));
});
test('signed out visitor does not query admin permissions', async () => {
  const client = authClient({ session: false });
  client.rpc = () => { throw new Error('must not call RPC'); };
  assert.equal(await verifyAdmin(client), null);
});
test('unverified, non-admin and failed permission requests fail closed', async () => {
  await assert.rejects(verifyAdmin(authClient({ valid: false })), /diverifikasi/);
  await assert.rejects(verifyAdmin(authClient({ admin: false })), /tidak memiliki akses/);
  await assert.rejects(verifyAdmin(authClient({ rpcError: new Error() })), /tidak dapat diperiksa/);
  await assert.rejects(verifyAdmin(authClient({ admin: 'true' })), /tidak memiliki akses/);
});
test('verified admin can proceed', async () => {
  assert.deepEqual(await verifyAdmin(authClient()), { id: 'owner' });
});

function queryClient(result) {
  const calls = [];
  const query = {};
  for (const method of ['select', 'order', 'eq', 'ilike']) {
    query[method] = (...args) => { calls.push([method, ...args]); return query; };
  }
  query.range = async (...args) => { calls.push(['range', ...args]); return result; };
  return { calls, from: (table) => { assert.equal(table, 'projects'); return query; } };
}
test('list query filters status, escapes wildcards, and paginates deterministically', async () => {
  const client = queryClient({ data: [{ id: 'project' }], count: 25 });
  const result = await loadProjects(client, { search: '  50%_test  ', status: 'draft', page: 1 });
  assert.equal(result.count, 25);
  assert.deepEqual(client.calls.filter(([name]) => name === 'order'), [
    ['order', 'sort_order'], ['order', 'created_at'], ['order', 'id'],
  ]);
  assert.ok(client.calls.some((call) => JSON.stringify(call) === JSON.stringify(['eq', 'status', 'draft'])));
  assert.ok(client.calls.some((call) => JSON.stringify(call) === JSON.stringify(['ilike', 'title', '%50\\%\\_test%'])));
  assert.deepEqual(client.calls.at(-1), ['range', 12, 23]);
});
test('query failure is not presented as an empty collection', async () => {
  await assert.rejects(loadProjects(queryClient({ error: new Error() })), /gagal dimuat/);
  assert.deepEqual(await loadProjects(queryClient({ data: [], count: 0 })), { projects: [], count: 0 });
});
