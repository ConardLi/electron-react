const fs = require('fs-extra');
const path = require('path');
// const { shell } = require('electron');
// const util = require('util');

// const [, , dmgPath, output] = process.argv;

// const copy = util.promisify(fs.copy);
// const stat = util.promisify(fs.stat);
// const remove = util.promisify(fs.remove);
// const exec = util.promisify(require('child_process').exec);
const { execSync, spawn } = require('child_process');

// const rewritePath = [
//   'Contents/Info.plist',
//   'Contents/Resources/app/',
// ];


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

// const smartCopy = async (from, to) => {
//   // const st = await stat(to);
//   // if (st.isDirectory()) {
//   //   await remove(to);
//   //   await copy(from, to);
//   // } else {
//   //   await remove(to);
//   //   await copy(from, to);
//   // }
//   await remove(to);
//   await copy(from, to);
// };

export default async (dmgPath, output) => {
  // smartCopy(output);
  const { attachPath, close } = await dmgAttacher(dmgPath);
  const res = fs.readdirSync(attachPath);
  const appPath = path.resolve(attachPath, res.find(v => v.endsWith('.app')));
  // execSync(`rm -Rf '${output}' && cp -Rf '${appPath}' '${output}'`);
  execSync(`rm -Rf '${output}' && cp -Rf '${appPath}' '${output}'`);
  // // * 这里需要写入dmg文件内容，但是其实需要写入的东西不是很多，感觉可以处理一下
  // rewritePath.forEach((p) => {
  //   if (!fs.existsSync(path.join(appPath, p)) || !fs.existsSync(path.join(output, p))) {
  //     throw new Error(`路径不合法:\n${path.join(appPath, p)}\n${path.join(output, p)}`);
  //   }
  // });
  // rewritePath.forEach((p) => {
  //   const appP = path.join(appPath, p);
  //   const outP = path.join(output, p);
  //   execSync(`rm -Rf '${outP}' && cp -Rf '${appP}' '${outP}'`);
  // });
  // await Promise.all(rewritePath.map(p =>
  //   smartCopy(path.join(appPath, p), path.join(output, p))));
  await close();

  spawn('open', [output], {
    detached: true,
  });
};
