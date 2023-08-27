import path from "node:path";
import { fileURLToPath } from "node:url";
import { ExcssPlugin } from "excss/webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
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
