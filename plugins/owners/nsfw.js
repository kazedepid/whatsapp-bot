export const cmd = {
    name: ['nsfw'],
    command: ['nsfw'],
    category: ['owner'],
    detail: {
        desc: 'Aktifkan atau nonaktifkan NSFW di grup.',
        use: 'on/off'
    },
    setting: {
        isGroup: true,
        isOwner: true
    },
    async start({ m, args, db, prefix, command }) {
        const group = db.groups.get(m.from).setting
        const mode = args[0]?.toLowerCase()

        if (mode === 'on' || mode === 'off') {
            const enable = mode === 'on'
            if (group.nsfw === enable) {
                return m.reply(`Fitur sudah ${enable ? 'diaktifkan' : 'dinonaktifkan'} di grup ini.`)
            }
            group.nsfw = enable
            await db.save()
            return m.reply(`Fitur Nsfw berhasil ${enable ? 'diaktifkan' : 'dinonaktifkan'} untuk grup ini.`)
        }

        await m.reply(`Untuk mengatur Fitur NSFW, cukup ketik "on" untuk mengaktifkannya atau "off" untuk menonaktifkannya.\n\nExample: ${ prefix + command } on/off`)
    }
}