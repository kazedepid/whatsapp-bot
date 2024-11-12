import axios from "axios"

export const cmd = {
    name: ['dependents'],
    command: ['dependents', 'depen'],
    category: ['tools'],
    detail: {
        desc: 'Melihat repo yang menggunakan library tertentu/dependents',
        use: 'url github'
    },
    async start({ m, text }) {
        try {
            if (!text) return m.reply('Input url github nya, example : https://github.com/whiskeysockets/baileys')
            const response = await axios.get('https://api-rho-murex-32.vercel.app/dependents?q=' + text)
            const results = response.data.result.data

            if (results && results.length > 0) {
                let output = 'Hasil:\n'
                results.forEach((url, index) => {
                    output += `${index + 1}. ${url}\n`
                })
                m.reply(output)
            } else {
                m.reply('Tidak ada hasil ditemukan.')
            }
        } catch (error) {
            console.error(error)
            m.reply('Gagal.')
        }
    }
}