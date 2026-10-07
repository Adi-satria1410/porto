# Detail Konten dan Fitur Portfolio Adi Satria Ramadani

Dokumen ini menjabarkan identitas pemilik, deskripsi portfolio, isi konten, layanan, karya, serta fitur untuk pengunjung dan admin. Pembahasan tidak mencakup gaya desain, susunan visual, tipografi, atau pewarnaan.

**Tanggal pendataan:** 7 Oktober 2026.  
**Dasar pendataan:** konten dan implementasi dalam repository saat dokumen dibuat. Data koleksi project di Supabase tidak diambil secara langsung. Keterangan “tersedia” berarti ditemukan dalam kode, bukan pernyataan bahwa seluruh fitur telah diverifikasi di website produksi.

## 1. Gambaran umum portfolio

ASR Portfolio adalah website portfolio pribadi Adi Satria Ramadani yang memperkenalkan dirinya sebagai Frontend Developer. Website ini menjadi tempat untuk menjelaskan kemampuan, pengalaman, pendidikan, karya, layanan yang ditawarkan, proses kerja, dan cara menghubungi pemiliknya.

Deskripsi utama yang digunakan:

> Frontend Developer yang mengubah ide menjadi pengalaman digital yang jelas, responsif, dan mudah digunakan.

Portfolio berfungsi sebagai bahan pertimbangan bagi recruiter maupun calon klien. Selain profil dan dua karya utama di beranda, website menyediakan koleksi contoh project yang dapat dikelola melalui akun admin.

Tujuan portfolio:

- Memperkenalkan identitas dan bidang pekerjaan Adi.
- Menunjukkan kemampuan melalui karya dan penjelasan kontribusi.
- Mendokumentasikan pengalaman, proses belajar, dan eksplorasi frontend.
- Menjelaskan jenis website yang dapat dikerjakan.
- Membantu pengunjung memahami proses kerja sebelum membahas project.
- Menyediakan jalur kontak untuk peluang kerja atau kerja sama.
- Memungkinkan pemilik mengelola koleksi project beserta screenshot dan status publikasinya.

## 2. Identitas pemilik

| Informasi | Isi yang tercantum |
| --- | --- |
| Nama lengkap | Adi Satria Ramadani |
| Identitas singkat | ASR |
| Profesi utama | Frontend Developer |
| Negara | Indonesia |
| Status peluang kerja | Open to Work |
| Ketersediaan project | Available for Selected Projects; terbuka untuk project tertentu |
| Pendidikan | Sarjana (S1) Sistem Informasi |
| Perguruan tinggi | Universitas Bina Sarana Informatika |
| Email | adisatria1410@gmail.com |
| GitHub | https://github.com/Adi-satria1410 |
| Bahasa utama website | Bahasa Indonesia, dengan sejumlah istilah teknis berbahasa Inggris |
| Tahun yang tercantum pada portfolio | 2026 |

Kota domisili, nomor telepon, tanggal lahir, tahun masuk/lulus kuliah, dan riwayat pekerjaan dengan rentang tanggal belum dicantumkan dalam konten beranda.

## 3. Deskripsi diri dan bidang pekerjaan

Adi memperkenalkan dirinya sebagai Frontend Developer yang tertarik pada proses menerjemahkan kebutuhan menjadi antarmuka web yang terstruktur dan mudah digunakan. Pekerjaannya mencakup implementasi antarmuka, penyesuaian penggunaan pada berbagai perangkat, dan interaksi frontend.

Pengalaman yang disebutkan adalah pengerjaan frontend website publik KONI Kabupaten Karawang. Portfolio pribadi juga sedang dikembangkan untuk mendokumentasikan karya, proses belajar, dan kemampuan membangun produk digital.

Pendidikan Sistem Informasi dijelaskan sebagai dasar ketertarikan pada hubungan antara kebutuhan manusia dan solusi digital yang terstruktur serta mudah digunakan.

## 4. Pengguna yang dituju

