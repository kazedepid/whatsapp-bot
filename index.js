import yourApi from 'your-api'
const { func } = yourApi

import { displayTitle } from './lib/src/print.js'
import { loadPlugins } from './lib/plugins.js'
import clearTmp from './lib/src/clearTmp.js'
import connectSock from './lib/connection.js'

displayTitle()

async function start() {
    console.log(func.colors("Loading existing plugins...", 'cyan'))
    await loadPlugins({ table: true })
    setInterval(async () => {
        try {
            await clearTmp()
        } catch (error) {
            console.log(func.colors(`Error clearing temp: ${error}`, 'bgRed'))
        }
    }, 5 * 60 * 1000)
    try {
        await connectSock()
    } catch (error) {
        console.log(func.colors(`Connection error: ${error}`, 'bgRed'))
        setTimeout(start, 5000)
    }
    setInterval(() => {
    const used = process.memoryUsage();
    if (used.rss > 200 * 1024 * 1024) { // 200 MB
        console.log(func.colors("Memory usage is high(200 mb+)!", 'red'))
    }
   }, 10000)
}

start()