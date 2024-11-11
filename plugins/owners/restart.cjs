exports.cmd = {
    name: ['restart'],
    command: ['restart', 'reset'],
    category: ['owner'],
    detail: {
        desc: 'Restart bot.'
    },
    setting: {
        isOwner: true
    },
    async start({ m }) {
        await m.reply('Restart....')
        setTimeout(async () => {
            process.send('restart')
        }, 5000)
    }
}
