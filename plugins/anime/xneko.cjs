const axios = require('axios')

exports.cmd = {
    name: ['xneko'],
    command: ['xneko'],
    category: ['anime'],
    detail: {
        desc: 'random foto anime neko 18+.'
    },
    setting: {
        error_react: true,
        isNsfw: true
    },
    async start({ m }) {
        await m.react('🕓')
        let res = await axios.get('https://api.waifu.pics/nsfw/neko')
        await m.reply('Random neko image.', { image: res.data.url })
        await m.react('✅')
    }
}