| Pengguna | Kebutuhan yang dilayani |
| --- | --- |
| Recruiter atau HR | Mengenali profil, kemampuan, pengalaman, pendidikan, karya, dan status kesiapan kerja |
| Calon klien freelance | Menilai hasil pekerjaan, memahami layanan, proses kerja, ketentuan awal, dan cara menghubungi pemilik |
| Sesama developer atau calon kolaborator | Melihat teknologi, kontribusi pada project, eksplorasi frontend, dan profil GitHub |
| Pemilik portfolio sebagai admin | Menambah, memperbarui, memeriksa, mempublikasikan, menyembunyikan, dan menghapus koleksi project |

## 5. Isi beranda

Beranda tersedia melalui `index.html`. Konten utamanya mencakup perkenalan, karya, tentang diri, keahlian, pengalaman dan pendidikan, layanan, proses kerja, FAQ, serta kontak.

### 5.1 Perkenalan

Informasi yang diberikan adalah nama lengkap, profesi Frontend Developer, negara Indonesia, tahun portfolio, status terbuka terhadap pekerjaan, dan ketersediaan untuk project tertentu.

Terdapat tindakan **Lihat karya** untuk menuju informasi project dan **Hubungi saya** untuk menuju kontak.

### 5.2 Karya utama: portfolio pribadi

| Aspek | Keterangan |
| --- | --- |
| Nama/deskripsi karya | Portfolio pribadi untuk membaca kemampuan dengan cepat |
| Kategori | Personal Project |
| Tahun yang ditampilkan | 2026 |
| Status yang ditampilkan | In development |
| Tujuan | Memperkenalkan profil, karya, pengalaman, dan jalur kontak kepada recruiter maupun calon klien |
| Teknologi yang disebutkan | HTML5, CSS3, JavaScript vanilla |
| Fokus fungsional | Penggunaan pada berbagai perangkat, navigasi anchor, progressive enhancement, dan interaksi dasar |

Progressive enhancement berarti konten dasar beranda tersedia melalui HTML, sedangkan JavaScript menambahkan interaksi. Galeri berbasis database dan halaman admin memiliki kebutuhan JavaScript tersendiri.

### 5.3 Karya utama: website KONI Kabupaten Karawang

| Aspek | Keterangan |
| --- | --- |
| Nama project | Website publik KONI Kabupaten Karawang |
| Kategori | Collaborative Project |
| Deskripsi | Antarmuka publik untuk informasi olahraga Karawang |
| Kontribusi Adi | Mendesain dan mengimplementasikan hampir seluruh halaman publik, termasuk penyesuaian penggunaan di berbagai perangkat |
| Kontribusi anggota tim lain | Backend dan admin panel Filament |
| Bukti karya | Dua screenshot website: versi desktop dan versi mobile |
| Tautan yang dicantumkan | https://konikarawang.or.id/ |

Screenshot dapat dibuka untuk diperiksa lebih jelas. Tautan **Buka Website Live** mengarah ke website KONI.

Portfolio tidak merinci seluruh teknologi project KONI, durasi pengerjaan, atau dampak bisnisnya. Backend, admin panel Filament, dan deployment KONI tidak dicatat sebagai kontribusi Adi. Penyebutan Filament pada project ini juga terpisah dari sistem admin portfolio yang menggunakan Supabase.

### 5.4 Keahlian

| Keahlian yang dicantumkan | Konteks kemampuan |
| --- | --- |
| HTML5 | Menyusun struktur konten halaman web |
| CSS3 | Mendukung implementasi antarmuka yang dapat digunakan pada berbagai ukuran perangkat |
| JavaScript vanilla | Menambahkan interaksi frontend |
| Frontend implementation | Mengimplementasikan antarmuka website publik |
| UI design | Perancangan antarmuka pengguna |
| Problem solving | Menyelesaikan kebutuhan dan permasalahan dalam konteks project |

Daftar keahlian menyediakan tautan ke karya terkait sebagai konteks pendukung. Website tidak mencantumkan persentase penguasaan, sertifikasi, atau jumlah tahun pengalaman untuk setiap keahlian.

