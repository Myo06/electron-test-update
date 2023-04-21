const { channels } = require('./shared/constants');
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  openElectron: () => ipcRenderer.invoke('openElectron'),
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('error', {
  show: () => ipcRenderer.invoke('showError'),
})

contextBridge.exposeInMainWorld('data', {
  get: (data) => ipcRenderer.send(channels.GET_DATA, data),
})

ipcRenderer.on('asynchronous-message', (event, data) => {
  document.querySelector('body').insertAdjacentHTML('beforeend', data + "<br>");
})