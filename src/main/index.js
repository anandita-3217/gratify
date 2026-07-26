/* eslint-disable prettier/prettier */
import { app, shell, BrowserWindow, ipcMain, Notification, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db from './database'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    icon: icon,
    // autoHideMenuBar: false,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; img-src 'self' data: https://fonts.gstatic.com; script-src 'self'"
        ]
      }
    })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function serializeTask(task) {
  return {
    ...task,
    completed: task.completed ? 1 : 0,
    recurring: task.recurring ? 1 : 0,
    addToCalendar: task.addToCalendar ? 1 : 0,
    deadline: task.deadline ?? null,
    frequency: task.frequency ?? null,
    customInterval: task.customInterval ?? null,
    customUnit: task.customUnit ?? null,
    reminder: task.reminder ?? null
  }

}

function deserializeTask(row) {
  return {
    ...row,
    completed: Boolean(row.completed),
    recurring: Boolean(row.recurring),
    addToCalendar: Boolean(row.addToCalendar)
  }
}
function serializeNote(note) {
  return {
    ...note,
    pinned: note.pinned ? 1 : 0,
    tags: JSON.stringify(note.tags || [])
  }
}

function deserializeNote(row) {
  return {
    ...row,
    pinned: Boolean(row.pinned),
    tags: JSON.parse(row.tags || '[]')
  }
}
function serializeEvent(event) {
  return {
    ...event,
    allDay: event.allDay ? 1 : 0,
    recurring: event.recurring ? 1 : 0,
    isTaskEvent: event.isTaskEvent ? 1 : 0,
    taskId: event.taskId ?? null,
    labelId: event.labelId ?? null,
    frequency: event.frequency ?? null,
    description: event.description ?? null
  }
}

function deserializeEvent(row) {
  return {
    ...row,
    allDay: Boolean(row.allDay),
    recurring: Boolean(row.recurring),
    isTaskEvent: Boolean(row.isTaskEvent)
  }
}

function serializeTechnique(technique) {
  return {
    ...technique,
    phases: JSON.stringify(technique.phases || [])
  }
}