Teknologi yang dicantumkan dalam kategori **Currently Learning** adalah **TypeScript** dan **Next.js**. Keduanya dinyatakan sebagai materi yang sedang dipelajari.

### 5.5 Pengalaman dan pendidikan

Pengalaman yang ditampilkan adalah kontribusi frontend pada website publik KONI Kabupaten Karawang. Deskripsinya menegaskan bahwa pekerjaan tersebut merupakan project kolaboratif dengan kontribusi pada hampir seluruh halaman publik.

Pendidikan yang ditampilkan adalah **Sarjana (S1) Sistem Informasi, Universitas Bina Sarana Informatika**. Belum ada informasi IPK, periode studi, atau judul tugas akhir dalam beranda.

### 5.6 Layanan

| Layanan | Penjelasan |
| --- | --- |
| Landing Page | Halaman promosi untuk UMKM, produk digital, event, atau personal brand |
| Company Profile | Website yang menjelaskan identitas, layanan, portfolio, dan kontak bisnis |
| Personal Portfolio | Website bagi freelancer, developer, kreator, atau profesional |
| Frontend Implementation | Mengubah desain atau struktur halaman menjadi antarmuka yang dapat digunakan pada berbagai perangkat |

Website belum menyediakan paket harga, formulir pemesanan layanan, atau pembayaran. Pembahasan kebutuhan dilakukan melalui kontak yang tersedia.

### 5.7 Proses kerja

1. **Memahami kebutuhan:** membahas tujuan, target pengguna, konten, fitur, dan hasil yang ingin dicapai.
2. **Menyusun struktur:** menentukan kebutuhan halaman, navigasi, hierarki informasi, dan kebutuhan penggunaan pada berbagai perangkat.
3. **Membangun interface:** mengimplementasikan frontend sesuai kebutuhan project.
4. **Review dan penyelesaian:** melakukan pemeriksaan pada perangkat, revisi, dan penyerahan hasil atau handoff.

### 5.8 Pertanyaan umum atau FAQ

| Pertanyaan | Jawaban yang dicantumkan |
| --- | --- |
| Bagaimana menentukan estimasi project? | Estimasi dibahas setelah tujuan, scope, jumlah halaman, konten, dan kebutuhan teknis dipetakan bersama. |
| Bagaimana menentukan biaya? | Biaya dibicarakan berdasarkan scope dan kebutuhan teknis. Rincian diberikan setelah ruang lingkup project jelas. |
| Apakah source code dapat diserahkan? | Kepemilikan dan bentuk handoff source code dibahas di awal dan disepakati sesuai scope project. |
| Bagaimana dengan revisi? | Jumlah dan batas revisi ditentukan dalam scope agar proses review tetap jelas. |

Jawaban tidak menjanjikan durasi, nominal harga, jumlah revisi, atau penyerahan source code dengan ketentuan yang seragam untuk semua project.

### 5.9 Kontak

Bagian kontak mengajak pengunjung membicarakan ide website melalui pesan **“Punya ide website?”** dan **“Mari buat sesuatu yang jelas.”**

- **Email:** `adisatria1410@gmail.com`. Tautan menggunakan `mailto:` untuk membuka aplikasi email pengunjung.
- **GitHub:** `https://github.com/Adi-satria1410`. Tautan membuka profil GitHub di tab baru.

Website tidak memiliki formulir pengiriman pesan internal. Pengiriman email berlangsung melalui aplikasi atau layanan email pengunjung.

Identitas hak cipta yang dicantumkan adalah **© 2026 Adi Satria Ramadani**.

## 6. Interaksi pada beranda

