const fs = require('fs-extra');
const { app } = require('electron');
const path = require('path');
const { execSync } = require('child_process');


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

const [, , dmgPath, output] = process.argv;

const logs = [];

const log = (...args) => logs.push(args.join(' '));

(async () => {
  app.dock.hide();
  const { appPath, close: closeDmg } = await dmgAttacher(dmgPath);
  try {
    log(`rm -Rf '${output}' && cp -Rf '${appPath}' '${output}'`);
    execSync(`rm -Rf '${output}' && cp -Rf '${appPath}' '${output}'`);
  } catch (error) {
    log(error);
  }
  closeDmg();
  execSync(`open ${output}`);
  app.relaunch({
    execPath: output,
  });
})().then(app.exit(0));
