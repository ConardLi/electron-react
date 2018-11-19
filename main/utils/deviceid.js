const getmac = require('getmac');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

global.device = {};

const setDevice = (uuid, mac) => {
  global.device.uuid = uuid;
  global.device.mac = mac || uuid.split('---')[0];
  if (process.platform === 'darwin') {
    global.device.gid = (global.device.mac || '').replace(/:/g, '');
  } else {
    global.device.gid = (global.device.mac || '');
  }
  console.log('gid:', global.device.gid);
};


let macAddress = null;

function getMac() {
  if (macAddress) return Promise.resolve(macAddress);
  return new Promise((resolve, reject) => {
    getmac.getMac((err, mac) => {
      if (err) return reject(err);
      macAddress = mac.toLowerCase();
      return resolve(macAddress);
    });
  });
}

const deviceFile = path.resolve(app.getPath('appData'), 'ELECTRON_REACT_DEVICE_UUID');
let uuid;
try {
  uuid = fs.readFileSync(deviceFile).toString('utf8');
} catch (error) {
  uuid = null;
}

// TODO: 从本地 storage 拉取 deviceId
exports.get = async () => {
  let rand;
  while (1) {
    rand = `${Math.random()}`;
    if (rand.length > 4) break;
  }
  return getMac()
    .then(mac => `${mac}---${rand.slice(2)}`)
    .catch(() => `${rand.slice(2)}`)
    .then(((uuid_) => {
      if (!uuid) {
        uuid = uuid_;
      }
      fs.writeFile(deviceFile, uuid);
      setDevice(uuid, macAddress);
      return uuid;
    }));
};


exports.getMac = getMac;

