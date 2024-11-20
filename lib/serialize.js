import { decodeJid, downloadMediaMessage, getFile } from './src/func.js'

const MediaType = [
    'imageMessage',
    'videoMessage',
    'audioMessage',
    'stickerMessage',
    'documentMessage',
    'ptvMessage'
]

const serialize = (m, conn) => {
    if (m.message) {
        m.id = m.key.id
        m.from = m.key.remoteJid
        m.type = Object.keys(m.message).find(type =>
            type !== 'senderKeyDistributionMessage' &&
            type !== 'messageContextInfo'
        )
        m.sender = decodeJid(
            m.key?.fromMe && conn?.user.id ||
            m.participant ||
            m.key.participant ||
            m.from ||
            ''
        )
        let message = m.message
        if (['viewOnceMessageV2', 'interactiveMessage', 'documentWithCaptionMessage'].includes(m.type)) {
            message = m.message[m.type]?.header || m.message[m.type]?.message || false
            if (message) m.typeV2 = Object.keys(message)[0]
        }

        m.text = message?.conversation ||
            message[m.type]?.text ||
            message[m.type]?.caption ||
            message[m?.typeV2]?.caption ||
            message[m.type]?.selectedId ||
            message[m.type]?.name ||
            m.message[m.type]?.body?.text ||
            ''
        m.mentions = (message[m.typeV2] || message[m.type])?.contextInfo?.mentionedJid || []
        m.expiration = (message[m.typeV2] || message[m.type])?.contextInfo?.expiration || 0
        let isMedia = MediaType.some(type => {
            let m = message[type]
            return m?.url || m?.directPath
        })
        if (isMedia) {
            m.media = message[m.typeV2] || message[m.type] || null
            m.download = () => downloadMediaMessage(message)
        }
    }
    if (!m.quoted) m.quoted = {}
    m.quoted.message = m.message[m.type]?.contextInfo?.quotedMessage || null
    if (m.quoted.message) {
        m.quoted.key = {
            remoteJid: m.message[m.type]?.contextInfo?.remoteJid || m.from || m.sender,
            fromMe: decodeJid(m.message[m.type]?.contextInfo?.participant) === conn.user.jid,
            id: m.message[m.type]?.contextInfo?.stanzaId,
            participant: decodeJid(m.message[m.type]?.contextInfo?.participant) || m.sender
        }
        m.quoted.id = m.quoted.key.id
        m.quoted.from = m.quoted.key.remoteJid
        m.quoted.type = Object.keys(m.quoted.message).find(type =>
            type !== 'senderKeyDistributionMessage' &&
            type !== 'messageContextInfo'
        )
        m.quoted.sender = m.quoted.key.participant
        if (m.quoted) {
            let message = m.quoted.message
            if (['viewOnceMessageV2', 'interactiveMessage', 'documentWithCaptionMessage'].includes(m.quoted.type)) {
                message = m.quoted.message[m.quoted.type]?.header || m.quoted.message[m.quoted.type]?.message || false
                if (message) m.quoted.typeV2 = Object.keys(message)[0]
            }
            m.quoted.text = message?.conversation ||
                message[m.quoted.type]?.text ||
                message[m.quoted.type]?.caption ||
                message[m.quoted.typeV2]?.caption ||
                message[m.quoted.type]?.selectedId ||
                message[m.quoted.type]?.name ||
                m.quoted.message[m.quoted.type]?.body?.text ||
                ''
            m.quoted.mentions = (message[m.quoted.typeV2] || message[m.quoted.type])?.contextInfo?.mentionedJid || []
            let isMedia = MediaType.some(type => {
                let m = message[type]
                return m?.url || m?.directPath
            })
            if (isMedia) {
                m.quoted.media = message[m.quoted.typeV2] || message[m.quoted.type] || null
                m.quoted.download = () => downloadMediaMessage(message)
            }
        }
    } else {
        m.quoted = false
    }
    if (!m.adSent) {
        m.adSent = false;
    }
    m.reply = async (textOrOpts, opts = {}) => {
        let adSent = false
        let text = null
        let options = {}
        if (textOrOpts === null) {
            options = opts
        } else if (typeof textOrOpts === 'string') {
            text = textOrOpts
            options = opts
        } else {
            options = textOrOpts
            text = options?.text || null
        }
        let from = options?.from || m.from
        let quoted = options?.quoted !== undefined ? options.quoted : m
        if (options?.mentions) {
            options.mentions = Array.isArray(options.mentions)
                ? options.mentions
                : [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
        }
        let messageId = null, expiration = null, content
        if (m.expiration) {
            expiration = { ephemeralExpiration: options?.expiration || m.expiration }
            if (options?.expiration) delete options.expiration
        }
        if (m.adSent) {
            return conn.sendMessage(m.from, { text: textOrOpts }, opts)
        }
        let adData
        try {
            const response = await fetch(adUrl)
            if (!response.ok) throw new Error('Network response was not ok')
            adData = await response.json()
        } catch (error) {
            console.error('Error fetching ad content:', error)
            return
        }
        for (const ad of adData.ads) {
            const adContent = ad.content
            const sendCount = ad.sendCount || 1
            const interval = ad.interval || 60000
            for (let i = 0; i < sendCount; i++) {
                content = { text: adContent, ...options }
                await conn.sendMessage(from, content, { quoted, ...expiration, messageId })
                if (ad.img && options.img !== false) {
                    await conn.sendMessage(from, {
                        image: { url: ad.img },
                        caption: adContent,
                        ...options
                    }, { quoted, ...expiration, messageId })
                }
                await new Promise(resolve => setTimeout(resolve, interval))
            }
        }
        if (options?.media) {
            const { mime, buffer } = await getFile(options.media)
            let mtype = ''
            if (/webp/.test(mime)) mtype = 'sticker'
            else if (/image/.test(mime)) mtype = 'image'
            else if (/video/.test(mime)) mtype = (Buffer.byteLength(buffer) >= 104857600 ? 'document' : 'video')
            else if (/audio/.test(mime)) mtype = 'audio'
            else if (/apk/.test(mime)) mtype = 'document'
            else mtype = 'document'
            delete options.media
            content = { [mtype]: buffer, caption: text, mimetype: mime, ...options }
        } else if (options?.image || options?.video || options?.document || options?.sticker || options?.audio) {
            let mediaType = Object.keys(options).find(key => ['image', 'video', 'document', 'sticker', 'audio'].includes(key))
            content = { caption: text, ...options, [mediaType]: (await getFile(options[mediaType])).buffer }
        } else if (options?.delete || options?.forward) {
            content = { ...options }
        } else {
            content = { ...(text && { text }), ...options }
        }

        if (options?.id) messageId = options.id
        m.adSent = true
        return conn.sendMessage(from, content, { quoted, ...expiration, messageId })
    }

    m.react = (emoji, opts = {}) => {
        let key = opts.key || m.key
        return conn.sendMessage(m.from, { react: { text: emoji, key } })
    }

    return m
}

export default serialize