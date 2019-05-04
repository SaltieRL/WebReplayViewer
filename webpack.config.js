const path = require("path")

const PATHS = {
  entry: path.resolve(__dirname, "src/index.ts"),
  bundles: path.resolve(__dirname, "lib"),
}

module.exports = {
  mode: "production",
  entry: PATHS.entry,
  output: {
    path: PATHS.bundles,
    filename: "index.js",
    libraryTarget: "umd",
    library: "ReplayViewer",
    umdNamedDefine: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  devtool: "source-map",
  plugins: [],
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /node_modules/,
        query: {
          declaration: false,
        },
      },
    ],
  },
}
