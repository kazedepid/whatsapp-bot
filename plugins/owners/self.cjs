exports.cmd = {
    name: ['self'],
    command: ['self'],
    category: ['owner'],
    detail: {
        desc: 'Mengubah mode bot agar ke moda self, yang berarti tidak semua bisa menggunakan bot.'
    },
    setting: {
        isOwner: true
    },
    async start({ m, conn, db }) {
        const config = db.settings.get(conn.user.jid);
        if (config.mode === 'self') {
            return m.reply('Bot sudah ke mode self');
        }
        config.mode = 'self';
        await db.save();
        await m.reply('Bot berhasil ke mode self');
    }
};
