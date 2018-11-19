/**
 * 开机自启  windows系统可用
 */

const WinReg = require('winreg');

const startOnBoot = {
  enableAutoStart: function (name, file, callback) {
    var key = getKey();
    key.set(name, WinReg.REG_SZ, file, callback || noop);
  },
  disableAutoStart: function (name, callback) {
    var key = getKey();
    key.remove(name, callback || noop);
  },
  getAutoStartValue: function (name, callback) {
    var key = getKey();
    key.get(name, function (error, result) {
      if (result) {
        callback(result.value);
      }
      else {
        callback(null, error);
      }
    });
  }
};

function noop() { }

const RUN_LOCATION = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run';
function getKey() {
  return new WinReg({
    hive: WinReg.HKCU, //CurrentUser,
    key: RUN_LOCATION
  });
}

export default function autoStart() {
  startOnBoot.getAutoStartValue('ELECTRON_REACT_AUTOSTART', function (value) {
    if (!value) {
      startOnBoot.enableAutoStart('ELECTRON_REACT_AUTOSTART', process.execPath, function () { console.log('开机自动启设置'); });
    }
  });
}
