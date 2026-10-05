# Portfolio — Adi Satria Ramadani

Website portfolio single-page untuk Adi Satria Ramadani, Frontend Developer. Portfolio ini ditujukan untuk recruiter/HR dan calon klien freelance.

**Revisi:** v4 final — Hybrid Editorial Portfolio  
**Dokumen acuan:** [`PRD-Development-Plan-v3.md`](./PRD-Development-Plan-v3.md)

## Status

Redesign hybrid editorial sudah diimplementasikan pada HTML, CSS, dan JavaScript vanilla. Konten utama, navigasi, project card, Services, Process, FAQ, progressive enhancement, dan responsive layout sudah tersedia. Publish masih menunggu screenshot KONI yang disetujui, CV asli, dan verifikasi kontak sosial.

## Arah Desain

Arah visual yang disepakati adalah **hybrid editorial**:

- Identitas dark editorial dan aksen merah tetap dipertahankan.
- Orange ditambahkan sebagai aksen pendukung.
- Headline besar, whitespace luas, project bernomor, dan navigasi minimal mengambil pola presentasi dari referensi Mees Verberne.
- Target portfolio seimbang untuk recruiter/HR dan calon klien freelance.
- Motion digunakan sebagai penanda ritme dan tetap menghormati `prefers-reduced-motion`.

Referensi tidak digunakan untuk menyalin logo, font, copy, gambar, animasi eksklusif, atau source code.

## Struktur Halaman Final

1. Header/navigation
2. Hero
3. Selected Projects
4. About
5. Skills
6. Experience/Education
7. Services
8. Process
9. FAQ
10. Contact
11. Footer

## Copy Utama

### Hero

> Frontend Developer yang mengubah ide menjadi pengalaman digital yang jelas, responsif, dan mudah digunakan.

> Saya merancang dan membangun website untuk membantu bisnis, personal brand, dan organisasi tampil lebih profesional di ruang digital.

CTA:

- Lihat karya
- Hubungi saya

### About

> Saya adalah Frontend Developer yang tertarik pada proses mengubah kebutuhan menjadi interface web yang terstruktur dan mudah digunakan. Saya mengerjakan implementasi layout, responsive design, interaksi frontend, serta memastikan tampilan dapat berjalan dengan baik di berbagai perangkat.

## Project yang Ditampilkan

### Project #1 — Portfolio Adi Satria Ramadani

Website portfolio pribadi untuk menampilkan kemampuan frontend, pengalaman, dan studi kasus dalam satu halaman.

- Status: `In development`
- Stack: HTML5, CSS3, JavaScript vanilla
- Fokus: responsive layout, navigasi, studi kasus, dan interaksi dasar

### Project #2 — Website KONI Kabupaten Karawang

Website informasi olahraga Kabupaten Karawang yang memuat homepage, cabang olahraga, atlet, pelatih, wasit, prestasi, event, kegiatan, struktur organisasi, sponsor, dan kontak.

> Saya mendesain dan mengimplementasikan hampir seluruh halaman publik website secara responsif. Backend dan admin panel Filament dikerjakan oleh anggota tim lain.