| Fitur | Perilaku |
| --- | --- |
| Navigasi bagian konten | Mengarah ke Karya, Tentang, Keahlian, Pengalaman, Layanan, Proses, FAQ, dan Kontak menggunakan anchor |
| Kembali ke awal | Identitas ASR dan tautan kembali ke atas mengarah ke awal beranda |
| Menu untuk perangkat kecil | Dapat dibuka/ditutup; menutup setelah tautan dipilih, klik di luar menu, atau tombol Escape ditekan |
| FAQ interaktif | Setiap jawaban dapat dibuka/ditutup; saat JavaScript aktif, jawaban pertama terbuka pada awalnya |
| Pembesaran screenshot KONI | Klik screenshot membuka lightbox; dapat ditutup melalui tombol tutup, area luar gambar, Escape, atau navigasi Back |
| Akses galeri tambahan | Tautan Lihat contoh project membuka `contoh-project.html` |
| Status pembukaan halaman | Terdapat indikator pembukaan singkat dengan batas waktu otomatis; angkanya berbasis waktu, bukan pengukuran unduhan seluruh aset |
| Lewati ke konten utama | Tautan khusus membantu pengguna langsung menuju konten utama |

Informasi dasar beranda dan jawaban FAQ tersedia dalam HTML. Interaksi tambahan seperti lightbox memerlukan JavaScript.

## 7. Galeri contoh project

Halaman `contoh-project.html` menjadi ruang untuk ide, latihan, eksplorasi frontend, dan kumpulan project pribadi. Kontennya dibaca dari Supabase dan hanya memuat project berstatus **published**.

Galeri ini merupakan koleksi terpisah dari dua karya utama yang ditulis langsung pada beranda. Perubahan melalui admin mengubah koleksi tersebut; perubahan itu tidak otomatis mengganti uraian karya utama di `index.html`.

### 7.1 Informasi setiap project

- Nama project.
- Deskripsi project.
- Daftar teknologi.
- Gambar utama atau cover, jika tersedia.
- Kumpulan screenshot yang dapat dibuka.
- Tautan **Lihat demo**, jika URL demo valid tersedia.

Jumlah dan nama project dalam database tidak ditetapkan di dokumen ini karena dapat berubah melalui admin dan tidak diperiksa langsung saat pendataan.

### 7.2 Fitur pengunjung galeri

- Membaca koleksi tanpa login.
- Melihat jumlah project yang dipublikasikan.
- Berpindah melalui tombol **Sebelumnya** dan **Berikutnya**, dengan maksimal **9 project per halaman**.
- Membuka screenshot dalam dialog lightbox.
- Menelusuri screenshot satu project melalui tombol sebelumnya/berikutnya atau tombol panah kiri/kanan pada keyboard.
- Membaca keterangan gambar beserta nomor gambar dalam koleksi screenshot.
- Menutup dialog melalui tombol tutup atau Escape.
- Membuka demo yang valid di tab baru.
- Kembali ke karya di beranda atau menuju informasi kontak.

Urutan project mengikuti nilai urutan yang ditetapkan admin, kemudian waktu pembuatan dan ID sebagai pembeda. Gambar utama didahulukan; apabila belum ditetapkan, gambar pertama berdasarkan urutan menjadi pilihan awal.

### 7.3 Kondisi data dan koneksi

Galeri membedakan kondisi memuat, koleksi kosong, dan gagal memuat. Ketika koneksi gagal, pengunjung memperoleh pesan kesalahan dan tombol **Coba lagi**. Jika gambar gagal dimuat, nama, deskripsi, dan informasi project tetap dapat ditampilkan.

JavaScript dan koneksi ke Supabase diperlukan untuk membaca koleksi. Jika JavaScript dinonaktifkan, halaman memberikan pemberitahuan untuk mengaktifkannya. Galeri belum menyediakan pencarian atau filter kategori untuk pengunjung.

## 8. Fitur admin

Admin digunakan untuk mengelola koleksi contoh project. Cakupannya belum meliputi pengubahan profil, keahlian, pengalaman, pendidikan, layanan, FAQ, dan kontak beranda.

### 8.1 Login dan akses akun

- Halaman login tersedia di `admin/login.html`.
- Login menggunakan email dan password melalui Supabase Auth.
- Tersedia pilihan untuk menampilkan atau menyembunyikan password.
- Sistem memeriksa sesi dan apakah akun terdaftar sebagai admin portfolio.
- Login dengan akun biasa tidak otomatis memberikan hak admin.
- Pengguna tanpa sesi diarahkan ke halaman login saat mencoba membuka halaman pengelolaan.
- Tidak tersedia formulir registrasi publik atau pemulihan password di halaman login saat ini.
- Tombol **Keluar** pada daftar project mengakhiri sesi pada browser yang digunakan.

