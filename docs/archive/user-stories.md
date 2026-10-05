# User Stories — Portfolio Adi Satria Ramadani

## Tujuan dokumen

Menetapkan kebutuhan dari sudut pandang pengunjung sebelum alur halaman dan visual dirancang. Target utama portfolio adalah recruiter/HR dan calon klien freelance.

## Persona dan stories

### Recruiter / HR

1. Sebagai recruiter, saya ingin segera memahami posisi dan fokus Adi agar bisa menilai kecocokannya dengan lowongan frontend.
   - **Acceptance:** Hero menyebut Frontend Developer, menjelaskan nilai yang ditawarkan, dan menyediakan CTA ke karya serta kontak.
2. Sebagai recruiter, saya ingin melihat bukti kemampuan, bukan hanya daftar teknologi.
   - **Acceptance:** Project menampilkan kontribusi Adi, ringkasan, teknologi yang dipakai, status, dan tautan bukti yang tersedia.
3. Sebagai recruiter, saya ingin menemukan pengalaman, pendidikan, dan CV dengan mudah.
   - **Acceptance:** Informasi pengalaman dan pendidikan mudah ditemukan; CTA CV hanya aktif jika file CV asli tersedia.
4. Sebagai recruiter, saya ingin membuka GitHub atau LinkedIn untuk memeriksa informasi lanjutan.
   - **Acceptance:** Tautan hanya ditampilkan jika URL aktif dan benar.

### Calon klien freelance

1. Sebagai calon klien, saya ingin mengetahui jenis website yang dapat dibangun Adi.
   - **Acceptance:** Services menjelaskan landing page, company profile, personal portfolio, dan frontend implementation dengan ringkas.
2. Sebagai calon klien, saya ingin melihat contoh website yang sudah dikerjakan.
   - **Acceptance:** Kartu KONI menampilkan preview desktop/mobile, kontribusi frontend secara jujur, dan tombol ke website live.
3. Sebagai calon klien, saya ingin memahami bagaimana project akan berjalan sebelum menghubungi.
   - **Acceptance:** Process menjelaskan empat tahap: memahami kebutuhan, menyusun struktur, membangun interface, review dan penyelesaian.
4. Sebagai calon klien, saya ingin mendapat jawaban dasar tentang estimasi, biaya, source code, dan revisi.
   - **Acceptance:** FAQ dapat dibaca dan dioperasikan dengan keyboard; jawaban tidak membuat janji harga atau jadwal yang belum disepakati.
5. Sebagai calon klien, saya ingin menghubungi Adi lewat kanal yang mudah.
   - **Acceptance:** Email dan WhatsApp aktif; link GitHub/LinkedIn hanya muncul jika tersedia.

### Pengunjung mobile

1. Sebagai pengunjung mobile, saya ingin membaca halaman dan melihat project tanpa zoom atau scroll horizontal.
   - **Acceptance:** Tidak ada overflow horizontal pada viewport 320px ke atas; gambar project sesuai lebar layar.
2. Sebagai pengunjung mobile, saya ingin membuka navigasi dan berpindah section dengan mudah.
   - **Acceptance:** Toggle memiliki label dan state aksesibel; menu dapat ditutup setelah memilih tautan atau menekan Escape.

## Aturan kepercayaan dan atribusi

- Project KONI ditampilkan sebagai kerja frontend kolaboratif. Adi mendesain dan mengimplementasikan hampir seluruh halaman publik secara responsif; backend dan admin panel Filament ditangani rekan lain. Jangan mencantumkan supervisor, durasi, atau deployment sebagai bagian kontribusi.
- Project tugas magang yang dikerjakan sebagai joki tidak ditampilkan sebagai karya pribadi atau project komersial.
- Project pribadi dan project mandiri hanya dipublikasikan sesuai status sebenarnya.
- Jangan mengarang angka dampak, testimoni, klien, hasil bisnis, atau tingkat penguasaan skill.

## Prioritas

- **Must:** positioning, project KONI dengan atribusi benar, project portfolio pribadi, skills dengan bukti, contact, responsif, akses keyboard.
- **Should:** Services, Process, FAQ, Experience/Education, CV asli, GitHub/LinkedIn.
- **Could:** project mandiri ketiga, testimoni yang berizin, analytics.
- **Won't for initial release:** backend/CMS portfolio, dashboard, iframe KONI selama server membatasi `SAMEORIGIN`, klaim atau data yang tidak dapat diverifikasi.
