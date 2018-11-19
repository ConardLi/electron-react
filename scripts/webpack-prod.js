const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const { webpackConfig } = require('./base');
const getDefaultModules = require('./webpack-loader');


const config = Object.assign({}, webpackConfig, {
  entry: {
    index: path.join(process.cwd(), 'render/index'),
  },
  cache: false,
  devtool: false,
  module: getDefaultModules(),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'render/public/template/index.html',
      chunks: ['index'],
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

config.module.rules.push({
  test: /\.js$/,
  use: [
    'babel-loader',
    path.resolve(__dirname, './lazyLoader.js'),
  ],
  include: [
    path.join(process.cwd(), 'render'),
  ],
});

module.exports = config;
