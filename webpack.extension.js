const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: {
    background: './src/extension/background',
    contentScript: './src/extension/contentScript'
  },
  output: {
    path: path.resolve(__dirname, 'build/extension'),
    filename: '[name].js'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'LICENSE' },
      { from: './src/extension/manifest.json' },
      { from: './src/images', to: 'images' }
    ])
  ]
});
