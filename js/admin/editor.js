import { getSupabase } from '../supabase-client.js';
import { verifyAdmin } from '../services/admin.mjs';
import { projectValues, validateImage, requireDraft, saveDraft, readImages, uploadScreenshot,
  updateScreenshot, setCover, deleteScreenshot, SCREENSHOT_BUCKET } from '../services/project-editor.mjs';

const $ = id => document.getElementById(id);
let client, projectId = new URLSearchParams(location.search).get('id');
let images = [], imageUrls = [], localUrl = null, dirty = false, busy = false, authorized = false;
let generation = 0;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function node(tag, text = '', className = '') {
  const el = document.createElement(tag); el.textContent = text; el.className = className; return el;
}
function values() {
  return { title: $('title').value, description: $('description').value, technologies: $('technologies').value,
    demo_url: $('demo-url').value, sort_order: $('sort-order').value };
}
function clearImages() {
  $('image-list').replaceChildren(); $('preview-images').replaceChildren();
  imageUrls.forEach(url => URL.revokeObjectURL(url)); imageUrls = []; images = [];
}
function clearLocal() {
  if (localUrl) URL.revokeObjectURL(localUrl);
  localUrl = null; $('local-preview').hidden = true; $('local-preview').removeAttribute('src');
}
function lock(message) {
  authorized = false; generation++; dirty = false;
  $('editor').hidden = true; $('preview-dialog').close(); clearImages(); clearLocal();
  $('project-form').reset(); $('upload-form').reset();
  $('access-panel').hidden = false; $('access-message').textContent = message;
}
function controls(disabled) {
  $('project-fields').disabled = disabled;
  $('upload-fields').disabled = disabled || !projectId;
  $('reload-images').disabled = disabled || !projectId;
  $('preview-button').disabled = disabled;
  $('image-list').querySelectorAll('button, input').forEach(el => { el.disabled = disabled; });
}
async function checkAccess() {
  try {
    if (!await verifyAdmin(client)) {
      lock('Sesi berakhir. Silakan login kembali.');
      location.replace('./login.html');
      throw new Error('Sesi berakhir. Silakan login kembali.');
    }
  } catch (error) { lock(error.message); throw error; }
}
async function action(messageId, task) {
  if (busy || !authorized) return;
  busy = true; controls(true);
  $(messageId).textContent = 'Memproses…';
  try { await checkAccess(); await task(); }
  catch (error) { $(messageId).textContent = error.message; }
  finally { busy = false; controls(false); }
}

async function refreshImages() {
  const version = ++generation;
  clearImages();
  const rows = await readImages(client, projectId);
  if (version !== generation || !authorized) return;
  images = rows;
  let failed = 0;
  for (const image of rows) {
    const result = await client.storage.from(SCREENSHOT_BUCKET).download(image.storage_path);
    if (version !== generation || !authorized) return;
    if (!result.error && result.data) {
      image.previewUrl = URL.createObjectURL(result.data); imageUrls.push(image.previewUrl);
    } else failed++;
    renderImage(image);
  }
  $('image-message').textContent = failed
    ? `${rows.length} screenshot tersimpan; ${failed} preview gagal dimuat. Coba muat ulang.`
    : (rows.length ? `${rows.length} screenshot tersimpan. Jika belum memilih gambar utama, gambar pertama digunakan.` : 'Belum ada screenshot.');
}

function renderImage(image) {
  const card = node('article', '', 'project-item screenshot-item');
  if (image.previewUrl) {
    const img = document.createElement('img'); img.src = image.previewUrl; img.alt = image.alt_text;
    img.className = 'screenshot-thumbnail'; card.append(img);
  } else card.append(node('p', 'Preview gambar belum tersedia.'));
  card.append(node('p', image.is_cover ? 'GAMBAR UTAMA' : 'SCREENSHOT', 'eyebrow'));
  const form = document.createElement('form');
  const altLabel = node('label', 'Keterangan gambar');
  const alt = document.createElement('input'); alt.value = image.alt_text; alt.required = true; alt.maxLength = 300;
  altLabel.append(alt);
  const orderLabel = node('label', 'Urutan screenshot');
  const order = document.createElement('input'); order.type = 'number'; order.min = '0'; order.max = '2147483647'; order.step = '1'; order.required = true; order.value = image.sort_order;
  orderLabel.append(order);
  const save = node('button', 'Simpan detail gambar'); save.type = 'submit';
  form.append(altLabel, orderLabel, save);
  form.addEventListener('submit', event => {
    event.preventDefault(); action('image-message', async () => {
      await updateScreenshot(client, image, { alt_text: alt.value, sort_order: order.value });
      await refreshImages(); $('image-message').textContent = 'Detail screenshot disimpan.';
    });
  });
  const cover = node('button', 'Jadikan gambar utama'); cover.type = 'button';
  cover.addEventListener('click', () => action('image-message', async () => {
    try { await setCover(client, image); }
    catch (error) { await refreshImages(); throw error; }
    await refreshImages(); $('image-message').textContent = 'Gambar utama diperbarui.';
  }));
  const remove = node('button', 'Hapus screenshot', 'danger'); remove.type = 'button';
  remove.addEventListener('click', () => {
    if (!confirm(`Hapus screenshot "${image.alt_text}"? File akan dihapus dari penyimpanan.`)) return;
    action('image-message', async () => {
      await deleteScreenshot(client, image); await refreshImages(); $('image-message').textContent = 'Screenshot dihapus.';
    });
  });
  card.append(form, cover, remove); $('image-list').append(card);
}

