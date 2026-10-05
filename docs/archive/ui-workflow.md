# UI Workflow — Alur Pengunjung Portfolio

Dokumen ini menerjemahkan user stories menjadi urutan tugas dan navigasi. Ini adalah workflow pengguna situs; urutan pengerjaan tim/implementasi ada di `iteration-plan.md`.

## Alur recruiter / HR

1. Masuk ke halaman dan membaca Hero: posisi, fokus, status kerja.
2. Memilih **Lihat karya**.
3. Memindai project portfolio dan KONI.
4. Membuka detail KONI atau website live bila ingin memeriksa langsung.
5. Melihat About, Skills, Experience, dan Education.
6. Membuka CV asli atau menghubungi melalui email.

**Jalur pendek:** Hero → Selected Projects → Experience/Skills → CV atau Contact.

## Alur calon klien

1. Masuk ke halaman dan memahami layanan yang ditawarkan dari Hero.
2. Membuka Selected Projects untuk melihat preview desktop/mobile KONI.
3. Membuka website live KONI melalui tautan eksternal.
4. Membaca Services dan Process.
5. Membaca FAQ bila masih memiliki pertanyaan.
6. Memulai percakapan melalui WhatsApp atau email.

**Jalur pendek:** Hero → Project KONI → Services/Process → FAQ → WhatsApp/Email.

## Navigasi dan perilaku

- Header menyediakan anchor ke bagian utama tanpa menambah page load.
- CTA Hero membawa pengunjung ke Projects atau Contact.
- Kartu project membuka detail/tautan yang diberi label jelas.
- Tautan website KONI membuka tab baru dengan `rel="noopener noreferrer"`.
- Jika tautan eksternal gagal dibuka, informasi kontribusi dan preview tetap tersedia di portfolio.
- Menu mobile dapat ditutup lewat tombol toggle, memilih link, atau tombol Escape; fokus kembali ke tombol toggle saat menu ditutup.
- FAQ mulai dalam state yang tetap mudah dibaca; JavaScript hanya mengatur buka/tutup dan state ARIA.

## Urutan section yang direkomendasikan

Header → Hero → Selected Projects → About → Skills → Experience/Education → Services → Process → FAQ → Contact → Footer.

Urutan ini memperlihatkan bukti karya lebih awal, lalu memberi konteks kemampuan dan cara kerja sebelum CTA akhir.

## Skenario aksesibilitas

- Pengunjung keyboard dapat melewati navigasi lewat skip link, mencapai setiap CTA, membuka FAQ, dan menutup menu.
- Pengunjung dengan reduced motion mendapatkan konten langsung tanpa reveal yang menyembunyikan informasi.
- Pengunjung yang mematikan JavaScript tetap dapat membaca konten dan mengikuti link biasa.
- Pengunjung mobile tidak harus mengandalkan hover untuk mengetahui bahwa elemen dapat diklik.
