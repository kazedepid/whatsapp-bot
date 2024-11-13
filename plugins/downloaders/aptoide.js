import axios from "axios"

export const cmd = {
    name: ['aptoide'],
    command: ['aptoide'],
    category: ['download'],
    detail: {
        desc: 'Mendownload apk lewat aptoide',
        use: 'query'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) return m.reply(`Masukkan nama aplikasi nya.\nExample: ${ prefix + command } WhatsApp`)
        try {
            const res = await axios.get(`https://api-rho-murex-32.vercel.app/aptoide?q=${text}&opsi=searchAndDownload`);
            if (res.data.result) {
                m.reply(`Ini adalah link downloadnya\n${res.data.result}\nVia file akan dikirim sebentar lagi....`)
                conn.sendMessage(m.from, { document: { url: res.data.result }, mimetype: "application/vnd.android.package-archive", fileName: text + ".apk" }, { quoted: m })
            } else {
                m.reply('Tidak ditemukan link unduhan.');
            }
        } catch (error) {
            console.log(error);
            m.reply('Gagal.');
        }
    }
}