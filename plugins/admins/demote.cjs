exports.cmd = {
    name: ['demote'],
    command: ['demote'],
    category: ['admin'],
    detail: {
        desc: 'Mengubah status admin ke member.',
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
            return m.reply('User bukan admin')
        }
        await conn.groupParticipantsUpdate(m.from, [who], 'demote')
        await m.reply(`@${who.split('@')[0]} sukses di demote`, { mentions: [who] })
    }
}
