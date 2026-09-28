# Iteration Plan — Eksekusi Portfolio

## Urutan yang disepakati

Alur discovery dan desain dimulai sesuai arahan pemilik:

**User Stories → User Workflow → UI/UX Design → System Design → Frontend Specification → Frontend Implementation → QA → Release**

`user-stories.md`, `ui-workflow.md`, dan `ui-ux-design.md` menjadi gerbang sebelum coding. `system-design.md` dan `frontend.md` menerjemahkan desain menjadi batas sistem dan instruksi implementasi.

## Iterasi 0 — Kunci konten dan aset

**Baca:** `user-stories.md`  
**Kerjakan:** verifikasi About, status kerja, experience, skill, Services, kontak, izin screenshot KONI, dan aset CV/foto.  
**Output:** daftar fakta dan aset yang siap dipublikasikan; placeholder yang belum ada diberi status.  
**Selesai bila:** tidak ada klaim, link, atau data yang diasumsikan.

## Iterasi 1 — User stories

**Baca/validasi:** `user-stories.md`  
**Kerjakan:** validasi stories recruiter, klien, dan pengunjung mobile; urutkan Must/Should/Could.  
**Output:** acceptance criteria yang menjadi acuan review.  
**Selesai bila:** setiap section dan CTA menjawab kebutuhan pengunjung yang jelas.

## Iterasi 2 — User workflow

**Baca/validasi:** `ui-workflow.md`  
**Kerjakan:** petakan jalur recruiter dan calon klien; cek menu, CTA, detail project, contact, menu keyboard/mobile.  
**Output:** urutan halaman dan interaksi disetujui.  
**Selesai bila:** pengguna dapat mencapai bukti project dan kontak tanpa jalan buntu.

## Iterasi 3 — UI/UX design

**Baca/validasi:** `ui-ux-design.md`  
**Kerjakan:** tetapkan wireframe low fidelity desktop/mobile, posisi screenshot KONI, skala type, spacing, komponen, motion, states, dan aksesibilitas.  
**Output:** wireframe dan visual specification yang bisa langsung diimplementasikan.  
**Selesai bila:** Hero, project preview, Services, Process, FAQ, dan Contact telah ditinjau di dua ukuran layar.

## Iterasi 4 — System dan frontend design

**Baca:** `system-design.md`, lalu `frontend.md`  
**Kerjakan:** finalisasi struktur file, section ID, token, asset paths, external links, progressive enhancement, dan checklist placeholder.  
**Output:** implementasi tidak membutuhkan keputusan arsitektur baru.  
**Selesai bila:** setiap komponen desain memiliki tempat implementasi yang jelas.

## Iterasi 5 — Fondasi visual, Header, dan Hero

**Kerjakan:** rapikan variables, responsive container, typography, nav desktop/mobile, Hero copy, status, CTA, dan focus states.  
**Selesai bila:** Hero terbaca pada mobile/desktop, anchor bekerja, keyboard dapat mengoperasikan menu.

## Iterasi 6 — Projects dan bukti KONI

**Kerjakan:** card portfolio pribadi dan KONI; masukkan screenshot desktop/mobile; potong browser chrome mobile atau buat device frame; tambah link live.  
**Selesai bila:** kontribusi frontend tertulis akurat, gambar memiliki alt/dimensi, tombol link membuka situs live, dan iframe tidak dipaksakan.

## Iterasi 7 — About, Skills, Experience, Services, Process

**Kerjakan:** implementasi konten yang disepakati; tautkan skill ke project evidence; tandai TypeScript/Next.js sebagai currently learning bila masih dipelajari.  
**Selesai bila:** tidak ada klaim tanpa bukti dan konten dapat dipindai.

## Iterasi 8 — FAQ, Contact, Footer, Motion

**Kerjakan:** FAQ accessible, email/WhatsApp/social links, footer, reveal dan hover ringan, reduced motion.  
**Selesai bila:** semua CTA diuji keyboard/touch dan konten tampil tanpa JavaScript.

## Iterasi 9 — QA dan release

**Kerjakan:** uji viewport 320, 375, 768, 1024, desktop; keyboard; reduced motion; semua link; metadata; alt text; image loading; placeholder scan.  
**Selesai bila:** tidak ada link placeholder, overflow, kesalahan aksesibilitas kritis, atau screenshot yang dipublikasikan tanpa izin.

## Item yang tidak menghambat desain awal

Project ketiga, testimoni, dan analytics dapat menyusul. Bila belum ada, jangan membuat konten tiruan. CV, foto, nomor WhatsApp, link sosial, favicon, OG image, dan screenshot internal KONI harus disediakan atau elemen terkait disembunyikan sebelum release.
