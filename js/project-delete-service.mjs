import { verifyAdmin } from './admin-service.mjs';
import { SCREENSHOT_BUCKET } from './project-editor-service.mjs';

export async function deleteProject(client, id) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error('ID project tidak valid.');
  }
  if (!await verifyAdmin(client)) throw new Error('Silakan login kembali.');
  const current = await client.from('projects').select('id,status,updated_at').eq('id', id).maybeSingle();
  if (current.error) throw new Error('Project belum dapat diperiksa. Tidak ada file yang dihapus.');
  if (!current.data) return; // Retry after a lost successful DELETE response.

  // Always touch updated_at, including drafts, to detect concurrent project edits.
  const hidden = await client.from('projects').update({ status: 'draft' })
    .eq('id', id).eq('updated_at', current.data.updated_at).select('id,updated_at').single();
  if (hidden.error || !hidden.data) throw new Error('Project belum dapat disiapkan untuk dihapus. Muat ulang daftar lalu coba lagi.');

  const bucket = client.storage.from(SCREENSHOT_BUCKET);
  try {
    // Enumerate the exact project folder before removing anything. This also
    // includes uploads whose metadata INSERT failed during an earlier request.
    const paths = [];
    for (let offset = 0; ; offset += 100) {
      const result = await bucket.list(id, { limit: 100, offset, sortBy: { column: 'name', order: 'asc' } });
      if (result.error || !Array.isArray(result.data)) throw new Error('Daftar screenshot gagal dibaca.');
      for (const file of result.data) {
        if (!file.id || !/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(file.name)) {
          throw new Error('Folder project berisi file atau subfolder yang tidak dikenali. Periksa Storage melalui dashboard Supabase.');
        }
        paths.push(`${id}/${file.name}`);
      }
      if (result.data.length < 100) break;
    }
    for (let start = 0; start < paths.length; start += 100) {
      const result = await bucket.remove(paths.slice(start, start + 100));
      if (result.error) throw new Error('Sebagian screenshot belum berhasil dihapus.');
    }
    const remaining = await bucket.list(id, { limit: 1, offset: 0 });
    if (remaining.error || !Array.isArray(remaining.data) || remaining.data.length) {
      throw new Error('Folder screenshot belum dapat dipastikan kosong.');
    }
  } catch (error) {
    throw new Error(`${error.message || 'Penghapusan screenshot terhenti.'} Project tetap draft dan datanya belum dihapus. Coba hapus project kembali setelah koneksi pulih.`);
  }

  // ON DELETE CASCADE removes image metadata only after Storage is clean.
  const removed = await client.from('projects').delete().eq('id', id)
    .eq('status', 'draft').eq('updated_at', hidden.data.updated_at).select('id').maybeSingle();
  if (removed.error || !removed.data) {
    throw new Error('Screenshot sudah dibersihkan, tetapi penghapusan data project belum terkonfirmasi. Muat ulang daftar; jika project masih ada, coba hapus kembali.');
  }
}
