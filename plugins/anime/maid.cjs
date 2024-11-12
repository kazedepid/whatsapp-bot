const axios = require('axios')

exports.cmd = {
    name: ['maid'],
    command: ['maid'],
    category: ['anime'],
    detail: {
        desc: 'random gambar anime gadis maid.'
    },
    setting: {
        error_react: true
    },
    async start({ m }) {
        await m.react('🕓')
        let res = await axios.get('https://api.waifu.im/search/?included_tags=maid')
        await m.reply('Random maid image.', { image: res.data.images[0].url })
        await m.react('✅')
    }
}