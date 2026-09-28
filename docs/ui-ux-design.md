# UI/UX Design — Hybrid Editorial Portfolio

## Arah yang disepakati

- Mempertahankan identitas **dark editorial** dan aksen merah dari baseline.
- Menambahkan orange sebagai aksen kedua.
- Mengadaptasi prinsip presentasi referensi Mees Verberne: navigasi ringkas, whitespace, headline besar, metadata kecil, project bernomor, dan motion halus.
- Menjaga brand, copy, aset, logo, dan implementasi tetap orisinal.
- Menyeimbangkan kebutuhan recruiter/HR dan calon klien freelance.

## Design tokens

| Token | Nilai | Peran |
| --- | --- | --- |
| `--ink` | `#121212` | Permukaan gelap, teks utama di atas paper |
| `--paper` | `#f2efe9` | Latar terang dan teks di atas ink |
| `--red` | `#ee3824` | CTA utama dan status penting |
| `--orange` | `#f7a026` | Nomor project, highlight, hover, aksen pendukung |
| `--line` | `rgba(18,18,18,.18)` | Divider dan border |
| `--muted` | `#77736d` | Metadata dan teks sekunder |
| `--display` | `Space Grotesk` | Display dan body |
| `--mono` | `DM Mono` | Label, nomor, tahun, stack, status |

Gunakan orange sebagai latar badge/CTA dengan teks gelap, garis, focus ring, atau ornamen. Hindari orange sebagai teks isi kecil di atas paper. Periksa kontras semua kombinasi sebelum rilis.

## Hirarki halaman dan komponen

1. **Header:** monogram/wordmark Adi, anchor menu, CTA kontak; transparan di Hero dan memiliki state setelah scroll.
2. **Hero:** label role/status, headline besar, deskripsi singkat, CTA `Lihat karya` dan `Hubungi saya`; CTA CV hanya setelah CV asli tersedia.
3. **Selected Projects:** dua kartu awal, berurutan dan bernomor. KONI mendapat media desktop + mobile, kontribusi frontend, serta tombol `Buka Website Live`.
4. **About:** copy personal singkat; hindari klaim generik yang tidak didukung.
5. **Skills:** skill inti ditautkan ke project evidence; TypeScript/Next.js ditaruh di `Currently learning` jika masih dipelajari.
6. **Experience/Education:** informasi faktual, periode dan detail pengalaman hanya jika sudah diverifikasi.
7. **Services:** empat layanan yang sudah dirancang; tiap layanan memiliki nama dan satu kalimat cakupan.
8. **Process:** empat langkah kerja dengan nomor dan deskripsi ringkas.
9. **FAQ:** accordion dengan `<button>`, `aria-expanded`, dan `aria-controls`.
10. **Contact/Footer:** email dan WhatsApp sebagai jalur utama; tautan sosial hanya jika valid.

## Pola visual

- Headline besar: `clamp(3.3rem, 7.5vw, 8rem)` atau skala terkait yang muat di layar.
- Metadata menggunakan DM Mono dan kontras yang cukup.
- Gunakan divider untuk ritme editorial; hindari menambahkan card border pada semua konten.
- Nomor section menjadi motif konsisten, bukan informasi utama.
- Screenshot project menggunakan rasio dan crop konsisten; versi mobile boleh berada dalam frame ponsel buatan sendiri.
- Jangan gunakan browser chrome Safari pada screenshot mobile dalam layout final; crop atau beri mockup device tanpa mengubah isi website.

## Responsive behavior

- Desktop: header horizontal; About, Skills, FAQ, dan detail project dapat memakai grid dua kolom.
- Mobile: navigasi menjadi menu toggle, semua grid satu kolom, metadata tetap terbaca, CTA lebar nyaman disentuh.
- Uji 320px, 375px, 700/768px, 1024px, dan layar desktop.
- Hindari overflow horizontal, headline terpotong, dan elemen floating yang menutupi tombol/teks.

## Motion dan accessibility

- Reveal/hero menggunakan opacity dan translate kecil; hindari scroll hijacking/parallax berat.
- Hover project ringan; semua affordance harus terlihat pula pada touch dan keyboard.
- `prefers-reduced-motion: reduce` menonaktifkan gerak yang tidak perlu dan menampilkan konten langsung.
- Sediakan focus ring jelas, skip link, landmark semantik, satu `h1`, alt text deskriptif, dan nama tombol yang bermakna.
- Kontras teks, status, focus ring, dan CTA harus diuji sebelum rilis.

## Copy yang menjadi acuan

**Hero:** “Frontend Developer yang mengubah ide menjadi pengalaman digital yang jelas, responsif, dan mudah digunakan.”

**About:** “Saya adalah Frontend Developer yang tertarik pada proses mengubah kebutuhan menjadi interface web yang terstruktur dan mudah digunakan. Saya mengerjakan implementasi layout, responsive design, interaksi frontend, serta memastikan tampilan dapat berjalan dengan baik di berbagai perangkat.”

**Project KONI:** “Saya mendesain dan mengimplementasikan hampir seluruh halaman publik website secara responsif. Backend dan admin panel Filament dikerjakan oleh anggota tim lain.”

Copy akhir dapat disunting agar terdengar alami bagi pemilik portfolio; fakta dan atribusinya harus tetap sama.
