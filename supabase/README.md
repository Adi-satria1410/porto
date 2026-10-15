# Supabase — Panduan dan catatan implementasi

Panduan deployment terkini: [DEPLOYMENT.md](../docs/DEPLOYMENT.md).
Bagian tahap 1–5 di bawah merupakan catatan pekerjaan per tahap; pernyataan
"belum dibuat" pada tahap terdahulu dibaca sesuai waktu tahap tersebut.
Untuk status verifikasi terakhir, lihat [laporan QA](../docs/QA-REPORT.md).

## Tahap 6 — Konfigurasi dan panduan deployment

- `vercel.json` menetapkan build `node scripts/build-static.mjs`, output `dist`,
  dan melewati install dependency. Website tetap HTML/CSS/vanilla JavaScript.
- Script build hanya menyalin halaman, CSS, JavaScript, dan aset website.
  SQL, tes, tooling lokal, dan dokumentasi tidak masuk output publik.
- `.vercelignore` mengecualikan file pendukung dari upload CLI. Deployment Git
  memakai output `dist` yang sama sehingga tidak mengandalkan ignore CLI.
- Project URL serta publishable key tetap dibaca dari `js/supabase-config.js`.
  Environment Variables Vercel tidak otomatis mengganti file tersebut.
- Panduan mencakup setup akun Supabase, pengaturan Vercel, preview/production,
  pemeriksaan setelah deploy, dan troubleshooting.

Tahap ini menyiapkan file dan panduan; tidak melakukan push Git atau deployment.
Pengujian akun admin asli masih tertunda. Fitur hapus keseluruhan project tersedia
melalui pembaruan berikut.

## Pembaruan — Hapus keseluruhan project

Di daftar admin, klik **Hapus project** pada kartu yang ingin dihapus. Konfirmasi
menampilkan nama project dan menjelaskan bahwa penghapusan bersifat permanen.
Pilih Batal untuk kembali tanpa mengubah data.

Setelah konfirmasi, akun admin diperiksa kembali. Project dijadikan draft,
seluruh file screenshot dalam folder UUID project dibersihkan melalui Storage API,
lalu row project dihapus. Foreign key cascade menghapus metadata screenshot.
File upload tanpa metadata di folder yang sama juga ikut dibersihkan.
Folder project lain tidak disentuh; subfolder atau nama file yang tidak dikenali
menghentikan proses agar dapat diperiksa melalui dashboard Supabase.

Jika Storage gagal, row project dan metadata dipertahankan dalam status draft.
Sebagian file mungkin sudah terhapus; setelah koneksi pulih, klik Hapus project
kembali untuk menyelesaikannya. Jika file berhasil dibersihkan tetapi respons
database gagal, muat ulang daftar dan ulangi jika project masih ada.

Operasi Storage dan database tidak bersifat satu transaksi. Jangan edit,
upload, atau publish project yang sama melalui tab lain selama penghapusan.
Perubahan row project diperiksa dengan `updated_at` sebelum penghapusan akhir.
Tidak ada migrasi SQL baru dan tidak ada project Supabase asli yang dihapus
dalam pengujian pengembangan ini.

