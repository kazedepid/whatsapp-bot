import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import pino from 'pino'
import yourApi from 'your-api'
const { func } = yourApi

import { getName } from './func.js'
import { timeZone } from '../../setting.js'

const { version } = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

export function displayTitle() {
    console.log(`
${func.colors('========================================', 'cyan')}
${func.colors('            WELCOME TO WHATSAPP BOT         ', 'rainbow')}
${func.colors('========================================', 'cyan')}
${func.colors(' ', 'green')}
${func.colors('          ╭╮╭╮╭┳━━━┳━━╮╭━━━┳━━━━╮', 'white')}
${func.colors('          ┃┃┃┃┃┃╭━╮┃╭╮┃┃╭━╮┃╭╮╭╮┃', 'white')}
${func.colors('          ┃┃┃┃┃┃┃╱┃┃╰╯╰┫┃╱┃┣╯┃┃╰╯', 'white')}
${func.colors('          ┃╰╯╰╯┃╰━╯┃╭━╮┃┃╱┃┃╱┃┃', 'white')}
${func.colors('          ╰╮╭╮╭┫╭━╮┃╰━╯┃╰━╯┃╱┃┃', 'white')}
${func.colors('          ╱╰╯╰╯╰╯╱╰┻━━━┻━━━╯╱╰╯', 'white')}
${func.colors(`.                     ${version} `, 'white')}
${func.colors('========================================', 'cyan')}
`)
}

export async function printLog(context) {
    const { m, conn, args, command, groupName, isGroup, isCommand } = context

    const number = (await PhoneNumber('+' + m.sender.split('@')[0])).getNumber('international')
    const text = m.text
        .replace(/\*(.*?)\*/g, (match, p1) => func.colors(p1, 'bold'))
        .replace(/_(.*?)_/g, (match, p1) => func.colors(p1, 'italic'))
        .replace(/~(.*?)~/g, (match, p1) => func.colors(p1, 'strikethrough'))
        .replace(/```([^`]*)```/g, (match, p1) => func.colors(p1.split('').join(' '), 'white'))
        .replace(/@(\d+)/g, (match, p1) => func.colors(
            m.mentions.includes(p1 + '@s.whatsapp.net') 
            ? '@' + getName(p1 + '@s.whatsapp.net') 
            : '@' + p1, 'green')
        )
        .replace(/(https?:\/\/[^\s]+)/g, (match, p1) => func.colors(p1, 'blue'))

    const header = func.colors(` ${isGroup ? groupName : 'Private Message'} `, 'bgGreen')
const userInfo = `${func.colors('@' + (conn.user.jid === m.sender ? (conn.user?.name || 'bot') : m.pushName), 'rgb(255, 153, 0)')} (${func.colors(number, 'green')})`
const commandInfo = `${func.colors(command, 'magenta')} [${func.colors(args.length.toString(), 'yellow')}]`
const separator = func.colors('-'.repeat(50), 'gray')

const log = '\n'
    + `${header} ${func.colors(func.formatDateInTimeZone(new Date(), timeZone) + ` (${timeZone})`, 'dim')}` + '\n'
    + separator + '\n'
    + `${func.colors('User Info:', 'green')} ${userInfo} ${func.colors('==', 'white')} ${func.colors(m.from, 'blue')}` + '\n'
    + separator + '\n'
    + ` | ${func.colors('Command:', 'green')} ${isCommand ? commandInfo : func.colors('false', 'yellow')} ` + '\n'
    + ` | ${func.colors('Text:', 'green')} ${func.colors(text, 'white')} ` + '\n'
    + ` | ${func.colors('Message Type:', 'green')} ${func.colors(m.type, 'bgYellow')} ` + '\n'
    + separator

console.log(log)
}