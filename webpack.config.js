"use strict";

const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const dataObj = require("./data/data.json");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = {
//   mode: "development",
  mode: "production",
  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : false,
  },
  entry: ["./src/app.js"],
  output: {
    // path: path.resolve(__dirname, "./dist"),
    publicPath: "",
    // filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  resolve: {
    alias: {
      fonts: path.resolve(__dirname, "src/assets/fonts"),
    },
  },
  devServer: {
    static: path.join(__dirname, "public"),
    port: 9001,
    onBeforeSetupMiddleware: function (devServer) {
      if (!devServer) {
        throw new Error("webpack-dev-server is not yet set!");
      }

      devServer.app.get("/api/categories", function (req, res) {
        res.json(dataObj.categories);
      });

      devServer.app.get("/api/category/*", function (req, res) {
        res.json(dataObj.articles);
      });

      devServer.app.get("/api/author/*", function (req, res) {
        let author = {};
        const authorId = req.params["0"];

        for (let index = 0; index < dataObj.authors.length; index++) {
          if (dataObj.authors[index].id === authorId) {
            author = dataObj.authors[index];
            break;
          }
        }
        res.json(author);
      });

      devServer.app.get("/api/search/*", function (req, res) {
        res.json(dataObj.articles);
      });
    },
  },
};
