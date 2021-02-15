const path = require("path")

module.exports = {
  mode: "production",
  devtool: "source-map",

  entry: {
    app: path.resolve(__dirname, "src/index.ts"),
  },

  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].bundle.js",
    library: "replay-viewer",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },

  externals: [
    {
      react: "react",
      "react-dom": "react-dom",
      "styled-components": "styled-components",
    },
    /three/,
    /@material-ui\/core\/.*/,
  ],

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  plugins: [],

  optimization: {
    minimize: true,
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

  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {},
        },
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(glb|mtl)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/models/draco",
              name() {
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
}
