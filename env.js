const envList = ["moke", "beta", "development", "production"];

exports.envList = envList;

const urlBeta = 'https://wwww.xxx-beta.com';

const urlDev = 'https://wwww.xxx-dev.com';

const urlProp = 'https://wwww.xxx-prop.com';

const urlMoke = 'https://wwww.xxx-moke.com';

const path = require('path');

const pkg = require(path.resolve(global.__dirname, 'package.json'));

const build = pkg['build-config'];

exports.handleEnv = {
  build,
  currentEnv: 'moke',
  setEnv: function (env) {
    this.currentEnv = env
  },
  getUrl: function () {
    console.log('env:', build.env);
    if (build.env === 'production' || this.currentEnv === 'production') {
      return urlProp;
    } else if (this.currentEnv === 'moke') {
      return urlMoke;
    } else if (this.currentEnv === 'development') {
      return urlDev;
    } else if (this.currentEnv === "beta") {
      return urlBeta;
    }
  },
  isDebugger: function () {
    return build.env === 'development'
  }
}
