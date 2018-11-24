const url = require('url');
const path = require('path');
const pkg = require(path.resolve(global.__dirname, 'package.json'));
const build = pkg['build-config'];

export default function () {
  if (build.env === 'production') {
    return url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, '..', 'render_process', `index.html`),
      slashes: true
    });
  }
  return url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, 'env/environment.html'),
    slashes: true,
    query: { debugger: build.env === "development" }
  });
}