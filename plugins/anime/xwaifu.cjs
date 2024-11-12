const axios = require('axios')

exports.cmd = {
    name: ['xwaifu'],
    command: ['xwaifu'],
    category: ['anime'],
    detail: {
        desc: 'random foto anime waifu 18+.'
    },
    setting: {
        error_react: true,
        isNsfw: true
    },
    async start({ m }) {
        await m.react('🕓')
        let res = await axios.get('https://api.waifu.pics/nsfw/waifu')
        await m.reply('Random waifu image.', { image: res.data.url })
        await m.react('✅')
    }
}