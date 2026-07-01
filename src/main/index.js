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

  function serializeTask(task) {
    return {
      ...task,
      completed: task.completed ? 1 : 0,
      recurring: task.recurring ? 1 : 0,
      addToCalendar: task.addToCalendar ? 1 : 0
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

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('notify', (event, { title, body }) => {
    new Notification({ title, body }).show()
  })

  ipcMain.handle('tasks:getAll', () => {
    return db.prepare('SELECT * FROM tasks').all().map(deserializeTask)
  })
  ipcMain.handle('tasks:add', (_, task) => {
    const s = serializeTask(task)

    const result = db
      .prepare(
        `
    INSERT INTO tasks (text, priority, deadline, completed, recurring, frequency, customInterval, customUnit, reminder, addToCalendar)
    VALUES (@text, @priority, @deadline, @completed, @recurring, @frequency, @customInterval, @customUnit, @reminder, @addToCalendar)
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
