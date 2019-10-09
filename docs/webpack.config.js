const path = require("path"),
  webpack = require("webpack"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  AutoDllPlugin = require("autodll-webpack-plugin")

module.exports = {
  entry: {
    app: [path.resolve(__dirname, "src/index.tsx")],
    vendor: ["react", "react-dom"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "awesome-typescript-loader",
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
    new webpack.HotModuleReplacementPlugin(),
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundle to index.html
      filename: "[name].dll.js",
      entry: {
        vendor: ["react", "react-dom"],
      },
    }),
  ],
  devtool: "source-map"
}