### 8.2 Daftar dan pencarian project

Halaman `admin/index.html` menyediakan:

- Daftar project draft dan published.
- Informasi nama, deskripsi, teknologi, status, urutan, dan tanggal pembaruan.
- Identitas email akun yang sedang login.
- Pencarian berdasarkan nama project.
- Filter **Semua status**, **Draft**, dan **Published**.
- Pagination dengan maksimal **12 project per halaman**.
- Tombol muat ulang daftar.
- Tindakan tambah project, edit draft, publish, kembalikan ke draft, dan hapus project.
- Tautan menuju galeri publik.

Kondisi daftar kosong, tidak ada hasil pencarian, dan kegagalan koneksi memiliki pesan tersendiri.

### 8.3 Menambah dan mengedit draft

Editor tersedia di `admin/project.html`. Project baru disimpan sebagai draft. Editor hanya mengubah project yang berstatus draft; project published harus dikembalikan ke draft terlebih dahulu.

| Data | Ketentuan pada editor |
| --- | --- |
| Nama project | Wajib diisi, maksimal 160 karakter |
| Deskripsi | Maksimal 10.000 karakter; boleh kosong saat draft, wajib sebelum publish |
| Teknologi | Dipisahkan koma, maksimal 30 teknologi; duplikasi dihapus oleh pemrosesan input |
| Tautan demo | Opsional, maksimal 2.048 karakter, menggunakan URL lengkap HTTP/HTTPS tanpa kredensial atau spasi |
| Urutan tampil | Bilangan bulat dari 0 sampai 2.147.483.647 |

Tombol **Simpan draft** menyimpan informasi tersebut. Penyimpanan draft belum membuat project terlihat di galeri publik.

### 8.4 Pengelolaan screenshot

Draft harus disimpan terlebih dahulu sebelum screenshot dapat ditambahkan. Satu project dapat memiliki beberapa screenshot.

Fitur yang tersedia:

- Memilih file dan melihat preview lokal sebelum upload.
- Mengunggah screenshot satu per satu.
- Mengisi dan memperbarui keterangan gambar atau alt text, maksimal 300 karakter.
- Mengatur urutan screenshot.
- Menetapkan satu screenshot sebagai gambar utama.
- Menghapus screenshot setelah konfirmasi.
- Memuat ulang daftar screenshot untuk memeriksa hasil penyimpanan atau memulihkan kegagalan pemuatan.

Format yang diterima adalah **JPG/JPEG, PNG, dan WebP**, dengan ukuran lebih dari 0 dan maksimal **5 MiB per file**. SVG tidak termasuk format upload yang diterima.

Untuk mengganti file gambar, admin mengunggah gambar baru, menjadikannya gambar utama jika diperlukan, lalu menghapus gambar lama. Perubahan screenshot disimpan melalui tindakannya masing-masing, terpisah dari tombol Simpan draft.

### 8.5 Preview project

Tombol **Preview project** menampilkan nama, deskripsi, teknologi, demo yang valid, dan screenshot. Informasi teks mengikuti isian form saat ini, sedangkan screenshot mengikuti data yang sudah tersimpan.

Preview tidak menyimpan perubahan form secara otomatis dan tidak mempublikasikan project.

### 8.6 Publish dan kembali ke draft

Sebelum publish, sistem memeriksa:

1. Nama project dan data lain memenuhi aturan input.
2. Deskripsi tidak kosong.
3. Minimal satu teknologi tersedia.
4. Minimal satu screenshot tersedia.
5. Semua screenshot yang terdaftar dapat diunduh saat pemeriksaan.

Tautan demo tetap opsional. Setelah admin mengonfirmasi publikasi, status menjadi **published** dan project dapat dibaca oleh galeri publik.

Tindakan **Kembalikan ke draft** meminta konfirmasi dan menyembunyikan project dari permintaan galeri berikutnya. Project dapat diedit kembali, diperiksa, lalu dipublikasikan ulang.

