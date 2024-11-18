import your from "your-api"

export const cmd = {
    name: ['ttp'],
    command: ['ttp'],
    category: ['tools'],
    detail: {
        desc: 'Membuat text menjadi foto',
        use: 'text'
    },
    async start({ m, text }) {
        const quoted = m.quoted && m.quoted.text ? m.quoted.text : ''
        const teks = quoted ? `${quoted} ${text || ''}`.trim() : (text || '')
        if (!teks) return m.reply(`Text nya?`)
        try {
            const res = await your.tools.ttp(teks)
            await m.reply('`Teksnya` : ' + teks, { image: res[0] }) 
        } catch (error) {
            console.log(error)
            m.reply('Gagal.')
        }
    }
}