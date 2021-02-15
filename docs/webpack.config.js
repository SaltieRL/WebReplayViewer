const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")

module.exports = {
  mode: "development",

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

  devServer: {
    clientLogLevel: "debug",
    contentBase: path.join(__dirname, "public"),
    hot: true,
    inline: true,
    port: 4000,
    progress: true,
    publicPath: "/",
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
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