Perubahan publikasi dibaca ketika galeri dimuat kembali atau meminta data baru; tidak ada pembaruan real-time otomatis. Konten yang sudah diunduh pengunjung tidak dapat ditarik kembali dari halaman yang sudah terbuka.

### 8.7 Hapus keseluruhan project

Tombol **Hapus project** meminta konfirmasi dengan menyebut nama project. Penghapusan mencakup data project, metadata screenshot, dan file screenshot dalam folder project tersebut.

Alur penghapusan mengembalikan project ke draft, membersihkan file, lalu menghapus data project. Jika pembersihan file gagal, data project dipertahankan sebagai draft agar proses dapat dicoba kembali. Sebagian file mungkin sudah terhapus pada kondisi gagal parsial.

Penghapusan bersifat permanen. Tidak tersedia fitur tempat sampah atau pemulihan melalui antarmuka admin.

## 9. Alur penggunaan

### 9.1 Pengunjung atau recruiter

1. Membaca identitas dan deskripsi profesi.
2. Meninjau karya utama dan kontribusi Adi.
3. Memeriksa screenshot atau membuka website project.
4. Membaca keahlian, pengalaman, dan pendidikan.
5. Menelusuri contoh project tambahan jika diperlukan.
6. Membuka GitHub atau menghubungi melalui email.

### 9.2 Calon klien

1. Memahami profil dan contoh hasil kerja.
2. Memilih jenis layanan yang sesuai kebutuhan.
3. Membaca proses kerja dan FAQ.
4. Menghubungi Adi melalui email untuk membicarakan tujuan, scope, estimasi, biaya, dan ketentuan kerja sama.

### 9.3 Admin

1. Login menggunakan akun admin yang terdaftar.
2. Membuat project dan menyimpan draft.
3. Melengkapi deskripsi, teknologi, serta demo jika ada.
4. Mengunggah screenshot, menulis keterangannya, dan menetapkan gambar utama.
5. Memeriksa preview dan menyimpan perubahan informasi yang diperlukan.
6. Mempublikasikan project melalui daftar admin.
7. Memeriksa hasil pada galeri publik.
8. Mengembalikan project ke draft untuk pengeditan berikutnya, atau menghapusnya jika diperlukan.

## 10. Data dan sistem pendukung

Website menggunakan HTML5, CSS3, dan JavaScript vanilla. Supabase menangani autentikasi admin, database project, dan penyimpanan screenshot. Repository juga menyediakan konfigurasi dan panduan deployment Vercel.

| Komponen data | Informasi yang dikelola |
| --- | --- |
| `portfolio_admins` | Identitas akun yang diberi izin admin |
| `projects` | ID, nama, deskripsi, teknologi, URL demo, status publikasi, urutan, serta waktu pembuatan dan pembaruan |
| `project_images` | Relasi screenshot ke project, lokasi file, keterangan gambar, penanda gambar utama, urutan, dan waktu pembuatan |
| Storage `project-screenshots` | File screenshot project dalam bucket privat |

Informasi profil dan isi beranda tersimpan langsung di HTML. Koleksi contoh project tersimpan di Supabase. Setelah fitur website terpasang, pembaruan koleksi melalui admin tidak memerlukan deployment ulang; perubahan konten HTML beranda memerlukan pembaruan file website.

### 10.1 Hak akses

| Kemampuan | Pengunjung tanpa login | Akun biasa/non-admin | Admin terdaftar |
| --- | --- | --- | --- |
| Membaca project published | Ya | Ya | Ya |
| Membaca project draft | Tidak | Tidak | Ya |
| Menambah, mengedit, dan menghapus project | Tidak | Tidak | Ya |
| Mengunggah dan menghapus screenshot | Tidak | Tidak | Ya |
| Mengubah status publikasi | Tidak | Tidak | Ya |
| Menetapkan akun admin melalui website | Tidak | Tidak | Tidak |

