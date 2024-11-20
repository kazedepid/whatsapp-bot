import your from "your-api"

export const cmd = {
    name: ['tvone'],
    command: ['tvone'],
    category: ['searching'],
    detail: {
        desc: 'Mencari berita dari TV One',
        use: 'text'
    },
    async start({ m, text }) {
        const quoted = m.quoted && m.quoted.text ? m.quoted.text : ''
        const query = quoted ? `${quoted} ${text || ''}`.trim() : (text || '')
        let results = []
        if (!query) {
            try {
                results = await your.search.tvOneLatest()
            } catch (error) {
                console.log(error)
                return m.reply('Gagal mengambil berita terbaru.')
            }
        } else {
            try {
                results = await your.search.tvOneSearch(query)
            } catch (error) {
                console.log(error)
                return m.reply('Gagal mencari berita.')
            }
        }
        let output = results.map((item, index) => 
            `📄 *Title*: ${item.title}\n` +
            `🔗 *URL*: ${item.url}\n` +
            `🕒 *Waktu*: ${item.waktu}\n` +
            `📜 *Deskripsi*: ${item.description}\n` +
            `\n---\n`
        ).join('')
        const jumlahHasil = results.length
        const jumlahOutput = `*Jumlah berita ditemukan: ${jumlahHasil}*\n\n`
        if (output) {
            m.reply(jumlahOutput + output)
        } else {
            m.reply('Tidak ada hasil ditemukan.')
        }
    }
}
