const url = require('url');
const path = require('path');
const request = require('request');
const { dialog, app, ipcMain, BrowserWindow } = require('electron');
const installMac = require('./install/mac.js');
const installWin = require('./install/win.js');


const pkg = require(path.resolve(global.__dirname, 'package.json'));
const build = pkg['build-config'];

const getDateStr = () => {
  const now = new Date();
  return `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
};

const updateMac = async (filePath) => {
  if (process.platform === 'darwin') {
    await installMac(filePath);
  }

  if (process.platform === 'win32') {
    await installWin(filePath);
  }
};


const Updater = {
  CHECKING: false,
  DIS_CHECK_DATE: null,
  init() {
    Updater.checkUpdate(true);
    Updater.timer = setInterval(() => {
      Updater.checkUpdate(true);
    }, 5 * 60 * 1000);
  },

  handleError: (err, exit) => {
    dialog.showErrorBox('更新失败', err.message || String(err));
    exit && app.exit(0);
  },

  checkUpdate(silent, auto = true) {
    if (Updater.CHECKING) return Promise.resolve();
    const build = pkg['build-config'];
    build.gid = global.device.gid;
    const host = build.env === 'production' ? 'https://xxx-prod.com/' : 'http://xxx-beta.com/';
    const checkUrl = url.resolve(host, `/app/update/versionCheck?pid=${build.pid}&vid=${build.vid}&gid=${build.gid}`);
    return new Promise((resolve, reject) => {
      request(checkUrl, (err, response, body) => {
        Updater.CHECKING = false;
        if (err) return reject(new Error('网络异常，请稍后再试'));
        try {
          const res = JSON.parse(body);
          return resolve(res);
        } catch (error) {
          return reject(new Error('服务端异常，获取更新信息失败'));
        }
      });
    }).then(({ status, data, msg }) => {
      if (status !== 0) throw new Error(`${status} ${msg}`);
      return data;
    }).then((data) => {
      this.showUpdateDialog(data, silent);
    }).catch((e) => {
      if (!auto) dialog.showErrorBox('检查更新失败', e.message);
    });
  },

  showUpdateDialog(data, silent) {
    if (data) {
      if (!data.forceUpdate &&
        (silent && Updater.DIS_CHECK_DATE && Updater.DIS_CHECK_DATE === getDateStr())) return;
      Updater.showUpdateWindow(data);
    } else {
      Updater.CHECKING = false;
      if (!silent) {
        dialog.showMessageBox({
          type: 'info',
          buttons: ['确认'],
          message: '没有可更新版本',
          detail: '您当前已经是最新版本，无需更新',
        });
      }
    }
  },

  showUpdateWindow(data) {
    const { checksum: md5 } = data;

    const updateUrl = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'download.html'),
      slashes: true,
      query: data,
    });
    if (Updater.win) {
      Updater.win.webContents.send('autoUpdater-update', data);
      if (data.forceUpdate) {
        BrowserWindow.getAllWindows().forEach((w) => {
          const updateWinId = Updater.win && Updater.win.id;
          if (w.id !== updateWinId) w.destroy();
        });
      }
      return;
    }
    const win = new BrowserWindow({
      width: 270,
      height: 360,
      resizable: false,
      transparent: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      alwaysOnTop: true,
      frame: false,
      show: false,
      title: '自动更新',
      webPreferences: {
        webSecurity: build.env === 'production',
      },
    });
    Updater.win = win;
    if (data.forceUpdate) {
      BrowserWindow.getAllWindows().forEach((w) => {
        const updateWinId = Updater.win && Updater.win.id;
        if (w.id !== updateWinId) w.destroy();
      });
    }

    let downloaded = false;
    const cancel = () => {
      Updater.CHECKING = false;
      Updater.win = null;
      // Updater.handleError(new Error('更新被取消'), data.forceUpdate);
    };

    win.on('ready-to-show', () => {
      win.show();
    });

    win.loadURL(updateUrl);
    win.on('close', (e) => { if (downloaded) e.preventDefault(); });
    win.on('closed', () => {
      cancel();
      if (data.forceUpdate) {
        app.quit();
      }
    });
    ipcMain.removeAllListeners('autoUpdater-ignore');
    ipcMain.removeAllListeners('autoUpdater-downloaded');
    ipcMain.on('autoUpdater-ignore', () => {
      Updater.DIS_CHECK_DATE = getDateStr();
      win.close();
    });

    ipcMain.on('autoUpdater-downloaded', (event, err, filePath, hash) => {
      downloaded = true;
      win.removeListener('closed', cancel);
      if (err) return Updater.handleError(err);
      if (md5 !== hash) {
        return Updater.handleError(new Error('下载文件已损坏，请重新尝试'));
      }
      return updateMac(filePath).catch(Updater.handleError);
    });
  },
};

export default Updater;
