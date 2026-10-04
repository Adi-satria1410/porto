import { projectValues, readProject, readImages, SCREENSHOT_BUCKET } from './project-editor-service.mjs';
import { verifyAdmin } from './admin-service.mjs';

export function validatePublication(project, images) {
  projectValues({ ...project, technologies: project.technologies.join(', '), demo_url: project.demo_url || '' });
  if (!project.description.trim()) throw new Error('Isi deskripsi sebelum publish.');
  if (!project.technologies.some(value => value.trim())) throw new Error('Isi minimal satu teknologi sebelum publish.');
  if (!images.length) throw new Error('Upload minimal satu screenshot sebelum publish.');
}

export async function changePublication(client, id, publish) {
  if (!await verifyAdmin(client)) throw new Error('Silakan login kembali.');
  const project = await readProject(client, id);
  const next = publish ? 'published' : 'draft';
  if (project.status === next) return;
  if (publish) {
    const images = await readImages(client, id);
    validatePublication(project, images);
    for (const image of images) {
      const result = await client.storage.from(SCREENSHOT_BUCKET).download(image.storage_path);
      if (result.error || !result.data) throw new Error('Screenshot tidak dapat dibaca. Periksa gambar dan koneksi sebelum publish.');
    }
  }
  const result = await client.from('projects').update({ status: next }).eq('id', id)
    .eq('status', project.status).eq('updated_at', project.updated_at).select('id').single();
  if (result.error || !result.data) throw new Error('Status belum dapat diperbarui. Muat ulang daftar untuk memeriksa hasil dan coba lagi.');
}

export function orderedImages(images) {
  return [...images].sort((a, b) => Number(b.is_cover) - Number(a.is_cover)
    || a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));
}
export function safeDemo(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export async function loadPublished(client, page = 0, pageSize = 9) {
  const result = await client.from('projects')
    .select('id,title,description,technologies,demo_url,project_images(id,storage_path,alt_text,is_cover,sort_order,created_at)', { count: 'exact' })
    .eq('status', 'published').order('sort_order').order('created_at').order('id')
    .range(page * pageSize, (page + 1) * pageSize - 1);
  if (result.error) throw new Error('Koleksi belum dapat dimuat. Silakan coba lagi.');
  return { projects: result.data || [], count: result.count || 0 };
}
