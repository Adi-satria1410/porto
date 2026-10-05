import { getPublicSupabase } from './supabase-client.js';
import { loadPublished, orderedImages, safeDemo } from './services/publication.mjs';
import { SCREENSHOT_BUCKET } from './services/project-editor.mjs';

const $ = id => document.getElementById(id);
let client, page = 0, generation = 0, urls = [], selected = [], imageIndex = 0, imageRequest = 0, lightboxUrl;
const el = (tag, text = '', className = '') => {
  const node = document.createElement(tag); node.textContent = text; node.className = className; return node;
};

async function cover(image, button, version) {
  try {
    const { data, error } = await client.storage.from(SCREENSHOT_BUCKET).download(image.storage_path);
    if (version !== generation) return;
    if (error || !data) throw new Error();
    const url = URL.createObjectURL(data); urls.push(url);
    const img = document.createElement('img'); img.src = url; img.alt = image.alt_text; img.decoding = 'async';
    button.replaceChildren(img, el('span', 'Lihat screenshot ↗', 'gallery-image-hint'));
  } catch {
    if (version === generation) button.textContent = 'Preview belum tersedia. Klik untuk mencoba membuka gambar.';
  }
}
function card(project, version) {
  const article = el('article', '', 'example-slot published-card');
  const images = orderedImages(project.project_images || []);
  if (images.length) {
    const open = el('button', 'Memuat screenshot…', 'gallery-cover'); open.type = 'button';
    open.setAttribute('aria-label', `Lihat ${images.length} screenshot ${project.title}`);
    open.addEventListener('click', () => {
      selected = images; imageIndex = 0; $('gallery-lightbox').showModal(); showImage();
    });
    article.append(open); cover(images[0], open, version);
  } else article.append(el('p', 'Screenshot belum tersedia.', 'example-slot__preview'));
  const body = el('div', '', 'example-slot__body');
  body.append(el('h3', project.title), el('p', project.description, 'gallery-description'));
  const tags = el('div', '', 'gallery-tags');
  project.technologies.forEach(tech => tags.append(el('span', tech)));
  body.append(tags);
  const url = safeDemo(project.demo_url);
  if (url) {
    const link = el('a', 'Lihat demo ↗', 'text-link'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; body.append(link);
  }
  article.append(body); return article;
}

async function load() {
  const version = ++generation;
  $('gallery-lightbox').close();
  $('published-projects').replaceChildren(); urls.forEach(url => URL.revokeObjectURL(url)); urls = [];
  $('published-projects').setAttribute('aria-busy', 'true');
  $('collection-message').textContent = 'Memuat koleksi project…';
  $('collection-page').textContent = '';
  $('collection-retry').hidden = true;
  $('collection-previous').disabled = $('collection-next').disabled = true;
  try {
    client = await getPublicSupabase();
    const result = await loadPublished(client, page);
    if (version !== generation) return;
    if (page > 0 && page * 9 >= result.count) { page = 0; return load(); }
    $('published-projects').replaceChildren(...result.projects.map(project => card(project, version)));
    $('collection-message').textContent = result.count ? `${result.count} project dipublikasikan.` : 'Segera hadir. Belum ada project yang dipublikasikan.';
    if (result.count) $('collection-page').textContent = `${page + 1} / ${Math.ceil(result.count / 9)}`;
    $('collection-previous').disabled = page === 0;
    $('collection-next').disabled = (page + 1) * 9 >= result.count;
  } catch {
    if (version === generation) {
      $('collection-message').textContent = 'Koleksi belum dapat dimuat. Periksa koneksi dan coba lagi.';
      $('collection-retry').hidden = false;
    }
  } finally { if (version === generation) $('published-projects').setAttribute('aria-busy', 'false'); }
}

async function showImage() {
  const request = ++imageRequest;
  const image = selected[imageIndex];
  $('gallery-image').hidden = true; $('gallery-image').removeAttribute('src');
  if (lightboxUrl) URL.revokeObjectURL(lightboxUrl);
  lightboxUrl = null;
  $('gallery-caption').textContent = `${imageIndex + 1} / ${selected.length} — ${image.alt_text}`;
  $('gallery-error').textContent = 'Memuat gambar…';
  $('image-previous').disabled = imageIndex === 0;
  $('image-next').disabled = imageIndex === selected.length - 1;
  try {
    const { data, error } = await client.storage.from(SCREENSHOT_BUCKET).download(image.storage_path);
    if (request !== imageRequest || !$('gallery-lightbox').open) return;
    if (error || !data) throw new Error();
    lightboxUrl = URL.createObjectURL(data);
    $('gallery-image').src = lightboxUrl; $('gallery-image').alt = image.alt_text;
    await $('gallery-image').decode();
    if (request !== imageRequest) return;
    $('gallery-image').hidden = false; $('gallery-error').textContent = '';
  } catch {
    if (request === imageRequest) $('gallery-error').textContent = 'Gambar tidak tersedia. Tutup dan buka kembali untuk mencoba lagi.';
  }
}
$('collection-retry').addEventListener('click', load);
$('collection-previous').addEventListener('click', () => { if (page > 0) { page--; load(); } });
$('collection-next').addEventListener('click', () => { page++; load(); });
$('gallery-close').addEventListener('click', () => $('gallery-lightbox').close());
$('gallery-lightbox').addEventListener('close', () => {
  imageRequest++; $('gallery-image').removeAttribute('src'); $('gallery-image').hidden = true;
  if (lightboxUrl) URL.revokeObjectURL(lightboxUrl); lightboxUrl = null;
});
$('image-previous').addEventListener('click', () => { if (imageIndex > 0) { imageIndex--; showImage(); } });
$('image-next').addEventListener('click', () => { if (imageIndex < selected.length - 1) { imageIndex++; showImage(); } });
$('gallery-lightbox').addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); $('image-previous').click(); }
  if (event.key === 'ArrowRight') { event.preventDefault(); $('image-next').click(); }
});
window.addEventListener('pagehide', () => {
  generation++; $('gallery-lightbox').close(); urls.forEach(url => URL.revokeObjectURL(url)); urls = [];
});
window.addEventListener('pageshow', event => { if (event.persisted) load(); });
load();
