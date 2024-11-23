import db from '../database.js'

const avatar = 'https://i.ibb.co/fp6t21w/avatar.jpg'

export async function groupParticipantsUpdate(data, conn) {
    const { id, author = null, participants, action, simulate = null } = data
    const group = db.groups.get(id).setting || {}
    const groupMetadata = await conn.groupMetadata(id)

    switch (action) {
        case 'add':
            if (simulate || group.welcome.status) {
                const teks = (group.welcome.msg === '' 
                    ? `*Hai, selamat datang di group @group.*\n\n@users` 
                    : group.welcome.msg)
                    .replace('@users', participants.map(user => `\t🥢. @${user.split('@')[0]}`).join('\n'))
                    .replace('@group', groupMetadata.subject)
                    .replace('@desc', groupMetadata.desc)

                let pp = await conn.profilePictureUrl(id, 'image').catch(() => avatar)

                await conn.sendMessage(id, {
                    image: { url: pp },
                    caption: teks,
                    mentions: participants
                }, {
                    ephemeralExpiration: groupMetadata.ephemeralDuration || 0
                })
            }
            break

        case 'promote':
        case 'demote':
            if (!group.antiraid) return

            const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id)
            const actionText = action === 'promote'
                ? `*@${author.split('@')[0]}* promote *@${participants[0].split('@')[0]}* . Untuk menghindari *bug* pesan ini menyebutkan semua *admin*.`
                : `*@${author.split('@')[0]}* menghapus admin dari *@${participants[0].split('@')[0]}*. Untuk menghindari *bug* pesan ini telah menyebutkan semua *admin*.`

            await conn.sendMessage(id, {
                text: actionText,
                mentions: [author, ...participants, ...admins]
            }, {
                ephemeralExpiration: groupMetadata.ephemeralDuration || 0
            })
            break
    }
}