$('project-form').addEventListener('input', () => { dirty = true; });
$('project-form').addEventListener('submit', event => {
  event.preventDefault(); action('editor-message', async () => {
    const saved = await saveDraft(client, projectId, values());
    if (!authorized) return;
    projectId = saved.id; history.replaceState(null, '', `project.html?id=${encodeURIComponent(projectId)}`);
    dirty = false; $('editor-title').textContent = 'Edit project.';
    $('upload-hint').textContent = 'Screenshot disimpan langsung ke draft ini setelah upload. Untuk mengganti gambar, upload penggantinya lalu hapus gambar lama.';
    $('editor-message').textContent = 'Draft berhasil disimpan. Project belum dipublikasikan.';
  });
});

$('screenshot-file').addEventListener('change', async () => {
  clearLocal();
  const file = $('screenshot-file').files[0];
  if (!file) return;
  try {
    validateImage(file);
    localUrl = URL.createObjectURL(file);
    $('local-preview').src = localUrl; $('local-preview').hidden = false;
    await $('local-preview').decode();
    $('image-message').textContent = 'Preview lokal siap. Tekan Upload screenshot untuk menyimpannya.';
  } catch (error) {
    clearLocal(); $('screenshot-file').value = '';
    $('image-message').textContent = error.message || 'File gambar tidak dapat dibaca.';
  }
});
$('upload-form').addEventListener('submit', event => {
  event.preventDefault(); action('image-message', async () => {
    const file = $('screenshot-file').files[0];
    if (!file) throw new Error('Pilih screenshot terlebih dahulu.');
    validateImage(file);
    await $('local-preview').decode();
    const order = Math.min(2147483647, images.reduce((max, img) => Math.max(max, img.sort_order + 1), 0));
    await uploadScreenshot(client, projectId, file, $('screenshot-alt').value, order);
    $('upload-form').reset(); clearLocal();
    await refreshImages();
  });
});
$('reload-images').addEventListener('click', () => action('image-message', refreshImages));

$('preview-button').addEventListener('click', () => {
  try {
    const data = projectValues(values());
    $('preview-title').textContent = data.title;
    $('preview-description').textContent = data.description || 'Belum ada deskripsi.';
    $('preview-technologies').replaceChildren(...data.technologies.map(tech => node('span', tech)));
    $('preview-demo').hidden = !data.demo_url;
    $('preview-demo').removeAttribute('href');
    if (data.demo_url) $('preview-demo').href = data.demo_url;
    const ordered = [...images].sort((a, b) => Number(b.is_cover) - Number(a.is_cover));
    $('preview-images').replaceChildren(...ordered.map(image => {
      const figure = document.createElement('figure');
      if (image.previewUrl) { const img = document.createElement('img'); img.src = image.previewUrl; img.alt = image.alt_text; figure.append(img); }
      figure.append(node('figcaption', image.alt_text)); return figure;
    }));
    if (!ordered.length) $('preview-images').append(node('p', 'Belum ada screenshot tersimpan.'));
    $('preview-dialog').showModal();
  } catch (error) { $('editor-message').textContent = error.message; }
});
$('close-preview').addEventListener('click', () => $('preview-dialog').close());
window.addEventListener('beforeunload', event => {
  if (dirty || busy || $('screenshot-file').files.length) { event.preventDefault(); event.returnValue = ''; }
});
window.addEventListener('pagehide', () => lock('Memeriksa akses admin…'));
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });

try {
  if (projectId && !uuid.test(projectId)) throw new Error('ID project tidak valid. Buka project dari daftar admin.');
  client = await getSupabase();
  client.auth.onAuthStateChange(event => {
    if (event === 'SIGNED_OUT') { lock('Sesi berakhir. Silakan login kembali.'); location.replace('./login.html'); }
  });
  await checkAccess(); authorized = true;
  if (projectId) {
    const data = await requireDraft(client, projectId);
    $('title').value = data.title; $('description').value = data.description;
    $('technologies').value = data.technologies.join(', '); $('demo-url').value = data.demo_url || '';
    $('sort-order').value = data.sort_order; $('editor-title').textContent = 'Edit project.';
    $('upload-hint').textContent = 'Screenshot disimpan langsung ke draft ini setelah upload. Untuk mengganti gambar, upload penggantinya lalu hapus gambar lama.';
  }
  $('access-panel').hidden = true; $('editor').hidden = false; controls(false);
  if (projectId) await action('image-message', refreshImages);
} catch (error) { lock(error.message); }
