const fs = require('fs-extra');
const path = require('path');
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
    attachPath,
    close: () => execSync(`hdiutil detach '${attachPath}'`),
  };
};

export default async (dmgPath, output) => {
  const { attachPath, close } = await dmgAttacher(dmgPath);
  const res = fs.readdirSync(attachPath);
  const appPath = path.resolve(attachPath, res.find(v => v.endsWith('.app')));
  execSync(`rm -Rf '${output}' && cp -Rf '${appPath}' '${output}'`);
  await close();
  spawn('open', [output], {
    detached: true,
  });
};
