# Hasil tahap 5 — 4 Oktober 2026 (Asia/Jakarta)

## Lingkup dan hasil

- **32 tes logika** lulus setelah pembaruan hapus project: autentikasi, akses admin, pencarian/pagination,
  validasi project/gambar, upload gagal dan rekonsiliasi metadata, cover,
  publish/unpublish, serta filter data publik.
- **15 skenario browser lokal** memakai Chrome headless dan backend simulasi:
  redirect anonim, password salah/non-admin, login admin dan tambah draft,
  draft tersembunyi di galeri, upload/cover/preview, ukuran editor mobile,
  publish/galeri/lightbox, koneksi gagal dan retry, unpublish/edit kembali,
  hapus screenshot, filter/pagination dashboard, serta logout lalu Back. Tambahan:
  batal hapus project; gagal Storage lalu retry dengan pembersihan file/metadata
  termasuk file orphan tanpa menyentuh project lain; hapus draft kosong dan
  pemulihan pagination setelah item terakhir pada halaman dihapus.
- Tidak ada JavaScript exception yang tidak tertangani dalam skenario browser.
- Editor dan galeri diperiksa pada lebar **320, 390, 768 px**; desktop 1440 px.
  Login dan dashboard diperiksa pada lebar 390 px. Tidak ditemukan overflow
  horizontal pada pemeriksaan tersebut. Screenshot tersimpan di `tests/artifacts/`.
- Tampilan login desktop serta editor/galeri mobile ditinjau secara visual.
  Tes simulasi memblokir font eksternal, sehingga screenshot menggunakan font
  fallback; pemeriksaan browser dengan koneksi asli dilakukan terpisah.

## Pemeriksaan langsung Supabase (baca saja)

- Settings Auth HTTP 200: `disable_signup: true`.
- RPC `is_portfolio_admin` untuk anonim: `false`.
- Daftar `portfolio_admins`: HTTP 401 / kode izin `42501` untuk anonim.
- Query draft project serta metadata gambar draft: HTTP 200, tidak mengembalikan row.
  Hasil kosong ini sendiri tidak membuktikan isolasi draft jika database tidak
  memiliki fixture draft; skrip SQL tahap 1 diperlukan untuk pembuktian dengan data.
- Browser berhasil memuat SDK asli dari CDN dan mengaktifkan form login.
- Browser tanpa sesi diarahkan dari daftar admin ke halaman login.
- Galeri browser membaca data Supabase tanpa error.

Tidak ada akun baru, upload, perubahan status, maupun penghapusan pada Supabase
asli dalam pengujian ini. Semua mutasi alur browser memakai data simulasi lokal.

## Perbaikan

Editor sebelumnya menyembunyikan konten setelah logout lalu Back, tetapi tidak
mengarahkan pengguna ke halaman login. Pemeriksaan sesi editor sekarang melakukan
redirect ke login ketika sesi kosong. Skenario regresi logout → Back sudah lulus.

## Menjalankan ulang

Tes logika (Node.js):

```powershell
node --test --test-isolation=none tests/admin-service.test.mjs tests/project-editor.test.mjs tests/publication.test.mjs tests/project-delete.test.mjs
```

Untuk browser, pasang tooling terpisah dari aplikasi:

```powershell
npm install --prefix .qa-tools --no-save --ignore-scripts playwright-core@1.63.0
node tests/browser-qa.mjs
node tests/browser-qa.mjs --live-readonly
```

Runner memakai Chrome Windows yang terpasang, tanpa profil pribadi. Untuk lokasi
browser lain, isi environment variable `QA_BROWSER` dengan path executable Chrome
atau Edge. Mode default mengganti modul Supabase hanya di request browser pengujian
dan memblokir koneksi eksternal. Mode `--live-readonly` memakai konfigurasi asli
untuk pemeriksaan anonim tanpa login/mutasi. Server lokal otomatis ditutup.
Tooling dan screenshot diabaikan Git; tidak diperlukan untuk runtime portfolio.

## Batas verifikasi

Belum diuji dengan kredensial admin asli: login, upload ke Storage asli,
publish/unpublish, dan hapus file. Belum menjalankan `supabase/tests/access-control.sql`
terhadap database Supabase karena tidak ada koneksi SQL tepercaya di sesi ini.
Tes mock tidak menggantikan verifikasi RLS untuk akun admin/non-admin di server.
Belum ada deployment Vercel atau pengujian perangkat fisik/Safari/Firefox.

Penghapusan keseluruhan project kini tersedia dan sudah diuji memakai mock.
Pengujian layanan mencakup penolakan non-admin, gagal unpublish/list/remove,
paginasi Storage, file masih tersisa, nama file tidak aman, konflik perubahan
project, retry project yang sudah terhapus, serta penghapusan draft tanpa file.
Penghapusan data/file pada Supabase asli belum dilakukan.
