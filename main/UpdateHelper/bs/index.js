const path = require('path');
const util = require('util');


const exec = util.promisify(require('child_process').exec);

const bs = {
  bin: {
    diff: path.resolve(__dirname, './bsdiff'),
    patch: path.resolve(__dirname, './bspatch'),
  },
  diff: async (oldFile, newFile, patchFile) => {
    const { stderr } = await exec(`${bs.bin.diff} ${oldFile} ${newFile} ${patchFile}`);
    if (stderr) throw new Error(stderr);
  },
  patch: async (oldFile, newFile, patchFile) => {
    const { stderr } = await exec(`${bs.bin.patch} ${oldFile} ${newFile} ${patchFile}`);
    if (stderr) throw new Error(stderr);
  },
  do: async (oldApp, newApp) => {
    const oldFile = path.resolve('./old.zip');
    const newFile = path.resolve('./new.zip');
    const patchFile = path.resolve('./patchFile');

    await bs.diff(oldFile, newFile, patchFile);
    newApp;
  },
};

export default bs;
