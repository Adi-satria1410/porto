# ASR Portfolio

Portfolio HTML/CSS/vanilla JavaScript dengan admin project dan Supabase
(Auth, Database, Storage). Deployment menggunakan Vercel.

## Struktur

```text
index.html               Beranda portfolio
contoh-project.html      Galeri project published
admin/                   Halaman login, daftar, dan editor project
css/                     Stylesheet bersama dan per halaman
js/
  admin/                 Interaksi halaman admin
  services/              Logika akses, edit, publikasi, dan penghapusan
  supabase-config.js     Project URL dan publishable key
  supabase-client.js     Koneksi admin dan publik
  public-projects.js     Galeri dan lightbox publik
  main.js                Navigasi, FAQ, dan lightbox beranda
  animations.js          Animasi beranda
assets/                  Gambar dan aset website
supabase/                Panduan, migrasi, dan tes akses SQL
tests/                   Tes logika, browser, serta fixture simulasi
scripts/                 Build website statis
docs/                    Panduan deployment dan laporan QA
  archive/               Arsip dokumen rancangan lama
dist/                    Hasil build, dibuat otomatis (diabaikan Git)
.qa-tools/               Dependency browser QA lokal (diabaikan Git)
```

## Mulai

1. Ikuti [setup Supabase](supabase/README.md).
2. Isi `js/supabase-config.js` dengan Project URL dan publishable key.
3. Buka lewat HTTP/HTTPS melalui Laragon, bukan `file://`.
4. Admin tersedia di `/admin/login.html` (atau `/PORTO/admin/login.html`
   jika memakai `localhost/PORTO`).

## Build dan tes

```powershell
node scripts/build-static.mjs
node --test --test-isolation=none tests/*.test.mjs
```

Build hanya menyalin file website ke `dist/`; tidak memerlukan npm install.
Tes browser menggunakan tooling terpisah yang dijelaskan dalam laporan QA.

- [Panduan deployment Vercel](docs/DEPLOYMENT.md)
- [Hasil pengujian dan cara mengulang QA](docs/QA-REPORT.md)
- [Konfigurasi Vercel](vercel.json)

Jangan mengedit `dist/` langsung. File konfigurasi browser hanya menggunakan
publishable key; secret key dan password database tidak digunakan frontend.
