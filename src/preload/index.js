import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  notify: (title, body) => ipcRenderer.invoke('notify', { title, body }),
  tasks: {
    getAll: () => ipcRenderer.invoke('tasks:getAll'),
    add: (task) => ipcRenderer.invoke('tasks:add', task),
    update: (task) => ipcRenderer.invoke('tasks:update', task),
    remove: (id) => ipcRenderer.invoke('tasks:remove', id)
  },
  notes: {
    getAll: () => ipcRenderer.invoke('notes:getAll'),
    add: (note) => ipcRenderer.invoke('notes:add', note),
    update: (note) => ipcRenderer.invoke('notes:update', note),
    remove: (id) => ipcRenderer.invoke('notes:remove', id)
  },
  calendarEvents: {
    getAll: () => ipcRenderer.invoke('calendar_events:getAll'),
    add: (event) => ipcRenderer.invoke('calendar_events:add', event),
    update: (event) => ipcRenderer.invoke('calendar_events:update', event),
    remove: (id) => ipcRenderer.invoke('calendar_events:remove', id)
  },
  settings: {
    getAll: () => ipcRenderer.invoke('settings:getAll'),
    set: (key, value) => ipcRenderer.invoke('settings:set', key, value)
  },
  techniques: {
    getAll: () => ipcRenderer.invoke('techniques:getAll'),
    add: (technique) => ipcRenderer.invoke('techniques:add', technique),
    update: (technique) => ipcRenderer.invoke('techniques:update', technique),
    remove: (id) => ipcRenderer.invoke('techniques:remove', id)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
