import axios from 'axios'

export const cmd = {
    name: ['megumin'],
    command: ['megumin'],
    category: ['anime'],
    detail: {
        desc: 'Random gambar anime megumin'
    },
    setting: {
        error_react: true
    },
    async start({ m }) {
        await m.react('🕓')
        let res = await axios.get('https://api.waifu.pics/sfw/megumin')
        await m.reply('Random Megumin image.', { image: res.data.url })
        await m.react('✅')
    }
}