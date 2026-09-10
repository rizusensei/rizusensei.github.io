# Rizu Sensei Standalone v2

Versi v2 mengubah prototype menjadi mini learning platform statis yang fungsional.

## Halaman
- index.html — homepage + progress dashboard
- learn.html — 15 lesson inti N5–N3 + quick check + progress per lesson + prev/next
- flashcards.html — 45 flashcard
- quiz.html — quiz per level, acak, best score localStorage
- shadowing.html — Japanese browser TTS, slow mode, microphone recording + playback
- products.html — 6 item Ariefanoisme/Lynk.id dengan promosi dan direct links

## Data
Semua materi ada di `data.js`. Tambahkan lesson/kartu/soal/shadowing dari file tersebut tanpa mengubah engine.

## Penyimpanan
Progress tersimpan di localStorage key `rizu_sensei_v2`. Tidak ada akun/database.

## Hosting
Upload seluruh folder ke Cloudflare Pages, Netlify, atau GitHub Pages. Tidak ada build command.

## Catatan TTS / Microphone
Japanese TTS bergantung pada voice yang tersedia di browser/OS pengguna.
Perekaman microphone membutuhkan HTTPS atau localhost dan izin pengguna. Cloudflare Pages/Netlify menyediakan HTTPS.

## Produk Ariefanoisme
Enam item dipromosikan dari `products` di data.js. Tombol pembelian/download membuka halaman resmi Lynk.id di tab baru.
