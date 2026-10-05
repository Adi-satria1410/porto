# Frontend Specification — Portfolio

## Stack dan baseline

- HTML5, CSS3, dan JavaScript vanilla.
- Tidak ada build tool atau framework.
- File aktif: `index.html`, `css/variables.css`, `css/style.css`, `css/projects.css`, `js/main.js`, `js/animations.js`.
- Baseline project memiliki Hero, About, Skills, Experience, Projects, FAQ, Contact, navbar, preloader, WhatsApp float, dan reveal animation.

## Target struktur file

```text
PORTO/
├── index.html
├── css/
│   ├── variables.css
│   ├── style.css
│   └── projects.css
├── js/
│   ├── main.js
│   └── animations.js
├── assets/
│   ├── images/projects/koni/
│   ├── images/profile.*
│   ├── images/og-preview.jpg
│   ├── images/favicon.*
│   └── cv/CV-Adi-Satria-Ramadani.pdf
├── README.md
└── docs/
```

## Aturan implementasi

1. Gunakan landmark semantik (`header`, `nav`, `main`, `section`, `footer`) dan satu `h1`.
2. Pertahankan anchor ID konsisten dengan menu; tambah `services` dan `process` saat section tersebut diimplementasikan.
3. Simpan warna, typeface, padding, dan breakpoint sebagai custom properties di `variables.css`.
4. Gunakan class BEM yang konsisten dengan baseline (`hero__title`, `project-card__intro`).
5. Hindari inline style untuk layout dan warna utama.
6. FAQ memakai button dan `aria-expanded`; konten tidak bergantung pada JavaScript untuk dibaca.
7. Menu mobile harus mendukung Escape, focus return, `aria-expanded`, dan state scroll yang benar.
8. Motion menjadi enhancement. Jika observer tidak ada atau reduced motion aktif, konten terlihat langsung.
9. Semua gambar diberi alt yang benar, ukuran intrinsik, dan strategi loading.
10. External project link yang membuka tab baru memakai `rel="noopener noreferrer"`.

## Isi project card

### Portfolio pribadi

- Status `In development` sampai versi publish tersedia.
- Stack HTML5, CSS3, JavaScript vanilla.
- Jelaskan bahwa project menyatukan profil, karya, pengalaman, dan jalur kontak.

### KONI Kabupaten Karawang

- Kontribusi: desain frontend dan implementasi hampir seluruh halaman publik secara responsif.
- Backend dan admin panel Filament dibuat rekan.
- Tampilkan screenshot desktop dan mobile; CTA menuju website publik.
- Jangan mengklaim backend, admin panel, deploy, supervisor, durasi, atau kepemilikan.
- Jangan tampilkan iframe lintas domain selama `SAMEORIGIN` masih diberlakukan.

## Item baseline yang harus diperiksa sebelum release

- Ganti `profile-template.svg`, `og-preview-template.svg`, `favicon-template.svg` dengan aset final atau hapus elemen terkait.
- Ganti PDF CV template dengan CV asli; jika belum ada, hilangkan link download.
- Ganti `wa.me/0000000000` dengan nomor aktif atau sembunyikan CTA WhatsApp.
- Hapus atau isi endpoint `YOUR-CODE` GoatCounter; analytics opsional.
- Pastikan semua menu mengarah ke section yang tersedia dan menambahkan section Services/Process.
- Tambah skip link, visible focus state, validasi ARIA, dan tes menu mobile.
- Perbaiki copy yang belum final dan hilangkan klaim skill yang belum didukung bukti.

## Acceptance untuk frontend

- Tidak ada horizontal overflow pada 320px–1440px.
- Semua interaksi bisa dipakai dengan keyboard.
- Konten utama terbaca tanpa JavaScript.
- Reduced motion tidak menyembunyikan konten.
- Link placeholder dan aset template tidak lolos ke rilis.
- Desktop dan mobile KONI preview tampil tajam, punya alt text, dan tidak memotong konten penting.
- Tampilan mempertahankan dark/red identity dengan orange sebagai aksen pendukung.
