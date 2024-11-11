exports.cmd = {
    name: ['promote'],
    command: ['promote'],
    category: ['admin'],
    detail: {
        desc: 'Mengubah status member ke admin.',
        use: 'tag'
    },
    setting: {
        isGroup: true,
        isAdmin: true,
        isBotAdmin: true
    },
    async start({ m, participants, conn }) {
        let who = m.quoted ? m.quoted.sender : m.mentions[0]
        if (!who) {
            return m.reply('Tag/reply target')
        }
        let member = participants.find(u => u.id === who)
        if (!member) {
            return m.reply('Bukan member group')
        }
        await conn.groupParticipantsUpdate(m.from, [who], 'promote')
        await m.reply(`@${who.split('@')[0]} sukses di promote`, { mentions: [who] })
    }
}
