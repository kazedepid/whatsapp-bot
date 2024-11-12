import axios from 'axios'

export const cmd = {
    name: ['ero'],
    command: ['ero'],
    category: ['anime'],
    detail: {
        desc: 'random foto anime ero 18+.'
    },
    setting: {
        error_react: true,
        isNsfw: true
    },
    async start({ m }) {
        await m.react('🕓')
        const res = await axios.get('https://api.waifu.im/search/?included_tags=ero')
        await m.reply('Random ero image.', { image: res.data.images[0].url })
        await m.react('✅')
    }
}