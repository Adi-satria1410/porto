# Product Requirements Document (PRD)

## Portfolio Website — Adi Satria Ramadani

**Revisi:** v4 final — Hybrid Editorial Portfolio  
**Status:** siap implementasi; beberapa aset konten masih menunggu pemilik

| Informasi | Detail |
| --- | --- |
| Produk | Website portfolio dan personal brand pribadi |
| Pemilik | Adi Satria Ramadani |
| Posisi utama | Frontend Developer |
| Platform | Website statis, single page |
| Stack | HTML5, CSS3, JavaScript vanilla |
| Bahasa | Indonesia |
| Target audiens | Recruiter/HR dan calon klien freelance |
| Referensi | Mees Verberne — pola navigasi, ritme editorial, project presentation, dan motion |
| Target rilis | Setelah aset kritis dan konten final tersedia |

> Referensi dipakai untuk mempelajari pola UX dan presentasi. Logo, font, copy, gambar, animasi eksklusif, dan source code referensi tidak digunakan ulang.

---

## 1. Keputusan yang Sudah Dikunci

1. Arah visual memakai **hybrid editorial**.
2. Identitas dark editorial dengan aksen merah tetap dipertahankan.
3. Orange ditambahkan sebagai aksen pendukung untuk highlight, nomor project, hover, dan detail dekoratif.
4. Target portfolio seimbang untuk recruiter/HR dan calon klien freelance.
5. Prioritas referensi berada pada navigasi dan motion, lalu struktur presentasi project.
6. Homepage tetap single page dengan project sebagai bukti utama setelah Hero.
7. Project KONI Karawang ditampilkan sebagai kontribusi frontend pada project kolaborasi.
8. Screenshot desktop dan mobile dipakai sebagai preview project; link website live menjadi CTA utama.
9. Backend, admin panel Filament, dan deployment KONI tidak diklaim sebagai kontribusi Adi.
10. Tidak ada angka performa, testimoni, atau klaim bisnis yang belum dapat diverifikasi.

## 2. Tujuan Produk

Portfolio harus menjawab tiga pertanyaan pengunjung dengan cepat:

- Siapa Adi dan apa yang ia kerjakan?
- Bukti apa yang menunjukkan kemampuan tersebut?
- Bagaimana cara menghubungi atau bekerja sama dengannya?

### Tujuan khusus

1. Menjelaskan positioning sebagai Frontend Developer dalam satu layar pertama.
2. Menyediakan jalur yang sama jelas untuk recruiter dan calon klien.
3. Menampilkan minimal dua project dengan atribusi yang jujur.
4. Menjelaskan layanan dan proses kerja secara ringkas.
5. Menunjukkan kemampuan HTML, CSS, JavaScript, responsive design, UI design, dan frontend implementation melalui bukti project.
6. Menjaga halaman cepat, mudah dipindai, dan tetap berfungsi tanpa JavaScript.

## 3. Target Pengguna

| Pengguna | Kebutuhan | Konten yang harus ditemukan |
| --- | --- | --- |
| Recruiter/HR | Menilai kemampuan, pengalaman, dan kesiapan kerja | Hero, About, Skills, Experience, CV, GitHub, project evidence |
| Calon klien freelance | Menilai kualitas hasil dan cara kerja | Project preview, Services, Process, FAQ, Email, WhatsApp |
| Sesama developer | Memahami fondasi teknis dan cara berpikir | Stack, kontribusi project, repository, studi kasus |

## 4. Positioning dan Copy Utama

### Hero

**Headline:**

> Frontend Developer yang mengubah ide menjadi pengalaman digital yang jelas, responsif, dan mudah digunakan.

**Deskripsi:**

> Saya merancang dan membangun website untuk membantu bisnis, personal brand, dan organisasi tampil lebih profesional di ruang digital.

**Label pendukung:**

```text
FRONTEND DEVELOPER
OPEN TO WORK
AVAILABLE FOR SELECTED PROJECTS
INDONESIA
```

**CTA:**

- Lihat karya
- Hubungi saya
- Download CV

### About

> Saya adalah Frontend Developer yang tertarik pada proses mengubah kebutuhan menjadi interface web yang terstruktur dan mudah digunakan. Saya mengerjakan implementasi layout, responsive design, interaksi frontend, serta memastikan tampilan dapat berjalan dengan baik di berbagai perangkat.
>
> Saya memiliki pengalaman mengerjakan frontend website publik, termasuk website KONI Kabupaten Karawang, dan sedang mengembangkan portfolio pribadi untuk mendokumentasikan karya, proses belajar, serta kemampuan saya dalam membangun produk digital.

## 5. Arsitektur Halaman Final

Urutan single page:

1. **Header/navigation** — brand, anchor menu, CTA kontak, menu mobile.
2. **Hero** — positioning, status, CTA, dan visual identitas.
3. **Selected Projects** — project portfolio pribadi dan KONI Karawang.
4. **About** — narasi singkat dan fokus kerja.
5. **Skills** — skill inti dengan hubungan ke project.
6. **Experience/Education** — pengalaman magang dan pendidikan.
7. **Services** — layanan yang benar-benar ditawarkan.
8. **Process** — empat tahap kerja.
9. **FAQ** — pertanyaan umum calon klien.
10. **Contact** — email, WhatsApp, GitHub, dan LinkedIn jika tersedia.
11. **Footer** — identitas, copyright, dan navigasi ulang.

