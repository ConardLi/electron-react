/* eslint no-console:0 global-require: 0 */

const webpack = require('webpack');
const path = require('path');
const express = require('express');
const webpackConfig = require('./webpack-dev.js');
const { PORT } = require('./base.js');

const app = express();
// app.use(express.static(path.join(process.cwd(), '/assets')));
// app.use(express.static(path.join(process.cwd(), '/public')));
app.use(express.static(path.join(process.cwd(), '/render/public')));
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

const compiler = webpack(webpackConfig);
app.use(require('webpack-dev-middleware')(compiler, webpackConfig.devServer));
app.use(require('webpack-hot-middleware')(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
}));

app.listen(PORT);

webpackConfig.devServer.setup();
