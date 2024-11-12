const util = require('util')

exports.cmd = {
    name: ['<'],
    command: ['<'],
    category: ['owner'],
    detail: {
        desc: 'Menjalankan evaluasi tapi support require.',
        use: 'code'
    },
    setting: {
        isOwner: true
    },
    async start(context) {
        const { m, conn, text, args, prefix, command, status, isGroup, isPrivate, isOwner, isRegistered, isSuperAdmin, isAdmin, isBotAdmin, groupMetadata, groupName, participants, db, plugins } = context
        if (!text) return

        let evalCmd
        try {
            evalCmd = /await/i.test(text)
                ? eval("(async () => { " + text + " })()")
                : eval(text)
        } catch (e) {
            m.reply(util.format(e)) 
            return
        }

        (async () => {
            try {
                const result = await evalCmd
                m.reply(util.format(result))
            } catch (err) {
                m.reply(util.format(err))
            }
        })()
    }
}