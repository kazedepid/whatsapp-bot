const axios = require('axios')

exports.cmd = {
    name: ['ecchi'],
    command: ['ecchi'],
    category: ['anime'],
    detail: {
        desc: 'random foto anime ecchi 18+.'
    },
    setting: {
        error_react: true,
        isNsfw: true
    },
    async start({ m }) {
        await m.react('🕓')
        let res = await axios.get('https://api.waifu.im/search/?included_tags=ecchi')
        await m.reply('Random ecchi image.', { image: res.data.images[0].url })
        await m.react('✅')
    }
}