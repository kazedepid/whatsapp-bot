export const cmd = {
    name: ['public'],
    command: ['public'],
    category: ['owner'],
    detail: {
        desc: 'Mengubah mode bot ke public agar semua org dapat menggunakan bot.'
    },
    setting: {
        isOwner: true
    },
    async start({ m, conn, isGroup, db }) {
        const config = db.settings.get(conn.user.jid);
        
        if (config.mode === 'public') {
            return m.reply('Bot sudah ke mode public.');
        }

        config.mode = 'public';
        await db.save();
        await m.reply('Bot telah berhasil diaktifkan dalam mode public.');
    }
};
