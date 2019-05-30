const fs = require('fs-extra');
const path = require('path');
const { app } = require('electron');
const { execSync, spawn } = require('child_process');


const dmgAttacher = async (pathname) => {
  let attachPath = null;
  let res;
  try {
    res = execSync(`hdiutil attach '${pathname}'`).toString('utf8') || '';
  } catch (error) {
    throw new Error(`DMG Attacher: 装载失败[${pathname}]`);
  }
  res.split('\t').forEach((v) => {
    v = v.trim();
    if (v.startsWith('/Volumes/')) {
      attachPath = v;
    }
  });
  if (!attachPath) throw new Error('DMG Attacher: 未找到装载的app');
  return {
    appPath: path.join(attachPath, fs.readdirSync(attachPath).find(v => v.endsWith('.app'))),
    attachPath,
    close: () => execSync(`hdiutil detach '${attachPath}'`),
  };
};

const log = console.log; // eslint-disable-line

export default async (dmgPath) => {
  let output;
  if (process.env.NODE_ENV !== 'development') {
    output = path.resolve(app.getPath('exe'), '../../../');
  } else {
    output = path.resolve('/Applications/electron-react.app');
  }
  log('退出 electron-react-ScreenShot');
  try {
    execSync('killall electron-react-ScreenShot');
  } catch (error) {
    log('退出 electron-react-ScreenShot 失败，可能app未启动');
  }
  const { appPath, attachPath } = await dmgAttacher(dmgPath);

  log('开始安装');
  log(path.resolve(__dirname, 'mac_setup.js'));

  const subprocess = spawn('sh', [
    path.resolve(__dirname, 'mac_setup.sh'),
    attachPath,
    appPath,
    output,
  ], {
      detached: true,
      stdio: 'ignore',
    });
  subprocess.unref();

  log('退出当前进程');
  app.exit(0);
};
