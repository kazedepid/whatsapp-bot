/*


struktur command seperti di bawah ini
cmd {
  name: [``], (wajib ada)
  command: [''], (wajib ada)
  category: [''], (wajib ada)
  detail: { (Optional)
     desc: "",
     use: "",
  },
  setting: { (optional)
     isRegister: false,
     isNsfw: false,
     isGroup: false,
     isPrivate: false,
     isOwner: false,
     isSuperAdmin: false,
     isAdmin: false,
     isBotAdmin: false,
     usePrefix: false
  },
  start { (wajib ada) untuk eksekusi code
  }
}



// Contoh Plugins
export const cmd = {
    name: [''], // ['name1', 'name2', 'dst'](Semacam alias yang di munculkan dalam list menu)
    command: [''], // ['command1', 'command2', 'dst'](daftar perintah untuk mengakses plugin ini)
    category: [''], // ['main', 'owner', 'dst'](Kategori untuk menempatkan letak fitur ini di list menu)
    detail: {
        desc: '', // Untuk mendeskripsikan fitur nya seperti apa
        use: ''// memberitahu kan cara menggunakan nya(akan muncul di menu)
    },
    setting: { // Setting untuk plugin nya ingin seperti apa
        isOwner: false, // true agar fitur hanya di akses oleh owner/false untuk mematikan/hilangkan sata opsi setting nya
        isRegister: false, // true agar fitur hanya di akses oleh pengguna yang sudah daftar /false untuk mematikan/hilangkan saja opsi setting nya
        isNsfw: false, // true agar fitur hanya di akses saat admin group sudah setting nsfw /false untuk mematikan/hilangkan saja opsi setting nya
        isGroup: false, // true agar fitur hanya di akses di dalam group /false untuk mematikan/hilangkan saja opsi setting nya
        isPrivate: false, // true agar fitur hanya di akses di private chat /false untuk mematikan/hilangkan saja opsi setting nya
        isSuperAdmin: false, // true agar fitur hanya di akses oleh owner group /false untuk mematikan/hilangkan saja opsi setting nya
        isAdmin: false, // true agar fitur hanya di akses oleh admin group /false untuk mematikan/hilangkan saja opsi setting nya
        isBotAdmin: false, // true agar fitur hanya di akses jika bot menjadi admin group /false untuk mematikan/hilangkan saja opsi setting nya
      //  usePrefix: false/true(Bugs)
    },
    async start(context) {
        const { m, conn, text, args, prefix, command, status, isGroup, isPrivate, isOwner, isRegistered, isSuperAdmin, isAdmin, isBotAdmin, groupMetadata, groupName, participants, db, plugins } = context
// execute code
    }
}


### Penjelasan Plugin

Plugin ini dirancang untuk menyediakan struktur yang jelas dan terorganisir untuk perintah yang dapat diakses dalam aplikasi. Setiap plugin memiliki beberapa properti yang mendefinisikan cara kerja dan aksesibilitasnya. Berikut adalah penjelasan dari setiap bagian:

- **name**: Array yang berisi nama alias untuk plugin. Nama ini akan muncul dalam daftar menu.
- **command**: Array yang berisi perintah yang digunakan untuk mengakses plugin ini.
- **category**: Array yang menentukan kategori plugin, seperti 'main', 'owner', dan lain-lain, untuk mengorganisir fitur dalam menu.
- **detail**: Objek opsional yang memberikan deskripsi dan cara penggunaan plugin.
  - **desc**: Deskripsi mengenai fungsi dan fitur dari plugin.
  - **use**: Instruksi tentang cara menggunakan plugin, yang akan ditampilkan di menu.
- **setting**: Objek opsional yang mengatur aksesibilitas plugin.
  - **isOwner**: Mengatur apakah hanya pemilik yang dapat mengakses plugin.
  - **isRegister**: Mengatur apakah hanya pengguna terdaftar yang dapat mengakses plugin.
  - **isNsfw**: Mengatur apakah plugin hanya dapat diakses dalam konteks NSFW.
  - **isGroup**: Mengatur apakah plugin hanya dapat diakses dalam grup.
  - **isPrivate**: Mengatur apakah plugin hanya dapat diakses dalam obrolan pribadi.
  - **isSuperAdmin**: Mengatur apakah hanya super admin yang dapat mengakses plugin.
  - **isAdmin**: Mengatur apakah hanya admin grup yang dapat mengakses plugin.
  - **isBotAdmin**: Mengatur apakah plugin hanya dapat diakses jika bot menjadi admin grup.
- **start**: Fungsi yang wajib ada untuk menjalankan kode ketika perintah dijalankan.

### Penjelasan Konteks

Dalam fungsi `start`, terdapat beberapa parameter yang disediakan dalam konteks (`context`) yang diperlukan untuk menjalankan perintah:

- **m**: Objek pesan yang berisi informasi tentang pesan yang diterima.
- **conn**: Objek koneksi yang digunakan untuk berkomunikasi dengan server atau API.
- **text**: Teks dari pesan yang diterima, biasanya berisi perintah yang dikirim oleh pengguna.
- **args**: Array yang berisi argumen tambahan yang diberikan setelah perintah utama.
- **prefix**: Karakter yang digunakan sebagai awalan untuk perintah (misalnya, `!` atau `.`).
- **command**: Nama perintah yang diaktifkan oleh pengguna.
- **status**: Status saat ini dari bot atau plugin, dapat berupa aktif, non-aktif, dsb.
- **isGroup**: Boolean yang menunjukkan apakah perintah dijalankan dalam konteks grup.
- **isPrivate**: Boolean yang menunjukkan apakah perintah dijalankan dalam obrolan pribadi.
- **isOwner**: Boolean yang menunjukkan apakah pengguna adalah pemilik bot.
- **isRegistered**: Boolean yang menunjukkan apakah pengguna terdaftar dalam sistem.
- **isSuperAdmin**: Boolean yang menunjukkan apakah pengguna adalah super admin grup.
- **isAdmin**: Boolean yang menunjukkan apakah pengguna adalah admin grup.
- **isBotAdmin**: Boolean yang menunjukkan apakah bot adalah admin di grup.
- **groupMetadata**: Metadata tentang grup, berisi informasi tentang anggota dan pengaturan grup.
- **groupName**: Nama grup tempat perintah dijalankan.
- **participants**: Daftar peserta atau anggota grup yang ada.
- **db**: Objek basis data yang digunakan untuk menyimpan atau mengambil data terkait pengguna atau grup.
- **plugins**: Daftar plugin yang tersedia dan dapat diakses dalam konteks saat ini.

Dengan penjelasan ini, diharapkan dapat memberikan gambaran yang lebih jelas tentang bagaimana plugin ini bekerja dan bagaimana berbagai parameter dalam konteks dapat digunakan.

Terimakasih
*/