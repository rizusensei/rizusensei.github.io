# Rizu Sensei v4 — Sumber, lisensi, dan batas cakupan

## Materi orisinal
150 lesson N5–N3 serta materi, ID, dan enam produk dari paket v3 dipertahankan. v4 menambah 100 lesson (50 N2, 50 N1), 40 penjelasan grammar dengan contoh dan latihan baru, 20 bacaan dengan 60 pertanyaan, dan 40 naskah listening dengan pertanyaan. Level grammar adalah pengelompokan pedagogis, bukan silabus resmi atau jaminan cakupan seluruh JLPT.

## Referensi struktur/topik, diperiksa 11 September 2026
- https://jepang.org/ — organisasi materi menurut level dan keterampilan.
- https://jepang.org/jlpt/n2 — referensi arah materi N2.
- https://jepang.org/jlpt/n1/ — referensi arah materi N1.
- https://jepang.org/jlpt/n2/tata-bahasa — referensi kategori tata bahasa.
- https://jepang.org/jlpt/n1/tata-bahasa/ — referensi kategori tata bahasa.

Halaman tersebut dipakai untuk orientasi struktur/topik. Tidak ada artikel, tabel kosakata, contoh kalimat, atau soal mereka yang diimpor. Penjelasan Indonesia, contoh, bacaan, dan dialog tambahan ditulis untuk Rizu Sensei. Contoh pengumuman dan kebijakan adalah skenario latihan fiktif, bukan pengumuman aktual. Tidak ada afiliasi yang dinyatakan dengan Jepang.org.

## Database OpenJLPT
Repositori: https://github.com/evanclan/OpenJLPT
Snapshot: c42fd9fa3777bfc1775446f7c418d549dfd6e4cf
Diambil: 2026-09-11
Lisensi: https://creativecommons.org/licenses/by-sa/4.0/

| Level | Vocabulary | Kanji | Grammar sumber |
|---|---:|---:|---:|
| N5 | 662 | 79 | 20 |
| N4 | 632 | 166 | 20 |
| N3 | 1784 | 367 | 20 |
| N2 | 1793 | 367 | 20 |
| N1 | 3463 | 1232 | 20 |

Total: 8.334 entri vocabulary dan 2.211 entri kanji; jumlah adalah penjumlahan record per level, tidak diklaim jumlah karakter unik. Data sumber tidak diubah secara semantik; JSON diminimalkan dan sebagian data disertakan kembali di fallback aplikasi. Definisi sumber umumnya berbahasa Inggris. Materi penjelasan baru menggunakan Indonesia. Dataset lengkap di data/openjlpt/ tetap CC BY-SA 4.0; NOTICE.md dan LICENSE sumber disertakan di sana, termasuk untuk data yang disalin ke fallback.

Atribusi upstream: JMdict/EDICT dan KANJIDIC2 oleh EDRDG (https://www.edrdg.org/; https://www.edrdg.org/wiki/KANJIDIC_Project.html), pembagian level oleh Jonathan Waller (https://www.tanos.co.uk/jlpt/), dan contoh kalimat oleh Tatoeba (https://tatoeba.org). Ikuti rincian lisensi setiap sumber dalam data/openjlpt/NOTICE.md. Pembagian vocabulary/kanji adalah daftar komunitas, bukan daftar resmi JLPT.

## Waktu dan nilai ujian
Sumber resmi: https://www.jlpt.jp/e/guideline/testsections.html dan https://www.jlpt.jp/e/guideline/results.html (diperiksa 11 September 2026).

N5: 20/40/30 menit. N4: 25/55/35. N3: 30/70/40. N2: pengetahuan bahasa + reading 105, listening 50. N1: pengetahuan bahasa + reading 110, listening 55. Waktu listening resmi dapat sedikit berbeda sesuai panjang rekaman.

Ambang total resmi N5/N4/N3/N2/N1: 80/90/95/90/100 dari 180. N1–N3 memiliki tiga bagian penilaian, masing-masing minimal 19/60. N4–N5 minimal 38/120 pada pengetahuan bahasa + reading dan 19/60 listening.

Quick Mock: 15 soal/15 menit. Full Timer Mode: 53 soal latihan dengan waktu sesi resmi. Komposisi tidak identik dengan ujian JLPT. Persentase benar dan pemetaan persentase × 1,8 bukan scaled score atau prediksi lulus. TTS menggunakan suara OS/browser; bukan audio penutur asli dan tidak selalu tersedia offline.


## Atlas v5 additions

See sources.html and CAKUPAN-v5.md for full mapping. kanji-data snapshot c54ae56648eb741f837854d46b74d336ea07c246 (MIT package; retain upstream EDRDG KANJIDIC/EDICT conditions), Kotowaza c6435b3e13937fbfb6d464410f68dccf76384264 (MIT), KanjiVG 422b5538595676da918c288a4230cb5e22a1ee7e (CC BY-SA 3.0), Kuromoji.js 0.1.2 (Apache 2.0 + bundled IPADIC notice), WanaKana 5.3.1 (MIT).

KanjiVG copyright Ulrich Apel and contributors, https://kanjivg.tagaini.net/. SVG source notices preserved. data/handwriting.json and data/stroke-index.json are adaptations licensed CC BY-SA 3.0; handwriting samples normalized to 12 points per stroke, component index extracted from SVG groups. General lexicon merge removes identical duplicate objects without rewriting definitions.

35 tutorial and 22 keigo guides, 56 onomatopoeia explanations/examples, and 60 selected loanword explanations authored for Rizu Sensei. Public Kotowaza text reused under its MIT license; not represented as original editorial writing.
