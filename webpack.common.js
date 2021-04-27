/* eslint import/no-extraneous-dependencies: off */
const path = require("path");
const url = require("url");

const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

const nodeEnv = process.env.NODE_ENV || "production";
const siteHost = process.env.HOST || "localhost";
const sitePort = process.env.PORT || "8080";
const siteUrl = process.env.SITE_URL || `http://${siteHost}:${sitePort}/`;
const siteId = process.env.SITE_ID || "";
const downloadFirefoxUtmSource =
  process.env.DOWNLOAD_FIREFOX_UTM_SOURCE || new url.URL(siteUrl).hostname;
const isDev = nodeEnv === "development";

const defaultEnv = {
  NODE_ENV: nodeEnv,
  ADDON_URL: "https://addons.mozilla.org/firefox/addon/firefox-color/",
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
  presets: [
    [
      "@babel/preset-env",
      {
        targets: ["last 2 versions"],
        modules: false
      }
    ],
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-class-properties"
  ]
};

const webpackConfig = {
  devtool: "source-map",
  mode: isDev ? "development" : "production",
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  optimization: {
    splitChunks: {
      automaticNameDelimiter: "/",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: 0
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin(),
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
            include: [path.resolve(__dirname, "node_modules/query-string")],
            loader: "babel-loader",
            options: commonBabelOptions
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
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
  siteHost,
  sitePort,
  siteUrl,
  siteId,
  nodeEnv,
  webpackConfig
};
