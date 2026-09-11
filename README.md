# Rizu Sensei Standalone v5

Atlas belajar Jepang N5–N1. Header dikelompokkan menjadi Belajar, Kamus, Latihan, Progres, dan Produk.

## Membuka di Windows

1. Ekstrak ZIP ke satu folder.
2. Pastikan Node.js tersedia, kemudian klik dua kali START.bat.
3. Buka http://127.0.0.1:4174 di browser. Biarkan jendela server tetap berjalan.

Alternatif: gunakan server statis pilihan Anda atau unggah seluruh folder ke hosting HTTPS. Jangan hanya membuka index.html dengan file:// karena halaman database dan alat analisis memerlukan pemuatan berkas lokal lewat HTTP. Tidak ada npm install, build, akun, atau server database yang diperlukan.

## Isi

- 250 lesson N5–N1, 8.334 kosakata OpenJLPT, 2.211 rekaman kanji OpenJLPT, 50 bacaan, 100 naskah shadowing.
- 35 tutorial dan 22 panduan keigo orisinal, catatan, bookmark, kuis, TTS, dan progres.
- 13.108 karakter kanji, 165.531 objek entri kamus umum, 6.704 template tulisan tangan dan diagram KanjiVG.
- 70 peribahasa dataset publik, 56 onomatope dan 60 kata serapan pilihan orisinal.
- Labs: kuis kana, drill JLPT, analisis Kuromoji, konjugasi, angka/pencacah, katakana, dan kandidat tulisan tangan.
- SRS, mock, streak, kalender, statistik, export/import, serta enam produk Ariefanoisme tetap tersedia.

## Memindahkan progres

Ekspor JSON dari dashboard versi lama, lalu impor melalui Progres di v5. Impor mengganti state aktif; simpan cadangan dahulu. Jika origin/alamat sama, v5 membaca penyimpanan lama secara otomatis. Skema v3/v4/v5 didukung. Panduan tambahan dihitung terpisah dari 250 lesson.

## Offline dan ukuran paket

Semua data berada di folder ini. Server lokal dapat digunakan tanpa internet. Pada hosting, PWA menyimpan halaman inti terlebih dahulu; kamus besar, diagram, dan kamus analisis disimpan setelah dimuat. Suara Jepang mengikuti perangkat. Perekaman memerlukan localhost/HTTPS dan izin mikrofon. Pencarian kamus lengkap menggunakan memori lebih besar; pencarian per kanji lebih ringan.

## Cakupan dan lisensi

Baca CAKUPAN-v5.md untuk pemetaan 11 sumber dan batas inventori. Versi ini tidak mengklaim seluruh artikel/entri situs sumber telah diadaptasi. Baca sources.html, DATA-SOURCES.md dan notice vendor untuk atribusi. Diagram dan template turunan KanjiVG: CC BY-SA 3.0. Data leksikal mengikuti lisensi sumbernya.

Validasi logika, data, rute lokal, migrasi dan mock dijelaskan di VALIDATION.md. Belum dilakukan pengujian visual/interaksi di browser.
