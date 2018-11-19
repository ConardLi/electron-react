const fs = require('fs-extra');
const url = require('url');
const path = require('path');
const request = require('request');
const http = require('http');

let _cacheDIR = '/tmp/';

function isAbsolutePath(path_) {
  return path_ && path_[0] === '/';
}

function concatFilename(fname, i) {
  console.log(5, fname, i);
  const dir = isAbsolutePath(fname) ? '' : _cacheDIR;
  if (i === 0) {
    return path.join(dir, fname);
  }
  let sp = fname.split('.');
  if (sp.length === 0) {
    throw new Error('no fname');
  } else if (sp.length === 1) {
    return path.join(dir, `${fname}${i}`);
  } else {
    sp[sp.length - 2] += `(${i})`;
    return path.join(dir, sp.join('.'));
  }
}

function fsExists(pathname) {
  return new Promise((resolve, reject) => {
    fs.exists(pathname, (exists) => {
      exists ? resolve(true) : resolve(false);
    });
  });
}

async function uniqFilename(fname) {
  let pathname = '';
  for (let i = 0; ; i++) {
    console.log(3);
    pathname = concatFilename(fname, i);
    if (!await fsExists(pathname)) break;
  }
  return pathname;
}

function _request(uri) {
  let addr_ = url.parse(uri);
  let opt_ = {
    method: 'GET',
    hostname: addr_.hostname,
    port: addr_.port || 80,
    path: addr_.path,
    headers: {
      'Host': addr_.host
    },
    timeout: 30000,
  };

  return new Promise((resolve, reject) => {
    let req = http.request(opt_, (res) => {
      return resolve(res);
    });
    req.once('error', (err) => {
      return reject(err);
    });
    req.end();
  });
}

async function writeFile(info) {
  const {
    url: uri,
    name: fname,
    progress: progressCB
  } = info;

  let pathname = await uniqFilename(fname);
  let downloaded = 0;

  let stream = await createStream(pathname);

  const req = request.get(uri);
  console.log(5, req);
  let aborted = false;

  const ret = new Promise((resolve, reject) => {

    req.on('error', (err) => {
      return reject(err);
    });

    req.on('response', (res) => {
      if (res.statusCode !== 200) {
        const err = new Error('statusCode' + res.statusCode);
        err.response = res;
        return reject(err);
      }

      if (res.headers["content-length"] == null) {
        return reject(new Error('没有说明文件大小'));
      }

      const size = parseInt(res.headers["content-length"], 10);

      res.on('data', (trunk) => {
        if (!stream) return; //do nothing, just waiting
        stream.write(trunk);
        downloaded += trunk.length;
        progressCB && progressCB(size, downloaded);
      });

      res.on('end', () => {
        if (stream) {
          stream.end();
          stream = null;
        }

        return resolve({
          name: pathname,
        });
      });

      stream.once('error', (err) => {
        req.abort();
        return reject(new Error('磁盘故障'));
      });
    });
  })
    .catch(err => {
      if (stream) {
        stream.end();
        stream = null;
      }
      throw err;
    });

  return {
    promise: ret,
    abort: () => {
      aborted = true;
      req.abort.call(req);
    },
  };
}

///////////////////////utils///////////////////
function fsUnlink(pathname) {
  return new Promise((resolve, reject) => {
    fs.unlink(pathname, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function createStream(pathname) {
  fs.ensureDirSync(path.dirname(pathname));
  return new Promise((resolve, reject) => {
    fs.open(pathname, "w", function (e, fd) {
      if (e) {
        reject(e);
        return;
      }
      var stream = fs.createWriteStream(pathname, {
        flags: "w",
        fd: fd,
        encoding: null,
        mode: '0666'
      });
      resolve(stream);
      return;
    });
  });
}

function sleep(n) {
  return new Promise(A => setTimeout(A, n * 1000));
}

module.exports = writeFile;