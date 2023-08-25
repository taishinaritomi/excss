const path = require("node:path");
const { ExcssPlugin } = require("excss/webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "./src/index.tsx"),
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  performance: {
    hints: false,
  },
  devServer: {},
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              presets: [
                "@babel/preset-typescript",
                ["@babel/preset-react", { runtime: "automatic" }],
                ["@babel/preset-env", { targets: { browsers: "defaults" } }],
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new ExcssPlugin(),
    new HtmlWebpackPlugin({ template: path.join(__dirname, "index.html") }),
    new MiniCssExtractPlugin(),
  ],
};
