
import { ipcMain, BrowserWindow } from 'electron';

function windowInit() {
  ipcMain.on('window-inited', (event, data) => {
    Object.assign(global, data);
  });
}

function windowClose() {
  ipcMain.on('window-close', (event, data) => {
    const mainWindow = BrowserWindow.fromId(global.mainId);
    mainWindow.close();
  });
}


export default function handleMessage() {
  windowInit();
  windowClose();
}