## 6. Arah Desain Hybrid Editorial

### 6.1 Prinsip visual

- Dark editorial tetap menjadi identitas utama.
- Headline besar dan whitespace luas mengambil pola presentasi editorial dari referensi.
- Navigasi dibuat minimal, sticky, dan mudah dipahami.
- Project card memakai nomor, metadata, dan media besar.
- Motion memberi ritme pada halaman tetapi tidak menghalangi konten.
- Setiap section memiliki satu tujuan dan satu tindakan utama.

### 6.2 Design tokens

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--ink` | `#121212` | Hero, card gelap, contact, footer, teks utama |
| `--paper` | `#f2efe9` | Background terang dan teks di atas gelap |
| `--red` | `#ee3824` | CTA utama, status, highlight penting |
| `--orange` | `#f7a026` | Nomor project, hover, badge, detail pendukung |
| `--line` | `rgba(18,18,18,.18)` | Divider dan border |
| `--muted` | `#77736d` | Metadata dan teks sekunder |
| `--display` | `Space Grotesk` | Heading dan body |
| `--mono` | `DM Mono` | Label, nomor, tahun, stack, status |

Orange dipakai sebagai latar CTA/badge dengan teks gelap, garis, focus ring, atau elemen dekoratif. Orange tidak dipakai sebagai teks isi kecil di atas paper.

### 6.3 Layout dan motion

- Wrapper memakai `--pad` responsif dan maksimum lebar yang konsisten.
- Desktop memakai grid dua kolom untuk About, Skills, FAQ, dan Project detail.
- Mobile berubah menjadi satu kolom tanpa mengubah urutan informasi.
- Header berubah state setelah scroll lebih dari 24px.
- Hero menggunakan opacity dan translate ringan dengan durasi sekitar 400–700ms.
- Reveal section memakai `IntersectionObserver`.
- Hover project hanya mengubah warna, underline, atau scale media maksimal 1.03.
- `prefers-reduced-motion: reduce` menampilkan konten langsung.
- Preloader boleh dipertahankan dari baseline dengan durasi maksimal 400–800ms dan tidak boleh memblokir akses konten.

## 7. Konten Project

### Project #1 — Portfolio Adi Satria Ramadani

**Status:** In development  
**Stack:** HTML5, CSS3, JavaScript vanilla

> Website portfolio pribadi untuk menampilkan kemampuan frontend, pengalaman, dan studi kasus dalam satu halaman. Dibangun dengan fokus pada responsive layout, navigasi yang jelas, dan penyampaian informasi secara visual.

**Cakupan:** Hero, navigasi single page, About, Skills, Experience, Projects, FAQ, Contact, responsive layout, dan interaksi dasar.

**Tantangan:** Menyeimbangkan kebutuhan recruiter dan calon klien dalam satu halaman tanpa membuat informasi terasa padat.

### Project #2 — Website KONI Kabupaten Karawang

