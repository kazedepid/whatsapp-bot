import axios from 'axios'

export const cmd = {
    name: ['loli'],
    command: ['loli'],
    category: ['anime'],
    detail: {
        desc: 'random gambar anime gadis kecil.'
    },
    setting: {
        error_react: true
    },
    async start({ m }) {
        await m.react('🕓')
        const res = await axios.get('https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon') 
        await m.reply('Random loli image.', { image: res.data.data[0].urls.original }) 
        await m.react('✅')
    }
}