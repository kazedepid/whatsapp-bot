import { plugins } from './lib/plugins.js'
import { owner, defaultPrefix } from './setting.js'
import { decodeJid } from './lib/src/func.js'
import { printLog } from './lib/src/print.js'
import db from './lib/database.js'

const handler = async (m, conn) => {
    try {
        const setting = db.settings.get(conn.user.jid)
        const prefixList = (setting && setting.prefix.length) ? setting.prefix : defaultPrefix

        let prefix = false
        for (const p of prefixList) {
            const trimmedPrefix = p.trim()
            if (trimmedPrefix === '' || m.text.startsWith(trimmedPrefix)) {
                prefix = trimmedPrefix
                break
            }
        }

        const isUsingPrefix = prefix !== false

        if (!isUsingPrefix && !setting.usePrefix) {
        } else if (!prefix) {
            return 
        }

        const trimText = m.text.slice(prefix.length).trim()
        const [rawCommand, ...args] = trimText.split(/\s+/)
        const command = rawCommand ? rawCommand.toLowerCase() : rawCommand
        const text = command ? trimText.slice(rawCommand.length).trim() : trimText

        const isGroup = m.from.endsWith('@g.us')
        const isPrivate = m.from.endsWith('@s.whatsapp.net')
        const isBroadcast = m.from === 'status@broadcast'
        const isOwner = [conn.user.jid, ...owner.map(([number]) => number.replace(/[^0-9]/g, '') + '@s.whatsapp.net')].includes(m.sender)
        const isRegistered = db.users.exist(m.sender)
        const isNsfw = isGroup ? db.groups.get(m.from).setting?.nsfw : true
        const isBaileys = m.id.startsWith('3EB0')

        const groupMetadata = isGroup ? await conn.groupMetadata(m.from) : {}
        const groupName = groupMetadata.subject || ''
        const participants = groupMetadata.participants || []

        const user = isGroup ? participants.find(u => decodeJid(u.id) === m.sender) : {}
        const bot = isGroup ? participants.find(b => decodeJid(b.id) === conn.user.jid) : {}
        const isSuperAdmin = user?.admin === 'superadmin' || false
        const isAdmin = isSuperAdmin || user?.admin === 'admin' || false
        const isBotAdmin = bot?.admin === 'admin' || false

        let isCommand = false

        if (!db.groups.exist(m.from) && isGroup) {
            await db.groups.add(m.from)
            await db.save()
        }

        if (db.groups.exist(m.from) && isRegistered) {
            const group = db.groups.get(m.from)
            await group.users.add(m.sender)
            await db.save()
        }

        if (setting.mode === 'public' || (setting.mode === 'self' && isOwner)) {
            if (Array.isArray(plugins.befores)) {
                for (const before of plugins.befores) {
                    const name = Object.keys(before)[0]
                    try {
                        await before[name].start({
                            m, conn, text, args, status,
                            isGroup, isPrivate, isBroadcast, isOwner, isRegistered, isSuperAdmin, isAdmin, isBotAdmin, isBaileys,
                            groupMetadata, groupName, participants, db, plugins
                        })
                    } catch (e) {
                        console.error(e)
                        if (e.name) {
                            if (before[name].setting?.error_react) await m.react('❌')
                            await m.reply(`*${e.name}* : ${e.message}`)
                        }
                    }
                }
            }

            if (!isBaileys && !isBroadcast) {
                const stickerCommand = (m.type === 'stickerMessage'
                    ? db.stickers.get(Buffer.from(m.message[m.type].fileSha256).toString('base64'))?.command
                    : ''
                )

                const commands = plugins.commands
                    .map(plugin => Object.values(plugin)[0])
                    .filter(commandObj => commandObj.command.some(cmd =>
                        cmd.toLowerCase() === stickerCommand || cmd.toLowerCase() === command
                    ))

                if (commands.length > 0) {
                    isCommand = true

                    for (const cmd of commands) {
                        const setting = {
                            isRegister: false,
                            isNsfw: false,
                            isGroup: false,
                            isPrivate: false,
                            isOwner: false,
                            isSuperAdmin: false,
                            isAdmin: false,
                            isBotAdmin: false,
                            usePrefix: cmd.setting?.usePrefix !== undefined ? cmd.setting.usePrefix : true, 
                            ...cmd.setting
                        }

                        if (setting.isRegister && !isRegistered) {
                            await status({ type: 'isRegister', m, prefix })
                            continue
                        }
                        if (setting.isNsfw && !isNsfw) {
                            await status({ type: 'isNsfw', m })
                            continue
                        }
                        if (setting.isGroup && !isGroup) {
                            await status({ type: 'isGroup', m })
                            continue
                        }
                        if (setting.isPrivate && !isPrivate) {
                            await status({ type: 'isPrivate', m })
                            continue
                        }
                        if (setting.isOwner && !isOwner) {
                            await status({ type: 'isOwner', m })
                            continue
                        }
                        if (setting.isAdmin && !isAdmin) {
                            await status({ type: 'isAdmin', m })
                            continue
                        }
                        if (setting.isBotAdmin && !isBotAdmin) {
                            await status({ type: 'isBotAdmin', m })
                            continue
                        }

                        try {
                            await cmd.start({
                                m, conn, text, args, prefix, command, status,
                                isGroup, isPrivate, isOwner, isRegistered, isSuperAdmin, isAdmin, isBotAdmin,
                                groupMetadata, groupName, participants, db, plugins
                            })
                        } catch (e) {
                            console.error(e)
                            if (e.name) {
                                if (cmd.setting?.error_react) await m.react('❌')
                                await m.reply(`*${e.name}* : ${e.message}`)
                            }
                        }
                    }
                }
            }
        }

        await printLog({ m, conn, args, command, groupName, isGroup, isCommand })
    } catch (e) {
        console.error(e)
    }
}

const status = ({ type, m, prefix = '' }) => {
    const texts = {
        isRegister: `Untuk menggunakan Perintah ini, Anda harus terdaftar di database.\n\n*Contohnya* \n\n1. ${prefix}reg <nama pengguna>\n2. ${prefix}reg asep`,
        isNsfw: 'Konten NSFW tidak tersedia untuk grup ini.',
        isOwner: 'Perintah ini hanya Owner Bot.',
        isGroup: 'Perintah ini hanya berlaku di dalam group.',
        isPrivate: 'Perintah ini hanya berlaku di private chat.',
        isAdmin: 'Perintah ini hanya berlaku untuk admin group.',
        isBotAdmin: 'Perintah ini hanya berlaku saat Bot menjadi admin.'
    }

    const text = texts[type]
    if (text) return m.reply(text)
}

export default handler