import { getSupabase } from '../supabase-client.js';
import { verifyAdmin, loadProjects } from '../services/admin.mjs';
import { changePublication } from '../services/publication.mjs';
import { deleteProject } from '../services/project-delete.mjs';

const $ = (id) => document.getElementById(id);
let client, page = 0, request = 0, allowed = false;
const pageSize = 12;
let search = '', status = '';
let publishing = false;

function lock(message) {
  allowed = false;
  request++;
  $('dashboard').hidden = true;
  $('project-list').replaceChildren();
  $('account-email').textContent = '';
  $('access-panel').hidden = false;
  $('access-message').textContent = message;
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function render(projects) {
  $('project-list').replaceChildren(...projects.map((project) => {
    const card = element('article', '', 'project-item');
    card.append(element('p', project.status === 'published' ? 'Published' : 'Draft', `badge badge--${project.status}`));
    card.append(element('h2', project.title));
    card.append(element('p', project.description || 'Belum ada deskripsi.', 'project-description'));
    const tags = element('div', '', 'tags');
    project.technologies.forEach((tech) => tags.append(element('span', tech)));
    card.append(tags);
    const date = new Date(project.updated_at).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium' });
    card.append(element('p', `Urutan ${project.sort_order} · Diperbarui ${date}`, 'project-meta'));
    if (project.status === 'draft') {
      const edit = element('a', 'Edit draft ↗');
      edit.href = `project.html?id=${encodeURIComponent(project.id)}`;
      card.append(edit);
    }
    const publish = element('button', project.status === 'draft' ? 'Publish project' : 'Kembalikan ke draft');
    publish.type = 'button';
    publish.addEventListener('click', async () => {
      if (publishing) return;
      const isPublish = project.status === 'draft';
      if (!confirm(isPublish ? `Publikasikan "${project.title}" ke portfolio?` : `Sembunyikan "${project.title}" dari portfolio dan kembalikan ke draft?`)) return;
      publishing = true; publish.disabled = true;
      $('list-message').textContent = 'Memperbarui status project…';
      try {
        await changePublication(client, project.id, isPublish);
        await refresh();
      } catch (error) { $('list-message').textContent = error.message; }
      finally { publishing = false; publish.disabled = false; }
    });
    card.append(publish);
    const remove = element('button', 'Hapus project', 'danger');
    remove.type = 'button';
    remove.addEventListener('click', async () => {
      if (publishing || !allowed) return;
      if (!confirm(`Hapus permanen project "${project.title}" beserta seluruh screenshot? Tindakan ini tidak dapat dibatalkan. Jika penghapusan file gagal, project tetap draft agar bisa dicoba lagi. Jangan edit project ini di tab lain selama proses berjalan.`)) return;
      publishing = true;
      $('project-list').querySelectorAll('button').forEach(button => { button.disabled = true; });
      $('list-message').textContent = 'Menghapus project dan screenshot…';
      let message;
      try {
        await deleteProject(client, project.id);
        message = 'Project dan seluruh screenshot berhasil dihapus.';
      } catch (error) { message = error.message; }
      finally {
        // A failed deletion may already have changed published -> draft.
        await refresh();
        publishing = false;
        if (allowed) $('list-message').textContent = message;
      }
    });
    card.append(remove);
    return card;
  }));
}

async function refresh() {
  const current = ++request;
  $('previous').disabled = $('next').disabled = true;
  $('project-list').setAttribute('aria-busy', 'true');
  $('project-list').replaceChildren();
  $('page-label').textContent = '';
  $('list-message').textContent = 'Memuat project…';
  try {
    const user = await verifyAdmin(client);
    if (current !== request) return;
    if (!user) { lock('Silakan login untuk membuka admin.'); window.location.replace('./login.html'); return; }
    const result = await loadProjects(client, { search, status, page, pageSize });
    if (current !== request || !allowed) return;
    if (page > 0 && page * pageSize >= result.count) { page = 0; return refresh(); }
    render(result.projects);
    $('list-message').textContent = result.count
      ? `${result.count} project ditemukan.`
      : (search || status ? 'Tidak ada project yang cocok dengan pencarian ini.' : 'Belum ada project yang tersimpan.');
    $('page-label').textContent = `Halaman ${page + 1} / ${Math.max(1, Math.ceil(result.count / pageSize))}`;
    $('previous').disabled = page === 0;
    $('next').disabled = (page + 1) * pageSize >= result.count;
  } catch (error) {
    if (current === request) $('list-message').textContent = error.message;
  } finally {
    if (current === request) $('project-list').setAttribute('aria-busy', 'false');
  }
}

$('filters').addEventListener('submit', (event) => {
  event.preventDefault(); search = $('search').value; status = $('status').value; page = 0; refresh();
});
$('refresh').addEventListener('click', refresh);
$('previous').addEventListener('click', () => { if (page > 0) { page--; refresh(); } });
$('next').addEventListener('click', () => { page++; refresh(); });
$('logout').addEventListener('click', async () => {
  $('logout').disabled = true;
  try {
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error) throw error;
    lock('Kamu sudah keluar.'); window.location.replace('./login.html');
  } catch {
    $('list-message').textContent = 'Gagal keluar. Periksa koneksi lalu coba lagi.';
    $('logout').disabled = false;
  }
});

window.addEventListener('beforeunload', event => {
  if (publishing) { event.preventDefault(); event.returnValue = ''; }
});

// Recheck after Back/Forward cache restoration, without showing cached data.
window.addEventListener('pagehide', () => lock('Memeriksa akses admin…'));
window.addEventListener('pageshow', (event) => { if (event.persisted) window.location.reload(); });

try {
  client = await getSupabase();
  client.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      lock('Sesi berakhir. Silakan login kembali.');
      window.location.replace('./login.html');
    }
    if ((event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN' || event === 'USER_UPDATED') && allowed) {
      setTimeout(refresh, 0);
    }
  });
  const user = await verifyAdmin(client);
  if (!user) window.location.replace('./login.html');
  else {
    allowed = true;
    $('account-email').textContent = user.email;
    $('access-panel').hidden = true;
    $('dashboard').hidden = false;
    await refresh();
  }
} catch (error) { lock(error.message); }
