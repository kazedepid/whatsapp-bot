import axios from 'axios'

export const cmd = {
    name: ['awoo'],
    command: ['awoo'],
    category: ['anime'],
    detail: {
        desc: 'random gambar anime gadis serigala.'
    },
    setting: {
        error_react: true
    },
    async start({ m }) {
        await m.react('🕓')
        const res = await axios.get('https://api.waifu.pics/sfw/awoo') 
        await m.reply('Random awoo image.', { image: res.data.url }) 
        await m.react('✅')
    }
}