const { channels } = require('./shared/constants');
const { app, BrowserWindow, ipcMain, dialog  } = require('electron')
const path = require('path')

const { autoUpdater, AppUpdater } = require("electron-updater");

const server = "https://test-electron-react-olkfqon5y-myo06.vercel.app"
const url = `${server}/update/${process.platform}/${app.getVersion()}`

//Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;


const devUrl = process.env.ELECTRON_START_URL;
const prodUrl = (new URL('file://' + path.join(__dirname, 'index.html'))).href;
// Here, we are grabbing the React url from the env (which is on the start script)
const startUrl = devUrl || prodUrl;

const createChild = (parent) => {
  const child = new BrowserWindow({ 
    parent,
    modal: true, 
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js'),
    }
  })

  //either use the removeMenu() function
  child.removeMenu()
  // or set the Menu to null
  child.setMenu(null)

  //show as soon as the file is rendered
  child.once('ready-to-show', () => {   child.show() })

  child.loadURL('https://www.electronjs.org/docs/api/remote')
}

// Prevent garbage colelction
let win;
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    title:"React Electron",
    width: 1280,
    height: 1024,
    minWidth: 400,
    backgroundColor:'#F0F',
    // frame:false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js'),
    }
  })
  
  win.loadURL(startUrl);
  
  win.webContents.openDevTools();

  autoUpdater.checkForUpdates();
  win.webContents.send('asynchronous-message', `Checking for updates. Current version ${app.getVersion()}`);

  ipcMain.handle('openElectron', () => createChild(win))
  ipcMain.handle('showError', () => dialog.showErrorBox('Error Box','Fatal Error'))

  ipcMain.on(channels.GET_DATA, (event, arg) => {
    const { product } = arg;
    console.log(product);
    console.log(prodUrl);
  });

  /*New Update Available*/
  autoUpdater.on("update-available", (info) => {
    win.webContents.send('asynchronous-message', `Update available. Current version ${app.getVersion()}`);
    let pth = autoUpdater.downloadUpdate();
    win.webContents.send('asynchronous-message', pth);
  });

  autoUpdater.on("update-not-available", (info) => {
    win.webContents.send('asynchronous-message', `No update available. Current version ${app.getVersion()}`);
  });

  /*Download Completion Message*/
  autoUpdater.on("update-downloaded", (info) => {
    win.webContents.send('asynchronous-message', `Update downloaded. Current version ${app.getVersion()}`);
  });

  autoUpdater.on("error", (info) => {
    win.webContents.send('asynchronous-message', info);
  });

  return win;
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

