import url from 'url';
import path from 'path';
import { ipcMain, BrowserWindow } from 'electron';

const html = url.format({
  protocol: 'file:',
  pathname: path.join(__dirname, '../static/window.html'),
  slashes: true,
})

const draghtml = url.format({
  protocol: 'file:',
  pathname: path.join(__dirname, '../static/window_drag.html'),
  slashes: true,
})

const transhtml = url.format({
  protocol: 'file:',
  pathname: path.join(__dirname, '../static/window_trans.html'),
  slashes: true,
})

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

function createWindow() {
  ipcMain.on('create-window', (event, data) => {
    let win = new BrowserWindow({
      width: 800,
      height: 600,
    })
    win.on('close', () => { win = null })
    win.loadURL('http://www.conardli.top/')
  });
}

function createNoBarWindow() {
  ipcMain.on('create-nobar-window', (event, data) => {
    let win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
    })
    win.on('close', () => { win = null })
    win.loadURL(html)
  });
}

function createNoBarWindowWithButton() {
  ipcMain.on('create-nobar-window-button', (event, data) => {
    let win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      titleBarStyle: 'hidden',
    })
    win.on('close', () => { win = null })
    win.loadURL(html)
  });
}

function createWindowDrag() {
  ipcMain.on('create-nobar-window-drag', (event, data) => {
    let win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      titleBarStyle: 'hidden',
    })
    win.on('close', () => { win = null })
    win.loadURL(draghtml)
  });
}

function createWindowTrans() {
  ipcMain.on('create-window-trans', (event, data) => {
    let win = new BrowserWindow({
      width: 800,
      height: 600,
      transparent: true,
      frame: false,
      titleBarStyle: 'hidden',
    })
    win.on('close', () => { win = null })
    win.loadURL(transhtml)
  });
}

function getSyncMsg() {
  ipcMain.on('sync-render', (event, data) => {
    console.log(data);
    event.sender.send('main-msg', '主进程收到了渲染进程的【异步】消息！')
  });
}

function getAsyncMsg() {
  ipcMain.on('async-render', (event, data) => {
    console.log(data);
    event.returnValue = '主进程收到了渲染进程的【同步】消息！';
  });
}

function sendMsg() {

  let i = 0;
  const mainWindow = BrowserWindow.fromId(global.mainId);
  ipcMain.on('start-msg', (event, data) => {
    console.log('开始定时向渲染进程发送消息！');
    global.sendMsg = true;
  });

  ipcMain.on('end-msg', (event, data) => {
    console.log('结束向渲染进程发送消息！');
    global.sendMsg = false;
  });

  setInterval(() => {
    if (global.sendMsg) {
      mainWindow.webContents.send('main-msg', `ConardLi【${i++}】`)
    }
  }, 200);

}


export default function handleMessage() {
  windowInit();
  windowClose();
  createWindow();
  createNoBarWindow();
  createNoBarWindowWithButton();
  createWindowDrag();
  createWindowTrans();
  getSyncMsg();
  getAsyncMsg();
  sendMsg();
}