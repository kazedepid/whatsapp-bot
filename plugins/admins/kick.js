export const cmd = {
    name: ['kick'],
    command: ['kick'],
    category: ['admin'],
    detail: {
        desc: 'kick user dari grup',
        use: 'tags/reply'
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
            return m.reply('User tidak ada di dalam group')
        }
        conn.groupParticipantsUpdate(m.from, [who], 'remove')
        await m.reply(`sukses`)
    }
}