module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: `${__dirname}/dist`,
  },
  devServer: {
    contentBase: "./dist",
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
      },

      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ],
  },

  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
}
