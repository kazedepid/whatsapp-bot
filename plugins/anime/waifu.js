import axios from 'axios'

export const cmd = {
    name: ['waifu'],
    command: ['waifu'],
    category: ['anime'],
    detail: {
        desc: 'random gambar anime gadis.'
    },
    setting: {
        error_react: true
    },
    async start({ m }) {
        await m.react('🕓')
        let res = await axios.get('https://api.waifu.pics/sfw/waifu')
        await m.reply('Random waifu image.', { image: res.data.url })
        await m.react('✅')
    }
}