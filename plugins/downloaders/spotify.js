import { SpotifyDL } from 'neastooapi';

export const cmd = {
    name: ['spotify'],
    command: ['spotify'],
    category: ['download'],
    detail: {
        desc: 'Download musik atau playlist dari Spotify',
        use: 'link Spotify'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) return m.reply(`Masukkan link Spotify.\nContoh: ${prefix + command} https://open.spotify.com/track/example`);
        try {
            const res = await SpotifyDL(text);
            if (res && res.downloadUrl) {
                m.reply(`Ini adalah link downloadnya\n${res.downloadUrl}\nFile musik akan dikirim sebentar lagi....`);
                conn.sendMessage(m.from, { document: { url: res.downloadUrl }, mimetype: "audio/mpeg", fileName: res.title + ".mp3" }, { quoted: m });
            } else {
                m.reply('Tidak ditemukan link unduhan.');
            }
        } catch (error) {
            console.log(error);
            m.reply('Gagal.');
        }
    }
};
