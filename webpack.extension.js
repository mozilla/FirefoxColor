const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const GenerateAssetWebpackPlugin = require('generate-asset-webpack-plugin');

const packageMeta = require('./package.json');
const common = require('./webpack.common.js');

const siteUrl = process.env.SITE_URL || 'http://localhost:8080/';

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
      { from: 'src/images/icon.svg', to: 'images/' }
    ])
  ]
});

function buildManifest(compilation, cb) {
  const {
    name,
    displayName,
    version,
    description,
    author,
    homepage,
    extensionManifest
  } = packageMeta;
  const manifest = Object.assign({}, extensionManifest, {
    manifest_version: 2,
    // HACK: Accept override in extensionManifest - npm disallows caps &
    // spaces, but we want them in an extension name
    name: extensionManifest.name || name,
    version,
    description,
    author,
    homepage_url: homepage,
  });
  
  // Configure content script to run against SITE_URL
  manifest.content_scripts[0].matches = [siteUrl + '*'];

  return cb(null, JSON.stringify(manifest, null, '  '));
}
