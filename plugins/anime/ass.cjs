const axios = require('axios')

exports.cmd = {
    name: ['ass'],
    command: ['ass'],
    category: ['anime'],
    detail: {
        desc: 'random foto anime ass 18+.'
    },
    setting: {
        error_react: true,
        isNsfw: true
    },
    async start({ m }) {
        await m.react('🕓')
        let res = await axios.get('https://api.waifu.im/search/?included_tags=ass')
        await m.reply('Random ass image.', { image: res.data.images[0].url })
        await m.react('✅')
    }
}