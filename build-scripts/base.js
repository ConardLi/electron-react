/* eslint  global-require: 0 */
const path = require('path');

const cwd = process.cwd();
const Config = {
  PORT: 3000,
  webpackConfig: {
    target: 'electron',
    devtool: 'eval',
    output: {
      path: path.join(cwd, 'render_process'),
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        $component: path.resolve('./render', 'component'),
        $views: path.resolve('./render', 'views'),
        $utils: path.resolve('./render', 'utils'),
        $routes: path.resolve('./render', 'routes'),
        $public: path.resolve('./render', 'public'),
        $config: path.resolve('./render', 'config')
      },
    },
  },
};
module.exports = Config;
