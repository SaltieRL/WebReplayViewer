const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin")

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
        loader: "ts-loader",
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
  devServer: {
    static: {
      directory: __dirname,
    },
    compress: true,
    port: 4000,
  },
}