- Website: [konikarawang.or.id](https://konikarawang.or.id/)
- Preview: slot screenshot desktop dan mobile sudah disiapkan; aset screenshot final masih diperlukan
- Kontribusi: frontend design dan implementation
- Atribusi: jangan mengklaim backend, admin panel, deployment, atau kepemilikan project sebagai pekerjaan pribadi

Preview mobile sebaiknya dipotong dari browser chrome atau ditempatkan dalam mockup perangkat. Tambahkan screenshot halaman internal seperti Cabang Olahraga, Prestasi, Event, atau Kegiatan bila tersedia dan sudah mendapat izin.

### Project #3

Belum ditentukan. Project mandiri ketiga disarankan agar portfolio memiliki karya yang sepenuhnya bebas dipublikasikan dan dijelaskan.

## Services

- **Landing Page** — untuk UMKM, produk digital, event, atau personal brand.
- **Company Profile** — untuk menjelaskan identitas, layanan, portofolio, dan kontak bisnis.
- **Personal Portfolio** — untuk freelancer, developer, kreator, atau profesional.
- **Frontend Implementation** — mengubah desain atau struktur halaman menjadi interface responsif.

## Process

1. Memahami kebutuhan.
2. Menyusun struktur.
3. Membangun interface.
4. Review dan penyelesaian.

## Skills

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

React Native ditampilkan setelah ada project atau bukti yang dapat ditunjukkan.

## Design Tokens

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--ink` | `#121212` | Hero, card gelap, contact, footer |
| `--paper` | `#f2efe9` | Background terang dan teks di atas gelap |
| `--red` | `#ee3824` | CTA utama dan status |
| `--orange` | `#f7a026` | Highlight, nomor project, hover, badge |
| `--line` | `rgba(18,18,18,.18)` | Divider dan border |
| `--muted` | `#77736d` | Metadata |
| `--display` | `Space Grotesk` | Heading dan body |
| `--mono` | `DM Mono` | Label, nomor, tahun, stack, status |

Orange dipakai sebagai latar CTA/badge dengan teks gelap, garis, focus ring, atau detail dekoratif. Jangan gunakan orange sebagai teks isi kecil di atas paper.

## Struktur Proyek

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
│   ├── images/
│   │   └── projects/
│   │       └── koni/
│   └── cv/
├── README.md
└── PRD-Development-Plan-v3.md
```

## Menjalankan Project

Project tidak memakai build tool atau dependency wajib.

1. Buka folder project di editor.
2. Jalankan melalui Laragon, Live Server, atau server statis lain.
3. Buka alamat lokal yang diberikan server.

Contoh:

```text
http://localhost/PORTO/
```

## Perilaku JavaScript

`js/main.js` mengelola:

- State navbar setelah scroll.
- Menu mobile, Escape, outside click, dan focus return.
- Penutupan menu setelah link dipilih.
- Preloader.
- Accordion FAQ.

`js/animations.js` mengelola:

- Animasi masuk Hero.
- Reveal section dengan `IntersectionObserver`.
- Fallback langsung tampil pada reduced motion atau browser tanpa IntersectionObserver.

JavaScript tidak boleh menjadi satu-satunya cara untuk membaca konten, membuka link, atau memahami project.

## Konten dan Aset yang Masih Diperlukan

- Screenshot KONI desktop dan mobile yang boleh dipublikasikan.
- CV asli.
- Link GitHub dan LinkedIn final.
- Nomor WhatsApp aktif bila CTA WhatsApp akan dipakai.
- OG image dan favicon final bila ingin ditambahkan.
- Project mandiri ketiga.
- Keputusan analytics GoatCounter.

## Pemeriksaan Sebelum Deploy

- [ ] Hero menjelaskan posisi sebagai Frontend Developer.
- [ ] Recruiter dan calon klien memiliki CTA yang jelas.
- [ ] Project portfolio pribadi dan KONI sudah terisi.
- [ ] Screenshot KONI desktop dan mobile memiliki alt text serta dimensi.
- [ ] Screenshot mobile sudah dipotong atau diberi mockup yang rapi.
- [ ] Link website KONI dapat dibuka.
- [ ] Tidak ada klaim backend, admin panel, deployment, atau kepemilikan KONI yang tidak sesuai kontribusi.
- [ ] CV asli tersedia sebelum CTA download ditambahkan.
- [ ] Favicon dan OG image final tersedia sebelum metadata aset ditambahkan.
- [ ] WhatsApp hanya ditampilkan setelah nomor aktif diverifikasi.
- [ ] GoatCounter tidak memakai `YOUR-CODE`.
- [ ] Menu mobile bisa dibuka, ditutup dengan Escape, dan mengembalikan focus.
- [ ] FAQ bekerja dengan mouse dan keyboard.
- [ ] Tidak ada overflow pada 320px, 375px, 768px, dan desktop.
- [ ] Reduced motion diuji.
- [ ] Title, description, canonical, dan satu `h1` tervalidasi; OG image/favicon ditambahkan setelah aset final tersedia.

## Lisensi

Hak cipta konten dan desain portfolio ini milik Adi Satria Ramadani. Jangan gunakan ulang identitas personal, konten, atau aset tanpa izin.
