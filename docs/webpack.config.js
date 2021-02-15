const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")

module.exports = {
  mode: "development",

  entry: {
    app: [path.resolve(__dirname, "src/index.tsx")],
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    pathinfo: true,
    filename: "static/js/[name].js",
    sourceMapFilename: "static/maps/[file].map[query]",
    chunkFilename: "static/js/[name].chunk.js",
    globalObject: "this",
  },

  devServer: {
    clientLogLevel: "debug",
    contentBase: path.join(__dirname, "public"),
    hot: true,
    inline: true,
    port: 4000,
    progress: true,
    publicPath: "/",
  },

  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },

  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    minimize: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "..", "node_modules"),
    ],
  },

  stats: {
    assetsSort: "chunks",
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    colors: true,
    entrypoints: false,
    excludeAssets: /\.map$/,
    hash: false,
    modules: false,
    timings: false,
    version: false,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.(glb|mtl|png|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {},
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
    }),
  ],

  devtool: "source-map",
}
