export const SCREENSHOT_BUCKET = 'project-screenshots';
const formats = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export function projectValues(values) {
  const title = values.title.trim();
  const description = values.description.trim();
  const technologies = [...new Set(values.technologies.split(',').map(value => value.trim()).filter(Boolean))];
  const sort_order = Number(values.sort_order);
  const demo = values.demo_url.trim();
  if (!title || title.length > 160) throw new Error('Nama project wajib diisi, maksimal 160 karakter.');
  if (description.length > 10000) throw new Error('Deskripsi maksimal 10.000 karakter.');
  if (technologies.length > 30) throw new Error('Maksimal 30 teknologi. Pisahkan dengan koma.');
  if (!Number.isInteger(sort_order) || sort_order < 0 || sort_order > 2147483647) throw new Error('Urutan harus berupa bilangan bulat antara 0 dan 2147483647.');
  if (demo) {
    let url;
    try { url = new URL(demo); } catch { throw new Error('Tautan demo harus berupa URL lengkap HTTPS atau HTTP.'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || /\s/.test(demo) || demo.length > 2048) {
      throw new Error('Gunakan tautan demo HTTP/HTTPS tanpa spasi atau kredensial.');
    }
  }
  return { title, description, technologies, sort_order, demo_url: demo || null };
}

export function validateImage(file) {
  if (!formats[file.type]) throw new Error('Screenshot harus berupa JPG, PNG, atau WebP.');
  if (file.size <= 0 || file.size > 5242880) throw new Error('Ukuran screenshot harus lebih dari 0 dan maksimal 5 MiB.');
  return formats[file.type];
}

export async function readProject(client, id) {
  const { data, error } = await client.from('projects').select('*').eq('id', id).single();
  if (error || !data) throw new Error('Project tidak ditemukan atau tidak dapat dibuka.');
  return data;
}

export async function requireDraft(client, id) {
  const project = await readProject(client, id);
  if (project.status !== 'draft') throw new Error('Editor hanya mengedit draft. Kembalikan project ke draft melalui daftar admin sebelum mengedit.');
  return project;
}

export async function saveDraft(client, id, values) {
  const payload = projectValues(values);
  const query = id
    ? client.from('projects').update(payload).eq('id', id).eq('status', 'draft')
    : client.from('projects').insert({ ...payload, status: 'draft' });
  const { data, error } = await query.select().single();
  if (error || !data) throw new Error('Draft gagal disimpan. Periksa koneksi dan pastikan project masih berstatus draft.');
  return data;
}

export async function readImages(client, id) {
  const { data, error } = await client.from('project_images').select('*').eq('project_id', id)
    .order('sort_order').order('created_at').order('id');
  if (error) throw new Error('Daftar screenshot gagal dimuat. Coba muat ulang screenshot.');
  return data || [];
}

export async function uploadScreenshot(client, projectId, file, altText, order) {
  const extension = validateImage(file);
  const alt = altText.trim();
  if (!alt || alt.length > 300) throw new Error('Keterangan screenshot wajib diisi, maksimal 300 karakter.');
  await requireDraft(client, projectId);
  const id = crypto.randomUUID();
  const path = `${projectId}/${id}.${extension}`;
  const bucket = client.storage.from(SCREENSHOT_BUCKET);
  const upload = await bucket.upload(path, file, { contentType: file.type, upsert: false });
  if (upload.error) throw new Error('Upload screenshot gagal. Periksa koneksi dan konfigurasi bucket.');
  const row = { id, project_id: projectId, storage_path: path, alt_text: alt, sort_order: order, is_cover: false };
  const result = await client.from('project_images').insert(row).select().single();
  if (!result.error) return result.data;
  // A response may be lost after INSERT commits. Reconcile before deleting the file.
  const check = await client.from('project_images').select('*').eq('id', id).maybeSingle();
  if (check.data) return check.data;
  if (check.error) throw new Error('Status upload belum dapat dipastikan. Muat ulang screenshot sebelum mencoba lagi.');
  const cleanup = await bucket.remove([path]);
  if (cleanup.error) throw new Error(`Metadata gagal disimpan. File tersisa di Storage: ${path}. Hapus melalui dashboard Supabase setelah koneksi pulih.`);
  throw new Error('Metadata screenshot gagal disimpan. Upload telah dibersihkan; silakan coba lagi.');
}

export async function updateScreenshot(client, image, { alt_text, sort_order }) {
  const alt = alt_text.trim();
  const order = Number(sort_order);
  if (!alt || alt.length > 300) throw new Error('Keterangan screenshot wajib diisi, maksimal 300 karakter.');
  if (!Number.isInteger(order) || order < 0 || order > 2147483647) throw new Error('Urutan screenshot tidak valid.');
  await requireDraft(client, image.project_id);
  const result = await client.from('project_images').update({ alt_text: alt, sort_order: order })
    .eq('id', image.id).eq('project_id', image.project_id).select().single();
  if (result.error || !result.data) throw new Error('Detail screenshot gagal disimpan.');
}

export async function setCover(client, image) {
  await requireDraft(client, image.project_id);
  const reset = await client.from('project_images').update({ is_cover: false }).eq('project_id', image.project_id).eq('is_cover', true);
  if (reset.error) throw new Error('Gambar utama sebelumnya gagal diperbarui.');
  const result = await client.from('project_images').update({ is_cover: true }).eq('id', image.id)
    .eq('project_id', image.project_id).select().single();
  if (result.error || !result.data) throw new Error('Gambar utama belum tersimpan. Gambar pertama akan digunakan sementara. Coba pilih kembali.');
}

export async function deleteScreenshot(client, image) {
  await requireDraft(client, image.project_id);
  // Delete the actual file before its metadata, so failed removal remains retryable.
  const removal = await client.storage.from(SCREENSHOT_BUCKET).remove([image.storage_path]);
  if (removal.error) throw new Error('File gagal dihapus. Metadata tetap disimpan agar bisa dicoba lagi.');
  const result = await client.from('project_images').delete().eq('id', image.id).eq('project_id', image.project_id);
  if (result.error) throw new Error('File sudah dihapus, tetapi metadata belum terhapus. Coba hapus screenshot ini kembali.');
}
