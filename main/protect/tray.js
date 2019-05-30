/**
 * 最小化到托盘  windows系统可用
 */

const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let tray;
global.tray = tray;

export default function createTray() {
  const mainWindow = BrowserWindow.fromId(global.mainId);
  const iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.png'
  tray = new Tray(path.join(global.__dirname, iconName));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主界面', click: () => {
        mainWindow.show();
        mainWindow.setSkipTaskbar(false);
      }
    },
    {
      label: '退出', click: () => {
        mainWindow.destroy();
        app.quit();
      }
    },
  ])
  tray.setToolTip('electron-react');
  tray.setContextMenu(contextMenu);
}