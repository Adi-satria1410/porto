import { getSupabase } from './supabase-client.js';
import { verifyAdmin } from './admin-service.mjs';

const form = document.getElementById('login-form');
const fields = document.getElementById('login-fields');
const message = document.getElementById('login-message');
const password = document.getElementById('password');
const submit = document.getElementById('login-submit');
let client;

document.getElementById('show-password').addEventListener('change', (event) => {
  password.type = event.target.checked ? 'text' : 'password';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!client || fields.disabled) return;
  fields.disabled = true;
  submit.textContent = 'Memeriksa akun…';
  message.textContent = '';
  try {
    const result = await client.auth.signInWithPassword({
      email: document.getElementById('email').value.trim(), password: password.value,
    });
    if (result.error) throw new Error('Login gagal. Periksa email, password, dan koneksi internet kamu.');
    const user = await verifyAdmin(client);
    if (!user) throw new Error('Sesi belum tersedia. Silakan coba login kembali.');
    window.location.replace('./index.html');
  } catch (error) {
    message.textContent = error.message;
    password.value = '';
  } finally {
    fields.disabled = false;
    submit.textContent = 'Masuk ke admin ↗';
  }
});

try {
  client = await getSupabase();
  try {
    if (await verifyAdmin(client)) window.location.replace('./index.html');
    else message.textContent = '';
  } catch (error) { message.textContent = error.message; }
  fields.disabled = false;
} catch (error) { message.textContent = error.message; }
