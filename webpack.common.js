/* eslint import/no-extraneous-dependencies: off */
const path = require("path");
const url = require("url");

const webpack = require("webpack");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

const extractCSS = new ExtractTextPlugin({
  filename: "[name].css"
});

const UNOFFICIAL_SITE_IDS = ["local", "github"];

const nodeEnv = process.env.NODE_ENV || "production";
const sitePort = process.env.PORT || "8080";
const siteUrl = process.env.SITE_URL || `http://localhost:${sitePort}/`;
const siteId = process.env.SITE_ID || "";
const downloadFirefoxUtmSource =
  process.env.DOWNLOAD_FIREFOX_UTM_SOURCE || new url.URL(siteUrl).hostname;

const defaultEnv = {
  NODE_ENV: nodeEnv,
  ADDON_URL: "addon.xpi",
  SITE_URL: siteUrl,
  DOWNLOAD_FIREFOX_UTM_SOURCE: downloadFirefoxUtmSource,
  LOADER_DELAY_PERIOD: "2000"
};

const processEnv = {};
Object.keys(defaultEnv).forEach(key => {
  processEnv[key] = JSON.stringify(process.env[key] || defaultEnv[key]);
});

const commonBabelOptions = {
  cacheDirectory: true,
  presets: [["env", { targets: ["last 2 versions"], modules: false }], "react"],
  plugins: ["transform-object-rest-spread"]
};

const webpackConfig = {
  devtool: "source-map",
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  plugins: [
    extractCSS,
    new WriteFilePlugin(),
    new webpack.DefinePlugin({ "process.env": processEnv })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        oneOf: [
          {
            exclude: /node_modules/,
            loader: "babel-loader",
            options: commonBabelOptions
          },
          {
            include: [
              path.resolve(__dirname, "node_modules/testpilot-ga"),
              path.resolve(__dirname, "node_modules/query-string")
            ],
            loader: "babel-loader",
            options: commonBabelOptions
          }
        ]
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          use: [{ loader: "css-loader" }, { loader: "sass-loader" }],
          fallback: "style-loader"
        })
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: [{ loader: "css-loader" }],
          fallback: "style-loader"
        })
      },
      {
        test: /\.(ttf|woff|eot)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              hash: "sha512",
              digest: "hex",
              name: "fonts/[name]-[hash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              hash: "sha512",
              digest: "hex",
              name: "images/[name]-[hash].[ext]"
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true
            }
          }
        ]
      }
    ]
  }
};

module.exports = {
  UNOFFICIAL_SITE_IDS,
  sitePort,
  siteUrl,
  siteId,
  nodeEnv,
  webpackConfig
};
