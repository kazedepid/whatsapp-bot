import { decodeJid } from '../../lib/src/func.js'

export const cmd = {
    name: ['add'],
    command: ['add'],
    category: ['admin'],
    detail: {
        desc: 'Tambah anggota ke grup',
        use: '6282xxx/reply'
    },
    setting: {
        isGroup: true,
        isAdmin: true,
        isBotAdmin: true
    },
    async start({ m, conn }) {
        const input = m.text || (m.quoted && m.quoted.sender)
        
        if (!input) {
            return m.reply('Silahkan input nomor 6282xxx / reply target')
        }

        const p = await conn.onWhatsApp(input.trim())
        if (p.length === 0) {
            return m.reply('Nomor tidak terdaftar di WhatsApp')
        }

        const jid = decodeJid(p[0].jid)
        const meta = await conn.groupMetadata(m.from)
        const member = meta.participants.find(u => u.id === jid)
        
        if (member) {
            return m.reply('Anggota sudah bergabung ke grup')
        }

        try {
            await conn.groupParticipantsUpdate(m.from, [jid], 'add')
            m.reply('Sukses')
        } catch (error) {
            console.error(error)
            m.reply('Gagal menambahkan anggota. Pastikan bot adalah admin dan nomor valid.')
        }
    }
}