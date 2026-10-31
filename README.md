# Birthday Surprise — Pink Purple

Website ulang tahun statis, responsif untuk HP dan desktop. Bisa langsung di-deploy ke Vercel tanpa backend.

## Isi project
- `index.html` — struktur halaman
- `style.css` — tampilan pink-purple
- `script.js` — animasi, personalisasi, galeri, countdown, dan interaksi
- `vercel.json` — konfigurasi static deployment

## Jalankan di komputer
Buka `index.html` langsung di browser, atau jalankan server lokal:
```bash
npx serve .
```

## Deploy ke Vercel
1. Upload seluruh isi folder project ini ke repository GitHub.
2. Di Vercel pilih **Add New → Project**, lalu import repository.
3. Framework Preset pilih **Other**.
4. Build Command dan Output Directory boleh dikosongkan (atau Output Directory `.`).
5. Klik **Deploy**.

Tidak perlu environment variable dan tidak perlu backend.

## Personalisasi website
- Buka website, tekan tombol **Personalisasi** di kanan bawah.
- Isi nama penerima, nama pengirim, pesan, tanggal ulang tahun.
- Pilih foto utama dan maksimal 3 foto kenangan.
- Tekan **Terapkan perubahan**.

**Penting tentang foto dan penyimpanan:** fitur upload di halaman personalisasi menyimpan perubahan di `localStorage` browser/perangkat yang sedang dipakai. Jadi perubahan itu hanya terlihat di browser tersebut, bukan otomatis oleh semua pengunjung. Untuk membuat foto dan nama tampil untuk semua orang yang membuka link website, cara paling aman untuk website statis adalah menaruh foto di folder `assets`, lalu atur data default di `script.js` dan deploy ulang.

### Cara memasang foto agar tampil untuk semua pengunjung
1. Masukkan file foto ke folder `assets`, contoh `assets/foto-utama.jpg`, `assets/kenangan-1.jpg`, `assets/kenangan-2.jpg`, `assets/kenangan-3.jpg`.
2. Di `script.js`, cari bagian `const DEFAULTS` lalu ubah `recipient`, `sender`, `message`, dan `birthday`.
3. Cari bagian `loadSaved()` lalu setelah `renderGallery(state.galleryPhotos);` tambahkan:
```js
const publicHero = "assets/foto-utama.jpg";
state.heroPhoto = publicHero;
setPhoto("heroPhoto", publicHero);
renderGallery([
  "assets/kenangan-1.jpg",
  "assets/kenangan-2.jpg",
  "assets/kenangan-3.jpg"
]);
```
4. Agar foto default publik tidak tertimpa personalisasi lokal lama, buka website lalu tekan **Reset** pada panel personalisasi, atau hapus data situs di browser.
5. Commit dan deploy ulang.

### Musik
Taruh file audio yang kamu punya/berhak gunakan di `assets/birthday-music.mp3`. Tombol musik akan memutarnya setelah pengunjung menekan tombol. Browser biasanya memblokir autoplay sebelum ada interaksi.

## Catatan
- Website ini tidak mengunggah foto ke server dan tidak mengumpulkan data pengunjung.
- Untuk mengirim personalisasi unik ke banyak orang atau mengelola foto lewat dashboard online, perlu backend atau layanan penyimpanan.
