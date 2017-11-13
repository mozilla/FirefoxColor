const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const GenerateAssetWebpackPlugin = require('generate-asset-webpack-plugin');

const packageMeta = require('./package.json');
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
    new GenerateAssetWebpackPlugin({
      filename: 'manifest.json',
      fn: buildManifest
    }),
    new CopyWebpackPlugin([
      { from: 'LICENSE' },
      // { from: './src/extension/manifest.json' },
      { from: './src/images', to: 'images' }
    ])
  ]
});

function buildManifest(compilation, cb) {
  const {
    name,
    version,
    description,
    author,
    homepage,
    extensionManifest
  } = packageMeta;
  console.log('dfooooo', packageMeta);
  const manifest = Object.assign({}, extensionManifest, {
    manifest_version: 2,
    name,
    version,
    description,
    author,
    homepage_url: homepage
  });
  return cb(null, JSON.stringify(manifest, null, '  '));
}
