# Rizu Sensei 5.0 — peta cakupan

Versi ini memperluas v4 menjadi atlas belajar dengan navigasi Belajar, Kamus, Latihan, Progres, dan Produk. Semua 250 lesson N5–N1, 8.334 kosakata OpenJLPT, 2.211 rekaman kanji OpenJLPT, 50 reading, 100 shadowing, SRS, mock, statistik, catatan, bookmark, dan enam produk Ariefanoisme dipertahankan. Termasuk seluruh 150 lesson asli N5–N3.

## Pemetaan 11 referensi

| Referensi | Implementasi lokal | Cakupan dan batas |
|---|---|---|
| [Tutorial](https://jepang.org/tutorial/) | tutorials.html, guide.html | 35 panduan orisinal dalam enam tahap; penjelasan, contoh, tugas praktik, kuis, TTS, catatan, progres. Meliputi aksara, struktur, verba, angka/waktu, klausa, keigo, dan situasi sehari-hari. Kedalaman setiap artikel tidak diklaim identik dengan sumber. |
| [JLPT](https://jepang.org/jlpt/) | jlpt.html | Lima jalur N5–N1 dengan tautan lesson, kosakata, kanji, grammar, reading, listening, mock, serta progres. |
| [Kanji](https://kanji.jepang.org/) | explorer.html | Seluruh 13.108 karakter pada snapshot kanji-data; pencarian karakter, bacaan/kana/romaji dan arti Inggris; kelas sekolah, jumlah goresan, JLPT komunitas, serta 214 tombol komponen tradisional. Klasifikasi Kanken tidak tersedia. Pencarian komponen menggunakan KanjiVG, bukan cakupan seluruh karakter. |
| [Detail 丹](https://kanji.jepang.org/kanji/%E4%B8%B9) | kanji-detail.html?char=丹 | Empat goresan, animasi, bacaan, makna, Unicode, kelas/JLPT bila tersedia, frekuensi korpus, radikal, komponen, kosakata, bookmark, SRS. Detail bekerja untuk karakter lain. Tidak menyalin contoh editorial sumber. |
| [Kosakata](https://kanji.jepang.org/kosakata) | words.html | Seluruh 111 shard kata publik disertakan; indeks gabungan 165.531 objek entri unik setelah deduplikasi identik. Variasi penulisan/bacaan tetap tersedia. Pencarian seluruh kamus dimuat sesuai permintaan. Jumlah ini tidak sama dengan angka situs yang dapat menghitung bentuk kata atau dataset berbeda. Definisi sumber dalam bahasa Inggris. |
| [Labs](https://jepang.org/labs/) | labs.html | Kuis hiragana/katakana, tabel kana, drill kanji/kosakata, analisis morfologi Kuromoji, angka hingga 兆, pencacah, konjugasi, konversi ejaan bunyi nama ke katakana, canvas tulis dan kandidat kanji dari 6.704 template. Hasil tulisan tangan bersifat perkiraan; urutan goresan memengaruhi hasil. Konversi nama bukan penentu ejaan nama resmi. |
| [Onomatope](https://ono.jepang.org/) | onomatopoeia.html | 56 entri orisinal, lima kategori dan 14 tema; makna Indonesia, kalimat baru, audio TTS, pencarian/filter, bookmark/SRS. **Belum seluruh inventori situs sumber.** |
| [Tata bahasa](https://jepang.org/tata-bahasa/) | grammar.html | 100 pola kurikulum, tabel partikel, lima struktur dasar, kesalahan umum, tautan lesson dan konjugasi. Tutorial memperluas pengajaran fondasi. |
| [Kotowaza](https://kotowaza.jepang.org/) | proverbs.html | Seluruh 70 entri snapshot publik MIT; makna, romaji, contoh, padanan, dan relasi yang tersedia dipertahankan. **Dataset publik ini lebih kecil daripada inventori situs.** |
| [Gairaigo](https://gairaigo.jepang.org/) | loanwords.html | 60 entri pilihan orisinal; asal/bentuk sumber, kategori, singkatan, gabungan, wasei-eigo dan pergeseran makna. **Belum seluruh inventori atau sepuluh bahasa asal situs.** |
| [Keigo](https://jepang.org/keigo/) | keigo.html, guide.html | 22 panduan orisinal; lima kategori, tabel 30 verba, tiga contoh email singkat, lima konteks perkenalan, lima mini-dialog, daftar 12 kesalahan, N3–N1, dan kuis 25 soal. Materi lebih ringkas daripada kumpulan artikel penuh sumber. |

## Pelestarian dan data belajar

- State tetap menggunakan kunci `rizu_sensei_v3`, kini skema versi 5. Impor v3/v4/v5 diterima; daftar `guideDone` ditambahkan dengan nilai awal kosong.
- Progres 57 panduan dihitung terpisah dari 250 lesson; aktivitasnya masuk kalender/streak. Catatan dan bookmark muncul di dashboard. Kartu baru memakai SRS yang sama.
- Gunakan alamat situs/origin yang sama agar penyimpanan browser lama terbaca. Jika berpindah alamat, ekspor JSON dari versi lama lalu impor di v5.
- Halaman inti, data OpenJLPT, indeks kanji dan peribahasa masuk cache awal. Kamus lengkap, diagram, template tulisan dan kamus analisis teks dimuat saat digunakan, kemudian dicache. Seluruh berkas ada di paket; offline pada server lokal tidak memerlukan internet. Offline PWA di hosting memerlukan berkas terkait telah dimuat; penghapusan cache browser menghapus ketersediaan offline.
- TTS Jepang bergantung pada suara perangkat. Mikrofon pada shadowing memerlukan izin browser dan localhost/HTTPS. Tidak ada rekaman audio manusia baru pada v5.

## Transparansi

Versi ini mencakup semua **kelompok topik dan jenis halaman utama** pada sebelas referensi, tetapi **belum memenuhi kesetaraan seluruh isi/entri situs**. Tidak ada klaim bahwa ribuan artikel/entri editorial di luar dataset publik telah disalin atau selesai diadaptasi. Angka aktual tertera di atas dan `data/atlas-snapshot.json`. Menyamakan seluruh inventori sumber masih memerlukan dataset yang diizinkan dan penulisan/review materi tambahan.

Materi orisinal bukan pengganti penilaian guru. Penetapan level tambahan merupakan saran belajar. JLPT tidak menerbitkan daftar lengkap kosakata/kanji/grammar resmi; mock lokal bukan scaled score resmi.

## Lisensi dan sumber data

Lihat `sources.html`, `DATA-SOURCES.md`, notice masing-masing vendor, serta LICENSE/COPYING di `data/reference`, `data/openjlpt`, dan `data/strokes`. Snapshot kanji-data: `c54ae56648eb741f837854d46b74d336ea07c246`; Kotowaza: `c6435b3e13937fbfb6d464410f68dccf76384264`; KanjiVG: `422b5538595676da918c288a4230cb5e22a1ee7e`.

Template handwriting dan indeks komponen merupakan turunan KanjiVG, © Ulrich Apel dan kontributor, CC BY-SA 3.0. Berkas SVG asli beserta pemberitahuan hak cipta dipertahankan. Objek kosakata gabungan hanya menghapus duplikasi identik; tidak mengubah definisi sumber.
