import { formatDateInTimeZone } from '../../lib/src/func.js'
import { timeZone } from '../../setting.js'
import db from '../../lib/database.js'
import path from 'path'
import fs from 'fs'

const tags = {
    'admin': { name: 'Admin Menu' },
    'ai': { name: 'AI Menu' },
    'anime': { name: 'Anime Menu' },
    'download': { name: 'Downloaders Menu' },
    'main': { name: 'Utama Menu' },
    'owner': { name: 'Owner Menu' },
    'religion': { name: 'Religions Menu' },
    'searching': { name: 'Search Menu' },
    'tools': { name: 'Tools Menu' }
}

export const cmd = {
    name: ['menu'],
    command: ['menu', 'help'],
    category: ['main'],
    detail: { desc: 'Menampilkan daftar semua perintah yang tersedia.' },
    async start({ m, conn, prefix, plugins }) {
        const { version } = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
        const currentDate = new Date()
        const ucapannye = ucapan()
        let teks = `${ucapannye}\n`
            + `Sistem otomatis *Whatsapp Bot* yang di buat dengan *_baileys_* yang siap membantu anda.\n\n`
            + `◦  *Waktu* · ${formatDateInTimeZone(currentDate, timeZone)}\n`
        let totalFitur = 0
        for (const tag in tags) {
            teks += `\n*${tags[tag].name.toUpperCase()}*\n`
            const filteredCommands = plugins.commands.filter(cmd => {
                return cmd[Object.keys(cmd)[0]].category.includes(tag)
            })
            totalFitur += filteredCommands.length; 
            filteredCommands.forEach((cmd, index) => {
                const commandDetails = cmd[Object.keys(cmd)[0]]
                teks += `${index + 1}. ${prefix + commandDetails.name[0]}${commandDetails.detail?.use ? ` < *${commandDetails.detail.use}* >` : ''}${commandDetails.setting?.isNsfw ? `  (*+18*)` : ''}\n`
            })
        }

        teks += `\nTotal fitur: ${totalFitur}\n`
        teks += `> Bot Ini menggunakan script: https://github.com/kazedepid/whatsapp-bot\n\n> WhatsApp Bot@${version}\n\n`

        if (teks.trim() === '') {
            teks = 'Tidak ada perintah yang ditemukan untuk kategori ini.'
        }

        await m.reply(teks)
    }
}

function ucapan() {
    const time = new Date()
    const greetings = {
        midnight: 'Selamat tengah malam 🌌',
        morning: 'Selamat pagi 🌄',
        noon: 'Selamat siang 🌤',
        afternoon: 'Selamat sore 🌇',
        night: 'Selamat malam 🎑'
    }

    const hour = formatDateInTimeZone(time, timeZone).split(',')[1].split(':')[0]

    if (hour == 0) return greetings.midnight
    if (hour >= 6 && hour < 12) return greetings.morning
    if (hour == 12) return greetings.noon
    if (hour >= 13 && hour < 19) return greetings.afternoon
    return greetings.night
}