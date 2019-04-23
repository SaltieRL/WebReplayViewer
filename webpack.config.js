const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "_bundles"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "",
    umdNamedDefine: true,
  },
  devServer: {
    contentBase: "./lib",
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: ["babel-loader", "awesome-typescript-loader"],
        exclude: /node_modules/,
        query: {
          declaration: false,
        },
      },
    ],
  },

  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.tsx?$/,
      }),
    ],
  },
}
