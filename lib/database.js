import { defaultPrefix } from '../setting.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yourApi from 'your-api'
const { func } = yourApi

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function DB() {
    const dbPath = path.join(__dirname, '../database.json')

    const defaultGroupUser = {
        jid: '',
        level: 1,
        exp: 0,
        limit: 7
    }

    const defaultUser = {
        jid: '',
        name: '',
        id: '',
        time: 0,
        banned: {
            status: false,
            time: 0
        },
        premium: {
            status: false,
            time: 0
        },
        sticker: {
            author: false,
            name: false
        }
    }

    const defaultGroup = {
        jid: '',
        setting: {
            banned: false,
            detect: false,
            nsfw: false,
            antilink: false,
            antiraid: false,
            antivo: false,
            welcome: {
                status: false,
                msg: ''
            }
        },
        users: []
    }

    const defaultSetting = {
        jid: '',
        mode: 'public',
        prefix: [],
        autojoin: false
    }

    const defaultData = {
        users: [],
        groups: [],
        settings: [],
        stickers: [],
        others: []
    }

    let db = readDB()

    function readDB() {
        try {
            if (fs.existsSync(dbPath)) {
                const dbContent = fs.readFileSync(dbPath, 'utf-8')
                return JSON.parse(dbContent)
            } else {
                return defaultData
            }
        } catch (e) {
            console.log(func.colors(e, 'bgRed'))
            return defaultData
        }
    }

    function writeDB() {
        try {
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), 'utf-8')
        } catch (e) {
            console.log(func.colors(e, 'bgRed'))
        }
    }

    function initObject(target, source) {
        for (const prop in source) {
            if (typeof target[prop] === 'undefined') {
                target[prop] = Array.isArray(source[prop])
                    ? [...source[prop]]
                    : (typeof source[prop] === 'object'
                        ? { ...source[prop] }
                        : source[prop])
            } else if (typeof source[prop] === 'object' && !Array.isArray(source[prop])) {
                initObject(target[prop], source[prop])
            }
        }
    }

    return {
        groups: {
            add(jid) {
                if (this.exist(jid)) return false
                const newGroup = { ...defaultGroup, jid }
                db.groups.push(newGroup)
                return newGroup
            },
            get(jid) {
                const group = db.groups.find(c => c.jid === jid)
                return {
                    ...group,
                    users: {
                        add(userJid) {
                            if (this.exist(userJid)) return false
                            const newUser = { ...defaultGroupUser, jid: userJid }
                            group.users.push(newUser)
                            return newUser
                        },
                        get(userJid) {
                            let user = group.users.find(c => c.jid === userJid)
                            if (user) {
                                initObject(user, defaultGroupUser)
                            }
                            return user
                        },
                        list() {
                            return group.users
                        },
                        exist(userJid) {
                            return group.users.some(u => u.jid === userJid)
                        },
                        del(userJid) {
                            const users = group.users.filter(u => u.jid !== userJid)
                            if (users.length === group.users.length) {
                                return null
                            } else {
                                group.users = users
                                return true
                            }
                        }
                    }
                }
            },
            list() {
                return db.groups
            },
            exist(jid) {
                return db.groups.some(group => group.jid === jid)
            },
            del(jid) {
                const groups = db.groups.filter(group => group.jid !== jid)
                if (groups.length === db.groups.length) {
                    return null
                } else {
                    db.groups = groups
                    return true
                }
            }
        },
        users: {
            add(jid, { name = '', id = '', time = 0 } = {}) {
                if (this.exist(jid)) return false
                const newUser = { ...defaultUser, jid, name, id, time }
                db.users.push(newUser)
                return newUser
            },
            get(jid) {
                return db.users.find(c => c.jid === jid)
            },
            list() {
                return db.users
            },
            exist(jid) {
                return db.users.some(u => u.jid === jid)
            },
            del(jid) {
                const users = db.users.filter(u => u.jid !== jid)
                if (users.length === db.users.length) {
                    return null
                } else {
                    db.users = users
                    return true
                }
            }
        },
        settings: {
            add(jid) {
                if (this.exist(jid)) return false
                const newSetting = { ...defaultSetting, jid, prefix: defaultPrefix }
                db.settings.push(newSetting)
                return newSetting
            },
            get(jid) {
                return db.settings.find(c => c.jid === jid)
            },
            list() {
                return db.settings
            },
            exist(jid) {
                return db.settings.some(u => u.jid === jid)
            },
            del(jid) {
                const settings = db.settings.filter(u => u.jid !== jid)
                if (settings.length === db.settings.length) {
                    return null
                } else {
                    db.settings = settings
                    return true
                }
            }
        },
        stickers: {
            add(data) {
                if (this.exist(data.string)) return false
                db.stickers.push(data)
                return data
            },
            get(string) {
                return db.stickers.find(s => s.string === string)
            },
            list() {
                return db.stickers
            },
            exist(string) {
                return db.stickers.some(s => s.string === string)
            },
            del(string) {
                const stickers = db.stickers.filter(s => s.string !== string)
                if (stickers.length === db.stickers.length) {
                    return null
                } else {
                    db.stickers = stickers
                    return true
                }
            }
        },
        save() {
            writeDB()
            return true
        }
    }
}

export default DB()