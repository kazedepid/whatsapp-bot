import { jidDecode, downloadContentFromMessage } from '@whiskeysockets/baileys'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import axios from 'axios'
import crypto from 'crypto'
import yourApi from 'your-api'

const { func } = yourApi
import store from './store.js'
import { timeZone } from '../../setting.js'

export async function downloadM(message, MessageType) {
    const stream = await downloadContentFromMessage(message, MessageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

export function getType(type) {
    return type === 'stickerMessage' ? 'sticker' :
           type === 'videoMessage' ? 'video' :
           type === 'liveLocationMessage' ? 'liveLocation' :
           type === 'locationMessage' ? 'location' :
           type === 'documentMessage' ? 'document' :
           type === 'audioMessage' ? 'audio' :
           type === 'imageMessage' ? 'image' :
           type === 'viewOnceMessage' ? 'viewOnce' :
           type;
}
    
export function getName(jid) {
    if (jid === '0@s.whatsapp.net') {
        return 'WhatsApp'
    }

    for (const chatKey in store.messages) {
        if (store.messages.hasOwnProperty(chatKey)) {
            const usersArray = store.messages[chatKey].array
            const userMsgs = usersArray.filter(m => m.sender === jid && m?.pushName)
            if (userMsgs.length !== 0) {
                return userMsgs[userMsgs.length - 1].pushName
            }
        }
    }

    return PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

export function decodeJid(jid) {
    if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {}
        return (decode.user && decode.server ? `${decode.user}@${decode.server}` : jid).trim()
    }
    return jid.trim()
}

export async function downloadMediaMessage(media) {
    const type = Object.keys(media)[0]
    const msg = media[type]

    if (!msg || !(msg.url || msg.directPath)) {
        return null
    }

    const stream = await downloadContentFromMessage(msg, type.replace(/Message/i, ''))
    const buffers = []

    for await (const chunk of stream) {
        buffers.push(chunk)
    }

    const resultBuffer = Buffer.concat(buffers)
    stream.destroy()

    return resultBuffer
}

async function fetchBuffer(url) {
    try {
        const axiosResponse = await axios.get(url, { responseType: 'arraybuffer' })
        const axiosBuffer = axiosResponse.data

        if (axiosBuffer.byteLength > 0) {
            return axiosBuffer
        }

        throw new Error('Axios returned an empty buffer.')
    } catch (axiosError) {
        try {
            const fetchResponse = await fetch(url)

            if (!fetchResponse.ok) {
                throw new Error(`HTTP error! Status: ${fetchResponse.status}`)
            }

            const fetchBuffer = await fetchResponse.arrayBuffer()

            if (fetchBuffer.byteLength > 0) {
                return fetchBuffer
            }

            throw new Error('Fetch returned an empty buffer.')
        } catch (fetchError) {
            throw fetchError
        }
    }
}

export async function getFile(PATH) {
    let res = null, filename
    let buffer = Buffer.isBuffer(PATH)
        ? PATH
        : /^data:.*?\/.*?base64,/i.test(PATH)
            ? Buffer.from(PATH.split(',')[1], 'base64')
            : /^https?:\/\//.test(PATH)
                ? Buffer.from(res = await fetchBuffer(PATH), 'binary')
                : fs.existsSync(PATH)
                    ? (filename = PATH, fs.readFileSync(PATH))
                    : typeof PATH === 'string'
                        ? PATH
                        : Buffer.alloc(0)

    if (!Buffer.isBuffer(buffer)) throw new TypeError('Result is not a buffer.')

    const type = func.determineFileType(buffer)

    return {
        res,
        ...type,
        buffer
    }
}