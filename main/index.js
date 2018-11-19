require('./menu');
import Updater from './UpdateHelper';
import getRenderUrl from './mainUrl';
import deviceid from './utils/deviceid.js';
import onCrashed from './protect/crashed';
import createTray from './protect/tray';
import autoStart from './protect/autoStart';


const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1000, height: 800 });
  mainWindow.loadURL(getRenderUrl());
  if (process.platform === 'win32') {
    mainWindow.on('close', (event) => {
      mainWindow.hide();
      mainWindow.setSkipTaskbar(true);
      event.preventDefault();
    });
  }
  global.mainId = mainWindow.id;
}

if (process.platform === 'win32') {
  const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
  if (shouldQuit) {
    app.quit()
  };
}

const devicePromise = deviceid.get();
app.on('ready', () => {
  devicePromise
    .then(() => Updater.init())
    .then(() => createWindow())
    .then(() => onCrashed())
    .then(() => { if (process.platform === 'win32') { createTray() } })
    .then(() => { if (process.platform === 'win32') { autoStart() } })
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});


ipcMain.on('window-inited', (event, data) => {
  Object.assign(global, data);
});
