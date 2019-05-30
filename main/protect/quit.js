/**
 * 程序退出监控
 */
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
let hasQuit = false;
function checkQuit(mainWindow, event) {
  const options = {
    type: 'info',
    title: '关闭确认',
    message: '确认要最小化程序到托盘吗？',
    buttons: ['确认', '关闭程序']
  };
  dialog.showMessageBox(options, index => {
    if (index === 0) {
      event.preventDefault();
      mainWindow.hide();
    } else {
      hasQuit = true;
      mainWindow = null;
      app.exit(0);
    }
  });
}
export default function handleQuit() {
  const mainWindow = BrowserWindow.fromId(global.mainId);
  mainWindow.on('close', event => {
    event.preventDefault();
    checkQuit(mainWindow, event);
  });
  app.on('window-all-closed', () => {
    if (!hasQuit) {
      if (process.platform !== 'darwin') {
        hasQuit = true;
        ipcMain.removeAllListeners();
        app.quit();
      }
    }
  });
}
