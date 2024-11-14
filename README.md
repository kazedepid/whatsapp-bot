# WhatsApp Bot(STABLE WA BOT)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![GitHub contributors](https://img.shields.io/github/contributors/kazedepid/whatsapp-bot)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/kazedepid/whatsapp-bot)

Selamat datang di repositori **WhatsApp Bot** milik saya [(kazedepid)](https://github.com/kazedepid). Proyek ini adalah bot WhatsApp yang dirancang untuk memberikan berbagai fungsi otomatis dan interaksi yang menyenangkan di platform WhatsApp. Bot ini menggunakan pustaka **[Baileys](https://github.com/WhiskeySockets/Baileys)** untuk menghubungkan dan berinteraksi dengan API WhatsApp.

Apa saja yang ada? **[ChangeLog](https://github.com/kazedepid/whatsapp-bot/blob/main/CHANGELOG.md)**

Contoh plugin? **[Example](https://raw.githubusercontent.com/kazedepid/whatsapp-bot/refs/heads/main/plugins/example.js)**

## Project Structure

Berikut adalah penjelasan singkat untuk setiap file dalam proyek ini:

- **index.js**: Entry point aplikasi, menginisialisasi bot dan memuat plugin.
- **handler.js**: Mengelola perintah yang diterima dan mengeksekusinya berdasarkan pengaturan dan konteks.
- **connection.js**: Mengatur koneksi ke WhatsApp, termasuk autentikasi dan event listener.
- **database.js**: Mengelola penyimpanan data pengguna, grup, dan pengaturan.
- **plugins.js**: Memuat dan mengelola plugin yang dapat ditambahkan ke bot.
- **serialize.js**: Menyusun pesan yang diterima dari WhatsApp agar dapat diproses dengan benar.
- **setting.js**: Menyimpan pengaturan global seperti nomor owner dan prefix perintah.
- **lib/src/**: Berisi fungsi utilitas dan fungsi untuk membersihkan direktori sementara.
- **package.json**: Konfigurasi npm, termasuk dependensi dan skrip yang digunakan.

## Owner Number Settings

Di file **setting.js**, Anda dapat mengatur nomor pemilik bot dengan menambahkan nomor telepon beserta namanya dalam format berikut:

```javascript
const owner = [
    ['628xxxx', 'Kaze'], // Nomor dan nama
    ['628xxxx'] // Hanya nomor
]
```

## Getting Started

### Prerequisite

Pastikan Anda memiliki Node.js dan npm terinstal di sistem Anda.

### Installation Steps

1. **Clone repositori**:
   ```bash
   git clone https://github.com/kazedepid/whatsapp-bot.git
   cd whatsapp-bot
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan aplikasi**:
   - Untuk menjalankan bot dengan kode pairing:
     ```bash
     npm start
     ```

### Deploy

- **Termux/Linux/Windows**: Pastikan Node.js telah terinstal, lalu ikuti langkah instalasi di atas.
- **Panel Pterodactyl**: Upload semua file ke panel Anda, kemudian jalankan perintah instalasi dan start melalui terminal panel. Pastikan panelnya menggunakan egg Nodejs atau Bun.

## Explanation of Variables in handler.js

- `m`: Objek pesan yang diterima.
- `conn`: Koneksi ke WhatsApp.
- `prefix`: Prefix yang digunakan untuk perintah.
- `isGroup`: Menandakan apakah pesan datang dari grup.
- `isPrivate`: Menandakan apakah pesan datang dari chat pribadi.
- `isOwner`: Menandakan apakah pengirim pesan adalah pemilik bot.
- `isRegistered`: Menandakan apakah pengguna terdaftar dalam database.
- `groupMetadata`: Metadata grup ketika pesan berasal dari grup.
- `participants`: Daftar peserta dalam grup.

## Known Bugs

1. **Bug `usePrefix`**: Pengaturan `usePrefix` belum berfungsi sepenuhnya.
2. **Bug Kode QR**: Terkadang saat menjalankan `node index.js`, QR code tidak ditampilkan dengan benar di terminal. Hal ini mungkin terjadi karena masalah dengan terminal yang digunakan atau pengaturan koneksi. Pastikan terminal mendukung tampilan QR code, atau gunakan metode pairing alternatif.
3. **Bug windows**: Terkadang saat di windows, akan ada error message yang akan menghentikan pairing ke whatsapp lalu beberapa saat kemudian akan ter restart otomatis
4. **Bug React Sw**: Terkadang status hanya di liat saja tanpa memberi reaction 

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE). Silakan lihat file LICENSE untuk informasi lebih lanjut.

## Thanks To

Terima kasih kepada semua dependents dan kontributor yang telah berkontribusi pada proyek ini. Dukungan dan masukan Anda sangat berarti bagi pengembangan bot ini.
