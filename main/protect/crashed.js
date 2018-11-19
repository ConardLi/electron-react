/**
 * 崩溃日志，崩溃重启
 */

import request from 'request';
import os from 'os';
import path from 'path';
import moment from 'moment';

const { app, BrowserWindow, crashReporter } = require('electron');
const basePath = global.__dirname;
const pkg = require(path.resolve(basePath, 'package.json'));

export default function () {
  const mainWindow = BrowserWindow.fromId(global.mainId);
  mainWindow.webContents.on('crashed', () => {
    crashplatformr(mainWindow);
  });
}

function crashplatform(mainWindow) {
  const build = pkg['build-config'];
  const { device } = global;
  const errorMessage = crashReporter.getLastCrashReport();
  console.log('errorMessage', errorMessage);
  const data = {
    pid: build.pid,
    appName: 'electron-react',
    platform: os.platform() === 'darwin' ? 'Mac' : 'Win',
    crashMsg: '程序崩潰',
    crashStack: errorMessage || '程序崩潰',
    deviceId: device.uuid,
    vid: build.vid,
    gid: device.gid,
    crashTime: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    udid: device.uuid
  };
  let logUrl = 'www.conardLi.com';
  const options = {
    method: 'POST',
    uri: logUrl,
    body: [data],
    json: true,
  }
  request(options, (err, response, body) => {
    console.log('crashplatform', body);
    reloadWindow(mainWindow);
  });
}


function reloadWindow(mainWin) {
  if (mainWin.isDestroyed()) {
    app.relaunch();
    app.exit(0);
  } else {
    BrowserWindow.getAllWindows().forEach((w) => {
      if (w.id !== mainWin.id) w.destroy();
    });
    mainWin.reload();
  }
}
