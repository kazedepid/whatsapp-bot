import your from "your-api"

const isUrl = (string) => {
    const regex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/
    return regex.test(string)
}

export const cmd = {
    name: ['shorturl'],
    command: ['shorturl'],
    category: ['tools'],
    detail: {
        desc: 'Shorten URL',
        use: 'text'
    },
    async start({ m, text }) {
        const quoted = m.quoted && m.quoted.text ? m.quoted.text : ''
        const url = quoted ? `${quoted} ${text || ''}`.trim() : (text || '')
        if (!url) return m.reply(`Input url.`)
        if (!isUrl(url)) return m.reply(`URL tidak valid. Mohon masukkan URL yang valid dengan skema HTTPS.`)
        try {
            const res = await your.tools.shortenUrl(url)
            m.reply(res)
        } catch (error) {
            console.log(error)
            m.reply('Gagal memendekkan URL.')
        }
    }
}