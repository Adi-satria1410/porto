# Header Design — Centered Pill Navbar

## Tujuan

Mengubah header portfolio menjadi navigasi yang terasa ringan dan modern:

- Saat halaman berada di bagian atas, header tetap terbuka dan membentang mengikuti lebar layout.
- Saat pengguna melakukan scroll, header menyusut menjadi pill/persegi panjang dengan ujung oval di tengah layar.
- Pada desktop, brand `ASR` dan tombol `Hubungi saya` bergerak mendekati kumpulan link navigasi.
- Pada mobile, header juga berubah menjadi pill kecil di tengah layar dengan pola visual yang sama.

Fokus perubahan hanya pada perilaku dan tampilan header. Jangan mengubah isi section lain, copywriting, struktur project, atau komponen yang tidak berkaitan dengan navbar.

## Markup yang dipertahankan

Gunakan struktur header yang sudah ada di `index.html`:

```html
<header class="navbar" id="navbar">
  <a href="#hero" class="navbar__brand" aria-label="Adi Satria Ramadani, kembali ke beranda">
    ASR<span>®</span>
  </a>

  <nav class="navbar__links" id="navLinks" aria-label="Navigasi utama">
    <a href="#projects">Karya</a>
    <a href="#about">Tentang</a>
    <a href="#skills">Keahlian</a>
    <a href="#experience">Pengalaman</a>
    <a href="#services">Layanan</a>
    <a href="#process">Proses</a>
    <a href="#faq">FAQ</a>
  </nav>

  <a class="navbar__contact" href="#contact">
    Hubungi saya <span aria-hidden="true">↗</span>
  </a>

  <button
    class="navbar__toggle"
    id="navToggle"
    type="button"
    aria-label="Buka menu"
    aria-controls="navLinks"
    aria-expanded="false"
  >
    <span aria-hidden="true"></span><span aria-hidden="true"></span>
  </button>
</header>
```

## Perilaku desktop

### State awal — bagian atas halaman

- Header berada di posisi fixed atau sticky sesuai struktur yang sudah tersedia.
- Header membentang mengikuti container/layout halaman.
- Background tetap transparan atau menyatu dengan background halaman.
- Brand berada di sisi kiri.
- Link navigasi berada di area tengah.
- Link `Hubungi saya` berada di sisi kanan.
- Tidak ada perubahan layout besar saat halaman baru dimuat.

### State scroll — pill terpusat

Aktifkan state `.is-scrolled` ketika `window.scrollY > 24px`.

- Header berubah menjadi bentuk pill/persegi panjang dengan `border-radius` tinggi.
- Lebar header menjadi compact dan berada tepat di tengah viewport.
- Sediakan jarak kiri dan kanan yang jelas dari tepi viewport.
- Background menggunakan warna surface yang kontras dengan halaman, misalnya `var(--paper)` atau warna token yang setara.
- Tambahkan border tipis dan/atau shadow ringan; hindari efek glassmorphism berlebihan.
- Brand `ASR` dan link `Hubungi saya` bergerak mendekati kumpulan link navigasi.
- Jarak antarelemen dipadatkan secara halus tanpa membuat teks bertabrakan.
- Header tetap berada di atas konten dan tidak mengubah tinggi dokumen secara tiba-tiba.

## Perilaku mobile

### State awal — bagian atas halaman

- Header mengikuti lebar layout mobile dengan padding yang wajar.
- Brand `ASR` tetap terlihat.
- Tombol hamburger menjadi kontrol utama untuk membuka menu.
- Link navigasi dan tombol kontak tidak dipaksakan tampil dalam satu baris sempit.
- Menu mobile yang sudah ada tetap digunakan dan tetap dapat dibuka/ditutup.

### State scroll — pill mobile

Saat `.is-scrolled` aktif:

- Header berubah menjadi pill kecil yang terpusat di tengah viewport, mengikuti prinsip visual desktop.
- Pill berisi brand `ASR` dan tombol hamburger.
- Link navigasi tetap tersembunyi sampai menu dibuka.
- Tombol `Hubungi saya` tidak dipaksakan masuk ke pill jika ruang tidak cukup; akses kontak tetap tersedia melalui menu mobile.
- Ukuran pill, padding, dan gap menyesuaikan viewport 320–430px.
- Ujung pill tetap oval dan tidak berubah menjadi kotak bersudut tajam.
- Saat menu dibuka, panel/dropdown harus tetap terbaca, tidak terpotong oleh viewport, dan berada di atas konten.

## Transisi dan motion

- Gunakan transisi singkat dan halus untuk `transform`, `opacity`, `background-color`, `border-color`, `box-shadow`, `border-radius`, `padding`, dan `gap`.
- Durasi yang disarankan: `250–400ms` dengan easing yang lembut.
- Jangan menganimasikan `width: auto` secara langsung.
- Hindari perubahan yang memicu layout shift, flicker, atau header bergerak berulang ketika pengguna berhenti di batas scroll.
- State scroll harus stabil ketika pengguna scroll naik-turun dengan cepat.
- Hormati `prefers-reduced-motion: reduce` dengan mematikan atau mempersingkat transisi.

## Aksesibilitas

- Pertahankan `aria-label`, `aria-controls`, dan `aria-expanded` pada tombol hamburger.
- Update `aria-expanded` sesuai kondisi menu.
- Semua link dan tombol tetap dapat diakses melalui keyboard.
- Focus state harus terlihat jelas pada background header atas maupun pill.
- Jangan mengandalkan warna saja untuk menunjukkan state aktif.
- Pastikan teks memiliki kontras yang cukup dalam kedua state header.

## Batasan implementasi

File yang boleh disentuh untuk pekerjaan ini:

- `index.html` — hanya jika diperlukan untuk mempertahankan atau memperbaiki struktur header.
- `css/variables.css` — hanya untuk token header yang memang belum tersedia.
- `css/style.css` — styling state awal, state scroll, responsive, dan transisi.
- `js/main.js` — deteksi scroll dan sinkronisasi menu mobile.

Jangan mengubah section Hero, Projects, About, Skills, Experience, Services, Process, FAQ, Contact, Footer, preloader, atau analytics.

## Checklist validasi

Uji pada ukuran viewport berikut:

- Desktop: `1440px`, `1280px`, `1024px`.
- Tablet: `768px`.
- Mobile: `430px`, `390px`, `375px`, `320px`.

Pastikan:

- Header atas dan header scroll memiliki perbedaan visual yang jelas.
- Pill selalu berada di tengah viewport.
- Brand dan kontak mendekati navigasi pada desktop.
- Mobile scroll state menampilkan pill kecil berisi brand dan hamburger.
- Menu mobile tetap dapat dibuka, ditutup, dan dinavigasikan.
- Tidak ada teks yang terpotong atau bertabrakan.
- Tidak ada horizontal overflow.
- Tidak ada perubahan pada isi section lain.
- Tidak ada error JavaScript di console.

## Kriteria selesai

Pekerjaan dianggap selesai apabila header memiliki dua state yang konsisten di desktop dan mobile, transisi terasa halus, menu tetap aksesibel, dan seluruh checklist validasi terpenuhi tanpa mengubah area portfolio lainnya.
