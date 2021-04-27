/* eslint import/no-extraneous-dependencies: off */

const path = require("path");
const merge = require("webpack-merge");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const GenerateAssetWebpackPlugin = require("generate-asset-webpack-plugin");

const packageMeta = require("./package.json");
const {
  siteUrl,
  siteId,
  nodeEnv,
  webpackConfig
} = require("./webpack.common.js");

module.exports = merge(webpackConfig, {
  entry: {
    background: "./src/extension/background",
    contentScript: "./src/extension/contentScript"
  },
  output: {
    path: path.resolve(__dirname, "build/extension"),
    filename: "[name].js"
  },
  optimization: {
    minimize: false
  },
  node: {
    global: false
  },
  plugins: [
    new GenerateAssetWebpackPlugin({
      filename: "manifest.json",
      fn: buildManifest
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "LICENSE" },
        { from: "src/images/icon.svg", to: "images/" },
        { from: "src/images/logo.svg", to: "images/" }
      ]
    })
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

  const manifest = Object.assign(
    {},
    // HACK: Quick & dirty clone of extensionManifest to break references, so
    // that later modifications don't change the cached data from package.json
    JSON.parse(JSON.stringify(extensionManifest)),
    {
      manifest_version: 2,
      // HACK: Accept override in extensionManifest - npm disallows caps &
      // spaces, but we want them in an extension name
      name: extensionManifest.name || name,
      version,
      description,
      author,
      homepage_url: homepage
    }
  );

  let idSuffix = [];
  if (siteId) {
    idSuffix.push(siteId);
  }
  if (nodeEnv === "development") {
    idSuffix.push("dev");
  }
  if (idSuffix.length) {
    idSuffix = idSuffix.join("-");
    manifest.applications.gecko.id = manifest.applications.gecko.id.replace(
      "@",
      `-${idSuffix}@`
    );
    manifest.name = `${manifest.name} (${idSuffix})`;
  }

  // Configure content script to run on SITE_URL, omitting port if any
  manifest.content_scripts[0].matches = [
    `${siteUrl.replace(/:(\d+)\/?$/, "/")}*`
  ];

  return cb(null, JSON.stringify(manifest, null, "  "));
}
