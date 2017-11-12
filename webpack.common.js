const path = require('path');
const webpack = require('webpack');
const packageJSON = require('./package.json');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: '[name].css'
});

module.exports = {
  devServer: {
    contentBase: 'build'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    extractCSS,
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
            presets: [
              ['env', { targets: ['last 2 versions'], modules: false }],
              'react'
            ],
            plugins: ['transform-object-rest-spread']
          }
        }
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          use: [{ loader: 'css-loader' }, { loader: 'sass-loader' }],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: [{ loader: 'css-loader' }],
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
              name: 'images/[name]-[hash].[ext]'
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
              name: 'images/[name]-[hash].[ext]'
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
