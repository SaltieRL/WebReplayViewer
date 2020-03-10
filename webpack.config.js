const path = require("path")

const PATHS = {
  entry: path.resolve(__dirname, "src/index.ts"),
  bundles: path.resolve(__dirname, "lib"),
  assets: "assets/models/draco",
}

module.exports = {
  mode: "production",
  entry: PATHS.entry,
  output: {
    path: PATHS.bundles,
    filename: "[name].bundle.js",
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
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {},
        },
      },
      {
        test: /\.(glb|mtl)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: PATHS.assets,
              name(file) {
                if (process.env.NODE_ENV === "development") {
                  return "[path][name].[ext]"
                }
                return "[name].[ext]"
              },
            },
          },
        ],
      },
    ],
  },
}
