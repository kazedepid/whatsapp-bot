const axios = require('axios')

exports.cmd = {
    name: ['milf'],
    command: ['milf'],
    category: ['anime'],
    detail: {
        desc: 'random foto anime milf 18+.'
    },
    setting: {
        error_react: true,
        isNsfw: true
    },
    async start({ m }) {
        await m.react('🕓')
        let res = await axios.get('https://api.waifu.im/search/?included_tags=milf')
        await m.reply('Random milf image.', { image: res.data.images[0].url })
        await m.react('✅')
    }
}