import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let plugins = {
    befores: [],
    commands: [],
    afters: []
}

export function loadPlugins(opts = {}) {
    try {
        const dir = path.join(__dirname, '../plugins')
        const cmdFiles = []

        function watchDirectory(directory) {
            fs.readdir(directory, (err, files) => {
                if (err) return console.error(err)
                files.forEach(file => {
                    const filePath = path.join(directory, file)
                    fs.stat(filePath, (err, stat) => {
                        if (stat && stat.isDirectory()) {
                            watchDirectory(filePath) 
                            fs.watch(filePath, (eventType, filename) => {
                                if (filename && (filename.endsWith('.js') || filename.endsWith('.cjs'))) {
                                    handlePluginChange(path.join(filePath, filename), eventType)
                                }
                            })
                        } else if (file.endsWith('.js') || file.endsWith('.cjs')) {
                            fs.watch(filePath, (eventType) => {
                                handlePluginChange(filePath, eventType)
                            })
                        }
                    })
                })
            })
        }

        watchDirectory(dir)

        async function handlePluginChange(filePath, eventType) {
            const file = path.basename(filePath)

            try {
                const cmd = await import(filePath)

                if (eventType === 'rename') {
                    if (fs.existsSync(filePath)) {
                        await addPlugin(filePath, file)
                        console.log(`Plugin '${file}' added.`)
                    } else {
                        delPlugin(file)
                        console.log(`Plugin '${file}' removed.`)
                    }
                } else if (eventType === 'change') {
                    await addPlugin(filePath, file)
                    console.log(`Plugin '${file}' changed.`)
                }
            } catch (e) {
                console.log(e + ` Plugin '${file}' error.`)
            }
        }

        function readDirectory(directory) {
            const files = fs.readdirSync(directory)

            for (const file of files) {
                const filePath = path.join(directory, file)

                if (fs.statSync(filePath).isDirectory()) {
                    readDirectory(filePath)
                } else if (file.endsWith('.js') || file.endsWith('.cjs')) {
                    try {
                        addPlugin(filePath, file)
                        cmdFiles.push(file)
                    } catch (e) {
                        console.log(e + ` Plugin '${file}' error.`)
                    }
                }
            }
        }

        readDirectory(dir)
        if (opts.array) console.log(cmdFiles)
        if (opts.table) console.table(cmdFiles.map((value) => ({ plugins: value })))
    } catch (e) {
        console.log(e)
    }
}

async function addPlugin(filePath, file) {
    const cmd = await import(filePath)

    Object.keys(cmd).forEach(type => {
        const setType = type === 'cmd' ? 'commands' :
            type === 'before' ? 'befores' :
            type === 'after' ? 'afters' :
            type

        if (typeof cmd[type]?.start === 'function') {
            plugins[setType] = plugins[setType] || []

            const existingIndex = plugins[setType].findIndex(existingCmd => Object.keys(existingCmd)[0] === file)

            if (existingIndex !== -1) {
                plugins[setType][existingIndex] = { [file]: cmd[type] }
            } else {
                plugins[setType].push({ [file]: cmd[type] })
            }
        }
    })
}

function delPlugin(file) {
    const type = Object.keys(plugins).find(v => plugins[v].some(c => Object.keys(c)[0] === file))

    if (plugins[type]) {
        const indexToRemove = plugins[type].findIndex(existingCmd => Object.keys(existingCmd)[0] === file)

        if (indexToRemove !== -1) {
            plugins[type].splice(indexToRemove, 1)
        }
    }
}

export { plugins }