/* eslint import/no-extraneous-dependencies: off */

const webpack = require("webpack");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

const extractCSS = new ExtractTextPlugin({
  filename: "[name].css"
});

const defaultEnv = {
  NODE_ENV: "development",
  ADDON_URL: "addon.xpi",
  SITE_URL: "http://localhost:8080/"
};

const processEnv = {};
Object.keys(defaultEnv).forEach(key => {
  processEnv[key] = JSON.stringify(process.env[key] || defaultEnv[key]);
});

module.exports = {
  devtool: "source-map",
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
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [
              ["env", { targets: ["last 2 versions"], modules: false }],
              "react"
            ],
            plugins: ["transform-object-rest-spread"]
          }
        }
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
