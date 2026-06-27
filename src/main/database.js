import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

const dbPath = join(app.getPath('userData'), 'gratify.db')
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks(
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    priority TEXT DEFAULT 'low',
    deadline TEXT,
    completed INTEGER DEFAULT 0,
    recurring INTEGER DEFAULT 0,
    frequency TEXT,
    customInterval INTEGER,
    customUnit TEXT,
    reminder TEXT,
    addToCalendar INTEGER DEFAULT 0
    )
    `)
db.exec(`
    CREATE TABLE IF NOT EXISTS notes(
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT,
    tags TEXT,
    color TEXT DEFAULT 'pink',
    pinned INTEGER DEFAULT 0,
    createdAt INTEGER,
    updatedAt INTEGER
    )
    `)
db.exec(`
    CREATE TABLE IF NOT EXISTS calendar_event(
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start TEXT,
    end TEXT,
    color TEXT DEFAULT 'pink',
    allDay INTEGER DEFAULT 0,
    recurring INTEGER DEFAULT 0,
    frequency TEXT,
    isTaskEvent INTEGER DEFAULT 0,
    taskId INTEGER,
    labelId TEXT
    )
    `)
db.exec(`
    CREATE TABLE IF NOT EXISTS settings(
    key TEXT PRIMARY KEY,
    value TEXT
    )
    `)
db.exec(`
    CREATE TABLE IF NOT EXISTS timer_techniques(
    key TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phases TEXT,
    cyclesBeforeLongBreak  INTEGER
    )
    `)
export default db
