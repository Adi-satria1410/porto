export function validateConfig(config) {
  let url;
  try { url = new URL(config.url); } catch { throw new Error('Isi Project URL dan publishable key di js/supabase-config.js terlebih dahulu.'); }
  if (url.protocol !== 'https:' || !config.publishableKey?.startsWith('sb_publishable_')) {
    throw new Error('Gunakan Project URL HTTPS dan key sb_publishable_ dari Supabase. Jangan gunakan secret key.');
  }
}

export async function verifyAdmin(client) {
  const session = await client.auth.getSession();
  if (session.error) throw new Error('Sesi tidak dapat diperiksa. Coba lagi.');
  if (!session.data.session) return null;
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error('Sesi tidak dapat diverifikasi. Coba login kembali.');
  const permission = await client.rpc('is_portfolio_admin');
  if (permission.error) throw new Error('Hak admin tidak dapat diperiksa. Pastikan migrasi Supabase sudah dipasang.');
  if (permission.data !== true) throw new Error('Akun ini tidak memiliki akses admin portfolio.');
  return data.user;
}

export async function loadProjects(client, { search = '', status = '', page = 0, pageSize = 12 } = {}) {
  let query = client.from('projects')
    .select('id,title,description,technologies,status,sort_order,updated_at', { count: 'exact' })
    .order('sort_order').order('created_at').order('id');
  if (status === 'draft' || status === 'published') query = query.eq('status', status);
  const term = search.trim().replace(/[\\%_]/g, '\\$&');
  if (term) query = query.ilike('title', `%${term}%`);
  const result = await query.range(page * pageSize, (page + 1) * pageSize - 1);
  if (result.error) throw new Error('Daftar project gagal dimuat. Periksa koneksi dan coba lagi.');
  return { projects: result.data || [], count: result.count || 0 };
}
