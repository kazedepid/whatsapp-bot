import your from "your-api"

export const cmd = {
    name: ['blackbox'],
    command: ['blackbox'],
    category: ['ai'],
    detail: {
        desc: 'Ai blackbox',
        use: 'text'
    },
    async start({ m, text }) {
        const quoted = m.quoted && m.quoted.text ? m.quoted.text : ''
        const teks = quoted ? `${quoted} ${text || ''}`.trim() : (text || '')
        if (!teks) return m.reply(`Mau nanya apa?`)
        try {
            const res = await your.ai.blackbox(teks)
            m.reply(res)
        } catch (error) {
            console.log(error)
            m.reply('Gagal.')
        }
    }
}
