const { format } = require('util')

exports.cmd = {
    name: ['fetch'],
    command: ['fetch'],
    category: ['tools'],
    detail: {
        desc: 'Get html web/mengambil hasil dari url.',
        use: 'url'
    },
    async start({ m, text }) {
        if (!text) {
            return m.reply('Input url');
        }

        if (!isValidURL(text)) {
            return m.reply('Masukkan url dengan benar');
        }

        const url = new URL(text).href;
        const response = await fetch(url);

        const contentLength = response.headers.get('content-length');
        if (contentLength > 50 * 1024 * 1024) {
            return m.reply(`Content-Length: ${contentLength}`);
        }

        const contentType = response.headers.get('content-type');
        if (!/text|json/.test(contentType)) {
            return m.reply(url, { media: url });
        }

        let content;
        try {
            if (contentType.includes('application/json')) {
                content = format(await response.json());
            } else {
                content = await response.text();
            }
        } catch (e) {
            content = 'Error parsing content.';
        }

        await m.reply(content.slice(0, 65536));
    }
}

function isValidURL(query) {
    return /^https:\/\/[^\s/$.?#].[^\s]*$/i.test(query);
}