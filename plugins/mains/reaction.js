import pkg from '@whiskeysockets/baileys'
const { 
    getContentType,
    downloadContentFromMessage
} = pkg

import { downloadMediaMessage, getFile, getType, downloadM } from '../../lib/src/func.js'
import store from '../../lib/src/store.js'

const getSender = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
        let { user, server } = jidDecode(jid) || {}
        return user && server ? `${user}@${server}` : jid
    } else {
        return jid
    }
}

export const before = {
    async start({ m, conn, plugins }) {
        try {
            const prefix = "."
            const type2 = getContentType(m?.message)
            m.type2 = type2

            if (m.type2 === "reactionMessage") {
                const reaction = m.message.reactionMessage
                if (!reaction || !reaction.key) {
                    return
                }

                let react = await store.loadMessage(m.id, reaction.key.id)
                let rtype = getContentType(react?.message)
                let mtype = getType(rtype)
                let rtext = rtype === "conversation" ? react.message[rtype]
                            : rtype === 'extendedTextMessage' ? react.message[rtype]?.text
                            : (rtype === 'imageMessage' || rtype === 'videoMessage') ? react.message[rtype]?.caption 
                            : (mtype === "interactiveResponseMessage") ? JSON.parse(react?.message?.[rtype]?.nativeFlowResponseMessage?.paramsJson)?.id : null

                m.reaction = {
                    key: reaction.key,
                    emoji: reaction.text,
                    mtype,
                    text: rtext,
                    url: rtext?.match(/https?:\/\/[^\s]+/g)?.flatMap(url => url.match(/https?:\/\/[^\s)]+/g) || []) ?? [],
                    mention: await getSender(react?.participant || react?.key?.participant || react?.key?.remoteJid),
                    download: async () => downloadM(react?.message?.[rtype], mtype),
                    delete: async () => conn.sendMessage(m.id, { delete: reaction.key }),
                }
                m.reaction[mtype] = react?.message?.[rtype]
            }

            let { emoji } = m.reaction || {}
            switch (emoji) {
                case "🗿":
                    return m.reply('apa?')
                case "🦶":
		        case "🦿":
                case "🦵":
                case "🦵🏻":
		        case "🦵🏼":
                case "🦵🏽":
                case "🦵🏾":
                case "🦵🏿": {
                    try {
                        const who = m.reaction.key.participant || m.reaction.mention
                        const participants = await conn.groupMetadata(m.from).then(meta => meta.participants)
                        const member = participants.find(u => u.id === who)
                        if (!member) {
                            return m.reply('User tidak ada di dalam grup')
                        }
                        await conn.groupParticipantsUpdate(m.from, [who], 'remove')
                    } catch (error) {
                        console.error("Error executing kick command:", error)
                    }
                    break
                }
                case "🧩":
                  const command = plugins.commands.find(cmd => cmd['menu.js'])
                    if (command) {
                     await command['menu.js'].start({ m, conn, prefix, plugins })
                    }
                default:
                    break
            }
        } catch (error) {
            console.error("Error in reaction.js:", error)
        }
    }
}