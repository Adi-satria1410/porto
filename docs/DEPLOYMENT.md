# Deployment portfolio ke Vercel

Project ini tetap memakai HTML, CSS, dan vanilla JavaScript. Supabase menyediakan
Auth, database, dan Storage. Node.js hanya menyalin file website saat build;
tidak ada server Node.js, Next.js, atau PHP yang perlu dijalankan.

Panduan ini menyiapkan deployment. Belum ada push Git, perubahan dashboard Vercel,
atau deployment yang dilakukan pada tahap 6.

## 1. Pastikan konfigurasi Supabase

Jika setup tahap sebelumnya sudah selesai, jangan menjalankan ulang migrasi awal.
Untuk project Supabase baru, ikuti [panduan Supabase](../supabase/README.md).

File [js/supabase-config.js](../js/supabase-config.js) harus berisi:

```js
export const supabaseConfig = {
  url: 'https://PROJECT-REF.supabase.co',
  publishableKey: 'sb_publishable_...',
};
```

`url` adalah Project URL Supabase, **bukan alamat Vercel**. Key dan URL harus berasal
dari project Supabase yang sama. Publishable key memang digunakan browser;
jangan menggantinya dengan secret key, service_role, atau password database.

Konfigurasi sekarang dibaca dari file tersebut. Mengisi Environment Variables di
Vercel saja tidak mengganti nilainya. Jika URL/key berubah, edit file dan deploy ulang.
Preview dan production yang memakai file konfigurasi sama mengakses database sama;
gunakan project Supabase terpisah bila membutuhkan lingkungan percobaan terisolasi.

Pada Supabase:

- Matikan pendaftaran publik dan aktifkan login email/password.
- Pastikan akun admin sudah dibuat, dapat login dengan password, dan UUID-nya
  terdaftar dalam `public.portfolio_admins`.
- Pertahankan RLS pada tabel dan bucket `project-screenshots` dalam keadaan privat.
- Di Authentication → URL Configuration, set Site URL ke domain produksi kamu,
  misalnya `https://porto-neon-phi.vercel.app` jika masih itu domain yang dipakai.

Login saat ini memakai email/password dan berpindah halaman lewat JavaScript;
tidak membutuhkan OAuth callback atau wildcard redirect. Form lupa password,
email invitation callback, dan OAuth belum dibuat. Site URL digunakan oleh alur
Auth yang memerlukan redirect/email; pengaturannya tidak mengganti Project URL.
Rujukan: [Supabase redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).

## 2. Build lokal

Dari root repository, jalankan:

```powershell
node scripts/build-static.mjs
```

Tidak perlu `npm install`. Script memakai modul bawaan Node.js, memeriksa format
konfigurasi publik, lalu membuat ulang `dist/` dari:

```text
dist/
  index.html
  contoh-project.html
  admin/
  css/
  js/
  assets/
```

`dist/` adalah output yang dapat dibuat ulang; jangan mengeditnya langsung.
Folder tes, SQL Supabase, dokumentasi, `.qa-tools`, dan file `.env` tidak masuk
output. Build tidak mengecek kecocokan key ke server dan tidak mengubah Supabase.

Untuk membuka hasil build secara lokal:

```powershell
python -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Lalu buka `http://127.0.0.1:8080/`. Hentikan server dengan Ctrl+C setelah selesai.
Jangan membuka HTML menggunakan `file://`, karena fitur admin memakai ES modules.

Jika tooling browser QA dari tahap 5 tersedia, pemeriksaan hasil build dengan
koneksi Supabase asli tanpa login/mutasi dapat diulang melalui:

```powershell
node tests/browser-qa.mjs --live-readonly --built
```

## 3. Pengaturan Vercel

Untuk project yang sudah terhubung ke repository, gunakan project Vercel tersebut.
Untuk project baru, import repository yang berisi root website ini.

| Pengaturan | Nilai |
| --- | --- |
| Root Directory | Folder yang memuat `vercel.json` dan `index.html` |
| Framework Preset | Other |
| Install Command | Dilewati / kosong |
| Build Command | `node scripts/build-static.mjs` |
| Output Directory | `dist` |
| Environment Variables | Tidak diperlukan oleh implementasi sekarang |

