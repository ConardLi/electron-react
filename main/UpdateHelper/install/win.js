const { app } = require('electron');

const { spawn } = require('child_process');

const log = console.log; // eslint-disable-line

export default async (exePath) => {
  log('开始安装');
  const subprocess = spawn(exePath, {
    detached: true,
    stdio: 'ignore',
  });
  subprocess.unref();

  log('退出当前进程');
  app.exit(0);
};
