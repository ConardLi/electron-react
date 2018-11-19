/**
 * 最小化到托盘  windows系统可用
 */

const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let tray;
global.tray = tray;

export default function createTray() {
  const mainWindow = BrowserWindow.fromId(global.mainId);
  tray = new Tray(path.join(global.__dirname, 'icon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出', click: () => { mainWindow.destroy(); app.quit(); } },
  ])
  tray.setToolTip('electron-react')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      mainWindow.setSkipTaskbar(true);
    } else {
      mainWindow.show();
      mainWindow.setSkipTaskbar(false);
    }
  })
}