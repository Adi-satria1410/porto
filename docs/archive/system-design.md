# System Design — Portfolio Adi Satria Ramadani

## Tujuan dan batas sistem

Portfolio adalah website statis single-page yang memperkenalkan Adi dan menautkan pengunjung ke karya serta kanal kontak. Portfolio tidak membutuhkan backend, database, autentikasi, CMS, atau form server untuk rilis awal.

Website KONI adalah project eksternal terpisah. Portfolio hanya menyimpan preview screenshot dan tautan publik; portfolio tidak mengambil data KONI secara langsung dan tidak mem-proxy situs tersebut.

## Arsitektur runtime

```text
Browser
  ├── index.html (content, semantics, metadata)
  ├── css/ (tokens, layout, components, responsive states)
  ├── js/ (navigation, FAQ, progressive interactions)
  └── assets/ (project screenshots, profile, CV, OG, favicon)
```

HTML menjadi sumber konten utama. CSS mengatur presentasi; JavaScript menambah interaksi. Tanpa JavaScript, teks, anchor, email, dan tautan project tetap tersedia.

## Struktur data konten

- Section halaman: id anchor stabil (`hero`, `projects`, `about`, `skills`, `experience`, `services`, `process`, `faq`, `contact`).
- Project: title, summary, contribution, stack, status, image desktop/mobile, alt text, live URL, repository URL bila tersedia.
- Kontak: email, WhatsApp, GitHub, LinkedIn (opsional).
- Semua konten disimpan langsung di HTML untuk versi statis awal.

## Integrasi dan batas eksternal

- Google Fonts untuk Space Grotesk dan DM Mono; beri fallback system fonts.
- Website KONI dibuka sebagai link eksternal. Saat diperiksa, respons server berisi `X-Frame-Options: SAMEORIGIN`, sehingga iframe lintas domain tidak menjadi pilihan awal.
- GoatCounter bersifat opsional. Jangan menyertakan endpoint placeholder di production.
- Email dan WhatsApp menggunakan URI standar (`mailto:` dan `https://wa.me/`).

## Prinsip keamanan dan privasi

- Tidak menyimpan credential atau data sensitif.
- External links yang memakai `target="_blank"` wajib memakai `rel="noopener noreferrer"`.
- Tidak memakai proxy untuk membungkus website KONI.
- Jangan tampilkan dashboard admin, data internal, akun, atau screenshot privat.
- Analytics hanya aktif setelah pemilik mengonfirmasi site code dan penggunaan.

## Performa dan SEO

- Screenshot dikompresi, diberi `width`/`height`, dan lazy-load bila berada di bawah fold.
- Hindari library JS dan font tambahan tanpa kebutuhan yang jelas.
- Gunakan satu `h1`, landmarks semantik, title, description, canonical, Open Graph, favicon, dan alt text.
- Preloader bukan ketergantungan sistem; batas waktunya singkat dan konten harus tetap bisa dibaca.

## Deployment boundary

PRD ini tidak menetapkan hosting atau proses deploy tertentu. Deployment portfolio menjadi tahap akhir setelah konten, domain/hosting, dan aset final dipastikan. Deployment KONI bukan bagian dari kontribusi Adi pada studi kasus.
