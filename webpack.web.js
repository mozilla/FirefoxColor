const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: {
    index: './src/web/index'
  },
  output: {
    path: path.resolve(__dirname, 'build/web'),
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/web/index.html.ejs',
      filename: 'index.html',
      chunks: ['index']
    }),
    new CopyWebpackPlugin([
      { from: './src/images', to: 'images' }
    ])
  ]
});
