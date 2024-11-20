const your = require('your-api')

exports.cmd = {
    name: ['alkitab'],
    command: ['alkitab', 'kitab', 'bible'],
    category: ['religion'],
    detail: {
        desc: 'Mengambil ayat dari Alkitab.',
        use: '<kitab/singkatan> <pasal> <ayat> <version>',
    },
    async start({ m, text }) {
        const args = text.trim().split(' ')
        if (args.length < 4) {
            return m.reply(`Penggunaan: !alkitab <kitab/singkatan> <pasal> <ayat> <version>\nContoh: !alkitab Yoh 3 16 TB`)
        }
        const [inputKitab, ch, vs, ver] = args
        const url = 'https://gist.githubusercontent.com/kazedepid/2d32aaf09d37355f891f839ec9c27506/raw/24b7d05ffcd169136cea97f434beff02f551a83d/kitab.json'
        let data
        async function fetchData() {
            try {
                const res = await fetch(url)
                if (!res.ok) throw new Error('Network error')
                return await res.json()
            } catch (err) {
                console.error('Fetch error:', err)
                return null
            }
        }
        data = await fetchData()
        if (!data) return m.reply('Error fetching data.')
        const versions = ["ayt", "tb", "tl", "milt", "sk", "ksr", "pb sk", "kszi", "kskk", "pb wbtc", "vmd", "amd", "tsi", "bis", "tmv", "bsd", "fayh", "ende", "sk 1912", "pb klinkert 1879", "pb klinkert 1863", "pb melayu baba", "pb ambon", "ka (keasberry 1853)", "ka (keasberry 1866)", "pb leydkker", "vb", "iban", "jawa", "pb jawa", "jawa hh", "pb jawa sur", "sunda", "pb sunda", "madura", "bauzi", "bali", "pb dayak", "pb sasak", "bugis", "makasar", "toraja", "pb duri", "pb gorontalo", "pb gorontalo 2006", "pb balantak", "pb bambam", "pb kaili", "pb mongondow", "pb aralle", "pb napu", "pb sangir", "pb taa", "pb rote", "pb galela", "pb yali", "pb tabaru", "batak k", "batak s", "batak t", "pb batak d", "pb minang", "pb nias", "pb mentawai", "pb lampung", "pb aceh", "mamas", "pb beri", "manggarai", "pb sabu", "pb kupang", "abun", "meyah", "pb uma", "pb yawa", "net", "nasb", "hcbs", "leb", "niv", "esv", "nrsv", "rev", "nk", "kjv", "amp", "nlt", "gnb", "erv", "evd", "bbe", "msg", "pnt", "dnt", "gnv", "cev", "cev uk", "gw", "hb", "wh", "wh strong", "sr", "sr strong", "ayt i", "tb i", "tl i", "avb i", "kjv i", "nasb i", "net i"]
        const map = { 'Kej': 'Kej', 'Kel': 'Kel', 'Im': 'Im', 'Bil': 'Bil', 'Ula': 'Ula', 'Yos': 'Yos', 'Hak': 'Hak', 'Rut': 'Rut', '1Sam': '1Sam', '2Sam': '2Sam', '1Raj': '1Raj', '2Raj': '2Raj', '1Taw': '1Taw', '2Taw': '2Taw', 'Ezr': 'Ezr', 'Neh': 'Neh', 'Est': 'Est', 'Ayub': 'Ayub', 'Maz': 'Maz', 'Ams': 'Ams', 'Peng': 'Peng', 'Kidung': 'Kidung', 'Yes': 'Yes', 'Yer': 'Yer', 'Rat': 'Rat', 'Eze': 'Eze', 'Dan': 'Dan', 'Hos': 'Hos', 'Yoel': 'Yoel', 'Am': 'Am', 'Ob': 'Ob', 'Yun': 'Yun', 'Mik': 'Mik', 'Nah': 'Nah', 'Hab': 'Hab', 'Zef': 'Zef', 'Hag': 'Hag', 'Zakh': 'Zakh', 'Mal': 'Mal', 'Mat': 'Mat', 'Mar': 'Mar', 'Luk': 'Luk', 'Yoh': 'Yoh', 'Kis': 'Kis', 'Roma': 'Roma', '1Kor': '1Kor', '2Kor': '2Kor', 'Gal': 'Gal', 'Efe': 'Efe', 'Fil': 'Fil', 'Kol': 'Kol', '1Tes': '1Tes', '2Tes': '2Tes', '1Tim': '1Tim', '2Tim': '2Tim', 'Tit': 'Tit', 'File': 'File', 'Ibr': 'Ibr', 'Yak': 'Yak', '1Pet': '1Pet', '2Pet': '2Pet', '1Yoh': '1Yoh', '2Yoh': '2Yoh', '3Yoh': '3Yoh', 'Jud': 'Jud', 'Wah': 'Wah' }
        const book = map[inputKitab] || inputKitab
        const normalizedVersion = ver.toLowerCase()
        if (!versions.includes(normalizedVersion)) {
            return m.reply(`Version tidak valid. Version yang tersedia: ${versions.join(', ')}`)
        }
        const chapters = data[book]
        if (!chapters) {
            return m.reply(`Kitab ${book} tidak ditemukan.`)
        }
        const chNum = parseInt(ch, 10)
        const vsNum = parseInt(vs, 10)
        if (isNaN(chNum) || isNaN(vsNum)) {
            return m.reply('Pasal dan ayat harus berupa angka.')
        }
        const maxCh = chapters.length
        const maxVs = chapters[chNum - 1]
        if (chNum > maxCh) {
            return m.reply(`Batas pasal ${book} adalah ${maxCh}.`)
        }
        if (vsNum > maxVs) {
            return m.reply(`Batas ayat ${vsNum} di ${book} pasal ${chNum} adalah ${maxVs}.`)
        } 
        try {
            const res = await your.religion.alkitab.getChapters(normalizedVersion, book, chNum, vsNum)
            let output = `*${book} ${chNum}:${vsNum}*\nBerbunyi demikian.\n`
            res.verses.forEach(verse => {
                output += `Verse ${verse.verse}: ${verse.content} (Type: ${verse.type})\n`
            })
            await m.reply(output)
        } catch (err) {
            console.error(err)
            await m.reply('Kesalahan saat mengambil ayat. Pastikan kitab, pasal, dan ayat benar.')
        }
    }
}
