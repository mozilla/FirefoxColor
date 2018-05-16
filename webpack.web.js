/* eslint import/no-extraneous-dependencies: off */

const path = require("path");
const merge = require("webpack-merge");
const { exec } = require("child_process");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const GenerateAssetWebpackPlugin = require("generate-asset-webpack-plugin");

const packageMeta = require("./package.json");
const common = require("./webpack.common.js");

module.exports = merge(common.webpackConfig, {
  entry: {
    index: "./src/web/index"
  },
  devServer: {
    contentBase: path.join(__dirname, "build/web"),
    port: common.sitePort
  },
  output: {
    path: path.resolve(__dirname, "build/web"),
    filename: "[name].js"
  },
  plugins: [
    new GenerateAssetWebpackPlugin({
      filename: "__version__",
      fn: buildVersionJSON
    }),
    new HtmlWebpackPlugin({
      template: "./src/web/index.html.ejs",
      filename: "index.html",
      chunks: ["index"],
      ogImage: `${common.siteUrl}images/color-fb.jpg`,
      twitterImage: `${common.siteUrl}images/color-twitter.jpg`,
      title: packageMeta.title,
      description: packageMeta.description,
      homepage: packageMeta.homepage
    }),
    new CopyWebpackPlugin([
      { from: "./src/images", to: "images" },
      // FIXME: Bundling this in webpack causes it to fail, just copy for now
      { from: "./node_modules/json-url/dist/browser", to: "vendor" }
    ])
  ]
});

function buildVersionJSON(compilation, cb) {
  exec("git --no-pager log --format=format:\"%H\" -1", (err, stdout, stderr) => {
    cb(null, JSON.stringify({
      commit: err ? "" : stdout,
      version: packageMeta.version,
      source: `https://github.com/${packageMeta.repository}`
    }, null, "  "));
  });
}