function deserializeTechnique(row) {
  return {
    ...row,
    phases: JSON.parse(row.phases || '[]')
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  


  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('notify', (event, { title, body }) => {
    new Notification({ title, body }).show()
  })
  // Tasks
  ipcMain.handle('tasks:getAll', () => {
    return db.prepare('SELECT * FROM tasks').all().map(deserializeTask)
  })
  ipcMain.handle('tasks:add', (_, task) => {
    const s = serializeTask(task)

    const result = db
      .prepare(
        `
    INSERT INTO tasks (id, text, priority, deadline, completed, recurring, frequency, customInterval, customUnit, reminder, addToCalendar)
    VALUES (@id, @text, @priority, @deadline, @completed, @recurring, @frequency, @customInterval, @customUnit, @reminder, @addToCalendar)
  `
      )
      .run(s)

    return deserializeTask(
      db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid)
    )
  })
  ipcMain.handle('tasks:update', (_, task) => {
    const s = serializeTask(task)
    db.prepare(
      `
    UPDATE tasks SET text = @text, priority = @priority, deadline = @deadline,
    completed = @completed, recurring = @recurring, frequency = @frequency,
    customInterval = @customInterval, customUnit = @customUnit,
    reminder = @reminder, addToCalendar = @addToCalendar
    WHERE id = @id
  `
    ).run(s)

    return deserializeTask(db.prepare('SELECT * FROM tasks WHERE id = ?').get(task.id))
  })
  ipcMain.handle('tasks:remove', (_, id) => {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
    return { success: true }
  })

  // Notes
  ipcMain.handle('notes:getAll', () => {
    return db.prepare('SELECT * FROM notes').all().map(deserializeNote)
  })
  ipcMain.handle('notes:add', (_, note) => {
    const s = serializeNote(note)

    const result = db
      .prepare(
        `
    INSERT INTO notes (id, title, body, tags, color, pinned, createdAt, updatedAt)
    VALUES (@id, @title, @body, @tags, @color, @pinned, @createdAt, @updatedAt)
  `
      )
      .run(s)

    return deserializeNote(
      db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid)
    )
  })
  ipcMain.handle('notes:update', (_, note) => {
    const s = serializeNote(note)
    db.prepare(
      `
    UPDATE notes SET title = @title, body = @body, tags = @tags,
    color = @color, pinned = @pinned, createdAt = @createdAt,
    updatedAt = @updatedAt
    WHERE id = @id
  `
    ).run(s)

    return deserializeNote(db.prepare('SELECT * FROM notes WHERE id = ?').get(note.id))
  })

  ipcMain.handle('notes:remove', (_, id) => {
    db.prepare('DELETE FROM notes WHERE id = ?').run(id)
    return { success: true }
  })
  // Events
  ipcMain.handle('calendar_events:getAll', () => {
    return db.prepare('SELECT * FROM calendar_events').all().map(deserializeEvent)
  })

  ipcMain.handle('calendar_events:add', (_, event) => {
    const s = serializeEvent(event)
    const result = db
      .prepare(
        `INSERT INTO calendar_events (id, title, description, start,end, color, allDay, recurring, frequency, isTaskEvent, taskId, labelId) 
      VALUES (@id, @title, @description, @start,@end, @color, @allDay, @recurring, @frequency, @isTaskEvent, @taskId, @labelId )`
      )
      .run(s)
    return deserializeEvent(
      db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(result.lastInsertRowid)
    )
  })

  ipcMain.handle('calendar_events:update', (_, event) => {
    const s = serializeEvent(event)
    db.prepare(
      `UPDATE calendar_events SET title = @title, description=@description, start= @start, end= @end, 
      color=@color, allDay=@allDay, recurring = @recurring, frequency=@frequency, isTaskEvent=@isTaskEvent, taskId = @taskId, labelId = @labelId WHERE id = @id`
    ).run(s)
    return deserializeEvent(db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(event.id))
  })

  ipcMain.handle('calendar_events:remove', (_, id) => {
    db.prepare('DELETE FROM calendar_events WHERE id = ?').run(id)
    return { success: true }
  })
  //  Settings
  ipcMain.handle('settings:getAll', () => {
    const rows = db.prepare('SELECT * FROM settings').all()
    return Object.fromEntries(rows.map((r) => [r.key, r.value]))
  })

  ipcMain.handle('settings:set', (_, key, value) => {
    db.prepare(
      `
      INSERT OR REPLACE INTO settings (key, value) VALUES (? , ?) 
      `
    ).run(key, value)
    return { key, value }
  })
  // TimerTechniques
  ipcMain.handle('techniques:getAll', () => {
    return db.prepare('SELECT * FROM timer_techniques').all().map(deserializeTechnique)
  })

  ipcMain.handle('techniques:add', (_, technique) => {
    const s = serializeTechnique(technique)
     db
      .prepare(
        `INSERT INTO timer_techniques (key, name, phases, cyclesBeforeLongBreak) VALUES (@key, @name, @phases, @cyclesBeforeLongBreak)`
      )
      .run(s)
    return deserializeTechnique(
      db.prepare('SELECT * FROM timer_techniques WHERE key = ?').get(s.key)
    )
  })

  ipcMain.handle('techniques:update', (_, technique) => {
    const s = serializeTechnique(technique)
    db.prepare(
      'UPDATE timer_techniques SET name = @name, phases = @phases, cyclesBeforeLongBreak = @cyclesBeforeLongBreak WHERE key = @key'
    ).run(s)
    return deserializeTechnique(db.prepare('SELECT * FROM timer_techniques WHERE key = ?').get(technique.key))
  })

  ipcMain.handle('techniques:remove', (_, id) => {
    db.prepare('DELETE FROM timer_techniques WHERE key = ? ').run(id)
    return { success: true }
  })

  createWindow()
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Origin': ['*']
      }
    })
  })
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
