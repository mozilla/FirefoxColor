const path = require('path');
const webpack = require('webpack');
const packageJSON = require('./package.json');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: '[name].css'
});

module.exports = {
  entry: {
    'extension/background.js': './src/extension/background',
    'extension/content-script.js': './src/extension/content-script',
    'web/index.js': './src/web/index'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]'
  },
  devServer: {
    contentBase: 'build/web'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    extractSass,
    new HtmlWebpackPlugin({
      chunks: ['web/index.js'],
      template: './src/web/index.html.ejs',
      filename: 'web/index.html'
    }),
    new CopyWebpackPlugin([
      { from: 'LICENSE', to: './extension' },
      { from: './src/extension/manifest.json', to: './extension/' },
      { from: './src/extension/images/icon.svg', to: './extension/images/icon.svg' }
    ]),
    new WriteFilePlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [['env', { modules: false }], 'react'],
            plugins: ['transform-object-rest-spread']
          }
        }
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{ loader: 'css-loader' }, { loader: 'sass-loader' }],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(jpe?g|gif|png)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '/static/images/[name]-[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true
            }
          }
        ]
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 8192,
              hash: 'sha512',
              digest: 'hex',
              name: '/static/images/[name]-[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true
            }
          }
        ]
      }
    ]
  }
};