[vercel.json](../vercel.json) menetapkan build, install, dan output tersebut.
Tidak perlu menjalankan `npm run build` atau memilih Next.js. `cleanUrls: false`
mempertahankan link `.html` yang dipakai aplikasi. Jangan menambahkan rewrite semua
URL ke `index.html`, karena admin tetap menggunakan halaman HTML terpisah.
Vercel mendukung override ini melalui
[konfigurasi vercel.json](https://vercel.com/docs/project-configuration/vercel-json).

File [`.vercelignore`](../.vercelignore) mengurangi file yang dikirim melalui CLI.
Untuk deployment berbasis Git, pembatas file publik tetap berasal dari script build
dan Output Directory `dist`, sehingga tidak bergantung pada aturan ignore CLI.
Rujukan: [Vercel build features](https://vercel.com/docs/builds/build-features).

## 4. Memublikasikan perubahan kode

Pastikan file baru (`admin/`, modul JS, `scripts/`, dan `vercel.json`) sudah ikut
commit ke repository. Folder `dist/` tidak perlu di-commit karena Vercel membangunnya.
Pilih branch sesuai pengaturan project: branch production dapat langsung memicu
deployment production, sedangkan branch lain umumnya menghasilkan preview.

Untuk review, deploy ke preview dahulu. Setelah pemeriksaan berhasil, gunakan
alur merge/promote production yang biasa kamu pakai. Panduan ini tidak menjalankan
langkah tersebut secara otomatis.

URL setelah deployment:

| Halaman | Path |
| --- | --- |
| Portfolio | `/` |
| Contoh Project | `/index.html#contoh-project` (URL lama `/contoh-project.html` dialihkan ke sini) |
| Login admin | `/admin/login.html` |
| Daftar project | `/admin/index.html` |
| Tambah project | `/admin/project.html` |

## 5. Pemeriksaan setelah deploy

1. Buka beranda dan galeri di desktop/HP; pastikan CSS, gambar, dan navigasi tampil.
2. Tanpa login, buka daftar admin dan editor; keduanya harus mengarah ke login.
3. Login memakai akun admin yang sudah dibuat. Buat draft percobaan dan upload
   screenshot kecil yang boleh digunakan sebagai contoh publik.
4. Buka galeri di jendela incognito: draft tidak boleh tampil.
5. Periksa preview, lalu publish jika kontennya sudah siap terlihat publik.
   Muat ulang galeri incognito; periksa kartu, demo, dan lightbox.
6. Kembalikan project ke draft dan muat ulang galeri; project harus menghilang.
   Gambar yang sudah diunduh pengunjung tidak dapat ditarik kembali.
7. Logout dan tekan Back; data admin tidak boleh tampil kembali.
8. Untuk membersihkan project percobaan, login kembali dan pilih **Hapus project**.
   Pastikan nama pada konfirmasi benar. Periksa bahwa kartu hilang dan screenshot
   dalam folder UUID project tersebut sudah dihapus. Jangan gunakan project asli
   yang masih ingin dipertahankan untuk pengujian ini.

Perubahan konten melalui admin tidak memerlukan deploy ulang. Galeri mengambil
data ketika dibuka atau dimuat ulang. Perubahan HTML/CSS/JS atau konfigurasi perlu
deployment kode baru.

## Troubleshooting

| Gejala | Pemeriksaan |
| --- | --- |
| Build mencari package.json / npm script | Pastikan Framework Other, build script di atas, dan root yang benar |
| Build menolak konfigurasi | Periksa Project URL HTTPS dan key `sb_publishable_...` di file konfigurasi |
| Halaman admin 404 | Periksa `admin/` ikut commit dan hasil build berada di `dist/admin/` |
| Module gagal dimuat / MIME HTML | Hapus catch-all rewrite; periksa `.js`/`.mjs` ada dalam output dan CDN jsDelivr dapat diakses |
| Login gagal | Periksa email/password, konfirmasi akun, koneksi, dan project Supabase yang dipakai |
| Login berhasil tetapi akses ditolak | Cocokkan UUID akun dengan `portfolio_admins` |
| Upload gagal | Periksa bucket privat, kebijakan Storage tahap 1, format JPG/PNG/WebP, dan batas 5 MiB |
| Project tidak tampil | Periksa status published, hasil refresh galeri, serta kebijakan baca RLS |
| Environment Variable sudah diubah tetapi koneksi sama | Runtime memakai `js/supabase-config.js`; edit file dan deploy ulang |

## Status yang masih perlu dituntaskan

Pada 4 Oktober 2026, build lokal menghasilkan 24 file website. Tautan HTML,
import modul lokal, serta pengecualian file pendukung telah diperiksa. Pemeriksaan
Chrome terhadap `dist` juga berhasil memuat SDK asli, mengarahkan akses admin
anonim ke login, dan membaca galeri dari Supabase. Ini pengujian output lokal,
bukan konfirmasi deployment Vercel.

[Laporan QA](QA-REPORT.md) membedakan tes mock dari pemeriksaan Supabase asli.
Login serta operasi upload/publish/hapus memakai akun admin asli belum diuji pada
tahap 5. Deployment produksi dan pengujian setelah deployment juga belum dilakukan.
Hapus screenshot dan hapus keseluruhan project sudah tersedia, termasuk penanganan
kegagalan Storage dan percobaan ulang. Pengujian penghapusan menggunakan mock;
operasi akun admin asli tetap perlu diverifikasi sebelum production.
