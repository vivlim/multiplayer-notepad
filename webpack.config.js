const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.json$/i,
        use: ["file-loader"],
      },
      {
          test: /\.html$/i,
          use: [
              {
                  loader: 'html-loader',
                  options: {
                      minimize: true,
                  },
              },
          ],
      },

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MonacoWebpackPlugin({
      publicPath: "./dist/",
    }),
    new CopyPlugin({
      patterns: [
        // Copy Shoelace assets to dist/shoelace
        {
          from: path.resolve(
            __dirname,
            "node_modules/@shoelace-style/shoelace/dist/assets"
          ),
          to: path.resolve(__dirname, "dist/shoelace/assets"),
        },
      ],
    }),
  ],
};
