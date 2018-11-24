
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LessNpmImportPlugin = require('less-plugin-npm-import');

module.exports = () => {
  const loaders = [
    {
      test: /\.(png|jpg|gif|woff|woff2)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192,
          mimetype: 'application/font-woff',
        },
      }],
    }, {
      test: /\.(mp4|ogg)$/,
      loader: 'file-loader',
    }, {
      test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      }],
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      use: {
        loader: 'html-loader'
      }
    }, {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: {
        loader: 'ts-loader'
      }
    }
  ];
  if (process.env.NODE_ENV === 'production') {
    loaders.push({
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
        }],
      }),
      include: /node_modules/,
    });
    loaders.push({
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[hash:base64:5]',
          },
        }],
      }),
      exclude: /node_modules/,
    });
    loaders.push({
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
        },
        {
          loader: 'less-loader',
          options: {
            lessPlugins: [new LessNpmImportPlugin({ prefix: '~' })],
            data: process.env.NODE_ENV,
          },
        }],
      }),
    });
  } else {
    loaders.push({
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
      ],
      include: /node_modules/,
    });
    loaders.push({
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            sourcemap: true,
            modules: true,
            localIdentName: '[name]__[local]-[hash:base64:5]',
          },
        },
      ],
      exclude: /node_modules/,
    });
    loaders.push({
      test: /\.less$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      },
      {
        loader: 'less-loader',
        options: {
          lessPlugins: [new LessNpmImportPlugin({ prefix: '~' })],
          data: process.env.NODE_ENV,
        },
      }],
    });
  }
  return {
    rules: loaders,
  };
};