Pembatasan akses data diterapkan melalui kebijakan database dan Storage Supabase. Galeri publik menggunakan koneksi anonim yang terpisah dari sesi admin. File HTML halaman admin sendiri merupakan file statis; akses ke data dan operasi pengelolaan memerlukan otorisasi.

### 10.2 Dukungan penggunaan dan aksesibilitas

- Bahasa dokumen ditandai sebagai Bahasa Indonesia.
- Konten memiliki judul bagian dan penamaan kontrol.
- Form menggunakan label input.
- Screenshot memiliki teks alternatif atau keterangan.
- Sejumlah pesan pemuatan dan hasil tindakan dapat diumumkan oleh pembaca layar.
- Menu dan galeri mendukung interaksi keyboard sesuai fitur yang dijelaskan sebelumnya.
- Website menyediakan penyesuaian terhadap preferensi pengurangan gerakan.
- Beranda memiliki metadata judul, deskripsi, dan Open Graph; galeri memiliki judul serta deskripsi halaman.
- Halaman admin memuat arahan `noindex, nofollow` bagi mesin pencari. Arahan ini terpisah dari perlindungan akses akun.

Daftar tersebut mendeskripsikan dukungan di implementasi, bukan sertifikasi kepatuhan aksesibilitas menyeluruh.

## 11. Batas konten dan fitur saat ini

Beberapa hal disebutkan dalam dokumen rencana lama atau belum tersedia dalam implementasi saat pendataan:

| Informasi atau fitur | Keadaan saat ini |
| --- | --- |
| Download CV | Belum ada tombol atau file CV dalam website yang diperiksa |
| Kontak WhatsApp | Belum ada nomor maupun tautan WhatsApp pada beranda |
| LinkedIn | Belum ada tautan LinkedIn pada beranda |
| Form kontak | Belum tersedia; kontak menggunakan tautan email |
| Riwayat kerja lengkap | Baru ada kontribusi KONI; belum ada daftar perusahaan, jabatan, dan periode kerja lengkap |
| Detail studi | Nama jenjang, program studi, dan institusi tersedia; tahun serta IPK belum dicantumkan |
| Testimoni dan angka dampak | Belum ditampilkan |
| Studi kasus terpisah per project | Belum ada halaman khusus; informasi project terdapat di beranda atau galeri |
| Repository per project | Belum ada field tautan repository pada editor; GitHub tersedia sebagai tautan profil |
| Pencarian/filter galeri publik | Belum tersedia; pencarian dan filter status terdapat pada admin |
| Pengelolaan seluruh konten lewat admin | Belum tersedia; admin mengelola koleksi contoh project |
| Registrasi dan reset password mandiri | Belum ada form untuk keduanya |
| Blog, komentar, dan penilaian project | Belum tersedia |
| Pemesanan dan pembayaran layanan | Belum tersedia |
| Pilihan bahasa | Belum ada fitur penggantian bahasa |

Dokumen arsip digunakan sebagai konteks tujuan awal. Ketika terdapat perbedaan, penjelasan fitur dalam dokumen ini mengikuti implementasi saat ini.

## 12. Sumber pendataan

- [Beranda dan konten profil](../index.html).
- [Halaman contoh project](../contoh-project.html).
- [Interaksi beranda](../js/main.js).
- [Fungsi galeri publik](../js/public-projects.js).
- [Login admin](../admin/login.html), [daftar project](../admin/index.html), dan [editor project](../admin/project.html).
- [Logika akses admin](../js/services/admin.mjs), [editor](../js/services/project-editor.mjs), [publikasi](../js/services/publication.mjs), dan [penghapusan](../js/services/project-delete.mjs).
- [Panduan data dan akses Supabase](../supabase/README.md).
- [README proyek](../README.md).
- [PRD arsip](archive/PRD-Development-Plan-v3.md) untuk konteks tujuan dan batas kontribusi.
- [Laporan QA](QA-REPORT.md) untuk riwayat pengujian dan batas verifikasi.

Penyusunan dokumen ini tidak melakukan login admin, membaca koleksi Supabase secara langsung, atau menguji ulang website produksi.