**Kontribusi:** Frontend design dan implementation  
**Kolaborasi:** Backend dan admin panel Filament dikerjakan anggota tim lain  
**Status:** Website publik — [konikarawang.or.id](https://konikarawang.or.id/)

> Website informasi olahraga Kabupaten Karawang yang memuat homepage, cabang olahraga, atlet, pelatih, wasit, prestasi, event, kegiatan, struktur organisasi, sponsor, dan kontak. Saya mendesain dan mengimplementasikan hampir seluruh halaman publik website secara responsif.

**Preview yang ditampilkan:** screenshot desktop dan mobile. Jika konfigurasi server mengizinkan, preview interaktif dapat ditambahkan melalui iframe. Saat ini CTA utama diarahkan ke website live karena server memakai pembatasan `SAMEORIGIN` untuk frame.

**Atribusi:** Jangan mengklaim backend, admin panel, deployment, atau kepemilikan project sebagai pekerjaan pribadi.

### Project #3

Belum ditentukan. Project ketiga sebaiknya dibuat mandiri agar portfolio memiliki satu karya yang sepenuhnya dapat dijelaskan dan dipublikasikan tanpa batasan atribusi.

## 8. Services dan Process

### Services

1. **Landing Page** — halaman promosi untuk UMKM, produk digital, event, atau personal brand.
2. **Company Profile** — website untuk menjelaskan identitas, layanan, portofolio, dan kontak bisnis.
3. **Personal Portfolio** — website untuk freelancer, developer, kreator, atau profesional.
4. **Frontend Implementation** — mengubah desain atau struktur halaman menjadi interface responsif.

### Process

1. **Memahami kebutuhan** — tujuan, target pengguna, konten, fitur, dan hasil.
2. **Menyusun struktur** — halaman, navigasi, hierarki informasi, dan responsive layout.
3. **Membangun interface** — implementasi frontend sesuai kebutuhan project.
4. **Review dan penyelesaian** — pemeriksaan perangkat, revisi, dan handoff.

## 9. Skills dan Bukti

### Skill inti

- HTML5
- CSS3
- JavaScript vanilla
- Responsive Web Design
- UI Design
- Frontend Implementation
- Problem Solving
- Team Collaboration

### Currently learning

- TypeScript
- Next.js

React Native hanya ditampilkan jika sudah ada project atau bukti yang dapat ditunjukkan.

## 10. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas | Kriteria penerimaan |
| --- | --- | --- | --- |
| F-01 | Hero menjelaskan positioning dan dua tujuan utama | Tinggi | Recruiter dan klien dapat menuju project atau contact dari viewport pertama |
| F-02 | Project card menampilkan minimal dua project | Tinggi | Setiap card memiliki judul, ringkasan, kontribusi, stack/status, media, dan link |
| F-03 | Project KONI memiliki preview desktop dan mobile | Tinggi | Gambar memiliki alt, dimensi, dan CTA website live |
| F-04 | Navigasi anchor bekerja di desktop dan mobile | Tinggi | Menu mobile dapat dibuka, ditutup dengan Escape, dan mengembalikan fokus |
| F-05 | Skills terhubung dengan project evidence | Sedang | Skill tidak hanya berupa daftar tanpa konteks |
| F-06 | Services dan Process dapat dibaca tanpa JavaScript | Sedang | Informasi tetap tersedia saat JS gagal |
| F-07 | FAQ memakai button dan ARIA | Sedang | `aria-expanded`, `aria-controls`, dan state hidden konsisten |
| F-08 | CTA kontak berfungsi | Tinggi | Email, GitHub, LinkedIn jika ada, dan WhatsApp diuji |
| F-09 | Metadata SEO sesuai konten final | Sedang | Title, description, canonical, OG image, favicon, dan satu `h1` valid |
| F-10 | Placeholder tidak lolos ke production | Tinggi | CV template, nomor WhatsApp, GoatCounter, dan asset template diganti atau dihapus |

## 11. Kebutuhan Non-Fungsional

- Tidak ada horizontal overflow pada viewport 320px, 375px, 768px, dan desktop.
- Semua gambar memiliki alt yang sesuai, dimensi eksplisit, dan strategi loading yang wajar.
- Focus ring terlihat pada link, button, menu, FAQ, dan CTA.
- Kontras teks memenuhi standar aksesibilitas untuk ukuran teks yang digunakan.
- Tidak ada library atau font tambahan tanpa alasan produk yang jelas.
- HTML tetap terbaca tanpa JavaScript; JS hanya menambah state, menu, FAQ, dan motion.
- Project preview tidak menampilkan data admin, kredensial, database, atau informasi privat.
- Screenshot project hanya digunakan sesuai izin yang sudah diperoleh.

## 12. Rencana Implementasi

| Tahap | Pekerjaan | Output |
| --- | --- | --- |
| 1 | Finalisasi copy dan aset | Hero, About, Services, Process, skills, project data |
| 2 | Migrasi design token hybrid | Warna dark/red/orange, typography, spacing, grid |
| 3 | Header dan Hero | Navigasi desktop/mobile, positioning, CTA |
| 4 | Projects | Dua project card, preview KONI, link live, detail project |
| 5 | About, Skills, Experience, Services, Process | Alur kredibilitas lengkap |
| 6 | FAQ, Contact, Footer, motion | Interaksi dan jalur konversi |
| 7 | QA | Mobile, desktop, keyboard, reduced motion, link, metadata |

## 13. Item Terbuka untuk Eksekusi

Item berikut tidak mengubah arah desain, tetapi harus diselesaikan sebelum publish:

- Foto/avatar asli atau keputusan memakai bentuk visual tanpa foto.
- File CV asli.
- Screenshot internal KONI tambahan selain homepage.
- Link GitHub dan LinkedIn final.
- Nomor WhatsApp aktif.
- OG image dan favicon final.
- Project mandiri ketiga.
- Copy final setelah review pribadi.
- Keputusan memakai atau menonaktifkan GoatCounter.

## 14. Definition of Done

1. Arah hybrid editorial diterapkan konsisten.
2. Hero menjelaskan positioning seimbang untuk recruiter dan klien.
3. Dua project tampil dengan atribusi jujur; project KONI memiliki preview desktop/mobile dan link live.
4. Services, Process, Skills, About, Experience, FAQ, dan Contact tersusun dalam alur yang mudah dipindai.
5. Menu mobile, FAQ, CTA, dan reveal bekerja dengan keyboard serta reduced motion.
6. Tidak ada placeholder template atau link palsu pada production.
7. Semua aset dan project yang dipublikasikan memiliki izin atau memang milik sendiri.
8. README mencerminkan implementasi aktual.

---

**Kesimpulan:** arah produk dan desain sudah cukup final untuk mulai implementasi. Item terbuka yang tersisa adalah data dan aset, bukan keputusan strategis baru.
