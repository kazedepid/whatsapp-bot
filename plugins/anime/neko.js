import axios from 'axios'

export const cmd = {
    name: ['neko'],
    command: ['neko'],
    category: ['anime'],
    detail: {
        desc: 'random gambar anime gadis kucing.'
    },
    setting: {
        error_react: true
    },
    async start({ m }) {
        await m.react('🕓')
        let res = await axios.get('https://api.waifu.pics/sfw/neko')
        await m.reply('Random neko image.', { image: res.data.url })
        await m.react('✅')
    }
}