Referensi: [Storage list](https://supabase.com/docs/reference/javascript/file-buckets-list)
dan [Storage remove](https://supabase.com/docs/reference/javascript/file-buckets-remove).

---

## Tahap 5 — Pengujian dan perbaikan

Pengujian browser lokal kini tersedia di `tests/browser-qa.mjs`, meliputi
alur draft sampai publish/unpublish dengan backend simulasi, serta tampilan
desktop/mobile. Mode `--live-readonly` memeriksa SDK dan akses anonim Supabase asli.
Redirect editor setelah logout lalu Back telah diperbaiki.

Rincian hasil, cara menjalankan ulang, dan batas pengujian ada di
[`docs/QA-REPORT.md`](../docs/QA-REPORT.md). Pengujian mutasi dengan akun admin
asli belum dilakukan. Tidak ada deployment pada tahap ini.

---

## Tahap 4 — Publikasi dan galeri publik

Di daftar admin, **Publish project** memeriksa kelengkapan judul, deskripsi,
minimal satu teknologi, dan minimal satu screenshot yang dapat diunduh.
Tautan demo tetap opsional. Konfirmasi publish akan mengubah status ke published.
Tombol **Kembalikan ke draft** menyembunyikan project dari permintaan galeri
berikutnya. Untuk mengedit project published: kembalikan ke draft, edit,
preview, lalu publish kembali.

Bagian Contoh project di `index.html#contoh-project` membaca project published dari Supabase dengan
pagination 9 project per halaman. Kartu menampilkan cover, nama, deskripsi,
teknologi, dan tautan demo yang valid. Screenshot dapat dibuka dalam dialog
lightbox, dengan tombol sebelumnya/berikutnya, tombol panah keyboard, dan Escape.
Galeri membedakan status memuat, koleksi kosong, dan kegagalan koneksi dengan
tombol coba lagi. Gambar yang gagal diunduh tidak menghilangkan konten project.

Koneksi galeri selalu anonim dan tidak memakai sesi admin yang tersimpan.
RLS tetap menjadi pembatas akses. Gambar privat diunduh melalui Storage API
dan ditampilkan sebagai blob lokal. Pengunjung yang telah memuat gambar/kartu
tetap dapat melihat salinan tersebut hingga halaman dimuat ulang; unpublish
tidak menarik kembali konten yang sudah diunduh.

Tidak ada migrasi SQL baru. Pemeriksaan kelengkapan publish berada pada alur
admin JavaScript, bukan constraint database baru. Admin yang mengubah data
langsung di dashboard Supabase dapat melewati pemeriksaan kelengkapan ini.
Hindari mengedit project yang sama di beberapa tab saat publish; perubahan
informasi project yang bersamaan dideteksi lewat `updated_at`, sedangkan upload
dan metadata gambar masih menggunakan operasi API terpisah.

Kode perlu di-deploy ke Vercel sekali untuk mengaktifkan fitur ini. Setelah itu,
perubahan draft/published dibaca saat galeri dibuka/dimuat ulang tanpa deploy ulang.
Tahap ini tidak melakukan deployment atau mempublikasikan project pengguna.

Tes: `node --test --test-isolation=none tests/*.test.mjs`.
Tes publikasi memakai mock; pemeriksaan langsung publish → galeri → unpublish
memerlukan login admin. Penghapusan keseluruhan project belum termasuk tahap ini.

---

## Tahap 3 — Form draft, screenshot, dan preview

- Buka daftar admin, pilih **Tambah project** atau **Edit draft**.
- Isi nama, deskripsi, teknologi dipisahkan koma, URL demo opsional, dan urutan.
  **Simpan draft** menyimpan informasi project tanpa mempublikasikannya.
- Setelah draft tersimpan, pilih screenshot dan isi keterangannya. Preview lokal
  tampil sebelum **Upload screenshot** menyimpan file dan metadata ke Supabase.
  File harus JPG/PNG/WebP, maksimal 5 MiB. Screenshot diunggah satu per satu.
- Setiap screenshot memiliki tombol simpan keterangan/urutan, jadikan gambar
  utama, dan hapus dengan konfirmasi. Untuk mengganti file, upload gambar baru,
  pilih sebagai utama jika diperlukan, lalu hapus gambar lama.
- **Preview project** menampilkan informasi form saat ini dan screenshot yang
  sudah tersimpan. Preview tidak menyimpan perubahan informasi secara otomatis.
- Perubahan screenshot disimpan langsung melalui tombol masing-masing, terpisah
  dari tombol Simpan draft. Project published belum dapat diedit pada tahap ini.
- Jika upload atau daftar gambar gagal, gunakan **Muat ulang screenshot** untuk
  memeriksa hasil sebelum mengulang. Bila penyimpanan metadata gagal, file upload
  dibersihkan setelah dipastikan belum terhubung ke row metadata. Jika koneksi
  menghalangi pemeriksaan, file dipertahankan untuk menghindari gambar rusak.

Tidak ada migrasi baru untuk tahap ini. Tombol publish/unpublish, penghapusan
project, dan integrasi galeri publik belum diimplementasikan pada tahap 3.

Tes: `node --test --test-isolation=none tests/admin-service.test.mjs tests/project-editor.test.mjs`.
Tes memakai mock; upload/edit dengan akun admin perlu diuji langsung setelah login.
Periksa tambah draft, buka kembali, upload beberapa screenshot, gambar utama,
urutan, URL demo, preview, hapus gambar, dan kegagalan jaringan. Screenshot privat
diunduh menggunakan sesi admin dan ditampilkan melalui URL blob lokal yang
dibersihkan ketika halaman ditutup atau sesi berakhir.

Referensi Storage: https://supabase.com/docs/reference/javascript/file-buckets-upload

---

## Tahap 2 — Login dan daftar project admin

Halaman tersedia di `admin/login.html` dan `admin/index.html`. Jalankan melalui
HTTP/HTTPS (Laragon atau Vercel), bukan membuka file dengan `file://`.

1. Selesaikan migrasi dan penetapan UUID admin pada panduan tahap 1 di bawah.
2. Isi `url` dan `publishableKey` di `js/supabase-config.js` dengan Project URL
   dan key `sb_publishable_...` milik project Supabase yang sama. Keduanya adalah
   konfigurasi publik yang boleh ikut deployment. Jangan masukkan secret key.
3. Buka `/admin/login.html` (atau `/PORTO/admin/login.html` jika memakai
   `localhost/PORTO`). Login dengan email/password akun yang UUID-nya telah
   didaftarkan ke `portfolio_admins`.
4. Setelah login, daftar menampilkan project dari tabel `projects`, pencarian
   judul, filter status, dan 12 item per halaman. Tombol Keluar mengakhiri sesi
   pada browser ini. Tidak ada registrasi publik, form edit, atau upload pada tahap ini.

SDK Supabase dimuat sebagai ES module melalui jsDelivr (`@supabase/supabase-js@2`).
Koneksi internet diperlukan. Tidak diperlukan npm build atau backend Node.js.
Jika konfigurasi belum diisi, halaman menampilkan petunjuk konfigurasi dan login
dinonaktifkan. Environment variables Vercel tidak otomatis mengganti file ini.

Admin diperiksa dengan `auth.getUser()` dan RPC `is_portfolio_admin` sebelum
membaca daftar. HTML admin sendiri adalah file statis yang dapat dibuka siapa
saja; perlindungan data yang sebenarnya berada pada RLS tahap 1. Tidak ada
password atau data project yang disisipkan ke HTML. Konten database dirender
sebagai teks. Sesi disimpan SDK di browser; gunakan Keluar pada perangkat bersama.

Tes lokal logika akses/filter: `node --test tests/admin-service.test.mjs`.
Tes ini memakai mock, bukan koneksi Supabase. Setelah konfigurasi diisi, periksa:

- Membuka admin tanpa login mengarah ke login.
- Password salah dan akun non-admin tidak membuka daftar project.
- Admin dapat melihat draft/published, melakukan pencarian/filter/pagination.
- Koneksi gagal menampilkan pesan kesalahan, bukan pesan koleksi kosong.
- Keluar menutup daftar; tombol Back dan logout dari tab lain tidak menampilkan
  kembali data daftar yang tersimpan di halaman.

Referensi login: https://supabase.com/docs/reference/javascript/auth-getuser

---

## Tahap 1 — Fondasi data project

Stack: HTML/CSS/vanilla JavaScript di Vercel, Supabase untuk data, Auth,
dan Storage. Tahap ini hanya menambahkan migrasi dan pemeriksaan akses.
Belum ada perubahan tampilan, koneksi frontend, atau deployment.

## Struktur

| Tabel | Isi |
| --- | --- |
| `portfolio_admins` | UUID satu akun admin; hanya dapat diatur lewat SQL tepercaya |
| `projects` | Judul, deskripsi, array teknologi, URL demo opsional, draft/published, urutan, waktu |
| `project_images` | Relasi ke project, path screenshot, alt text, penanda cover, urutan |

Satu project dapat memiliki beberapa screenshot. Maksimal satu gambar utama
per project; jika belum dipilih, frontend nanti menggunakan gambar pertama
berdasarkan `sort_order`, lalu `created_at`, lalu `id`. Urutan project memakai
kolom yang sama. Draft boleh belum memiliki gambar atau deskripsi. Validasi
kelengkapan sebelum publish akan dibuat saat implementasi form.

Bucket **`project-screenshots`** bersifat privat. Batas per file 5 MiB,
format JPEG, PNG, WebP. Path: `<project-uuid>/<nama-unik>.png` (atau jpg/jpeg/webp).
Gunakan UUID untuk nama file. SVG tidak termasuk format upload.

## Pemasangan di Supabase

1. Gunakan project Supabase baru/khusus portfolio. Migrasi tidak menimpa tabel
   atau bucket yang sudah ada, dan akan gagal jika nama tersebut sudah dipakai.
2. Buka SQL Editor, jalankan seluruh
   `migrations/202610030001_project_management.sql` **sekali** sebagai postgres.
   Semua perubahan berada dalam satu transaksi.
3. Pada pengaturan Auth, matikan pendaftaran akun publik. Buat akun milikmu
   melalui Authentication > Users, lalu salin UUID akun tersebut.
4. Jalankan berikut di SQL Editor, ganti UUID contoh:

   ```sql
   insert into public.portfolio_admins (user_id)
   values ('GANTI-DENGAN-UUID-AKUN-ADMIN');
   ```

   Login saja tidak memberikan akses admin. Akun yang tidak terdaftar dalam
   tabel ini hanya dapat membaca data published. Tidak ada kebijakan browser
   untuk menambah atau mengubah daftar admin.
5. Jalankan `tests/access-control.sql` sebagai postgres. Skrip menggunakan
   transaksi dan mengembalikan seluruh fixture/perubahan dengan ROLLBACK.
   Gunakan project pengembangan untuk pemeriksaan awal.
6. Simpan Project URL dan **publishable key** untuk tahap integrasi frontend.
   Jangan menaruh password database, secret key, atau service_role di kode browser.
   File `.env` tidak otomatis terbaca oleh HTML/JS statis di Vercel; konfigurasi
   frontend akan disiapkan pada tahap berikutnya.

## Kontrak akses

| Aksi | Pengunjung | Login non-admin | Admin |
| --- | --- | --- | --- |
| Baca project/gambar published | Ya | Ya | Ya |
| Baca project/gambar draft | Tidak | Tidak | Ya |
| Tambah/edit/hapus project dan gambar | Tidak | Tidak | Ya |
| Upload/hapus file screenshot | Tidak | Tidak | Ya |
| Menetapkan akun admin dari browser | Tidak | Tidak | Tidak |

RLS berlaku di database dan Storage. Bucket tidak memakai URL publik permanen.
Saat integrasi, gunakan download terautorisasi atau signed URL singkat (misalnya
60 detik) untuk menampilkan gambar. Signed URL yang sudah diterbitkan tetap
berlaku hingga kedaluwarsa setelah unpublish; salinan yang sudah diunduh tidak
dapat ditarik kembali. File draft yang belum pernah diterbitkan hanya boleh
diakses admin.

## Urutan operasi untuk tahap form

- Upload: buat project draft dahulu, upload file ke folder ID project, lalu
  simpan metadata `project_images`. Jika metadata gagal disimpan, hapus upload
  tersebut lewat Storage API. File tanpa metadata tidak terbaca publik.
- Penggantian gambar: upload dengan nama baru, ubah metadata, kemudian hapus file
  lama. Jangan menyimpan signed URL sebagai `storage_path`.
- Penggantian cover: kosongkan cover lama sebelum menetapkan cover baru;
  jika langkah kedua gagal, frontend memakai gambar pertama.
- Penghapusan project: ubah menjadi draft, hapus file melalui Storage API, lalu
  hapus row project. Jangan lanjut menghapus row jika penghapusan file gagal.
  Cascade hanya menghapus metadata screenshot, bukan file Storage.
- Jangan menghapus file melalui SQL pada `storage.objects`; gunakan Storage API.
- Render judul/deskripsi/teknologi sebagai teks, bukan HTML. Validasi URL demo
  dengan `URL` dan izinkan hanya HTTP/HTTPS pada frontend, selain constraint SQL.

## Verifikasi

`tests/access-control.sql` menguji RLS sebagai anon, non-admin, dan admin;
status draft/published; batas satu cover; URL berbahaya; dan bucket privat.
Skrip ini perlu dijalankan pada Supabase/Postgres. Review file secara lokal
bukan pengganti pengujian database atau upload/download Storage sebenarnya.

Saat integrasi Storage tersedia, uji file draft, published, unpublish, upload
non-admin, tipe file, dan ukuran file melalui API. Jangan menganggap pemeriksaan
konfigurasi bucket sebagai pengujian end-to-end Storage.

Referensi resmi:
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/storage/security/access-control
- https://supabase.com/docs/guides/storage/buckets/fundamentals
