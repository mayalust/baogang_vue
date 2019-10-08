const
  htmlWebpackPlugin = require("html-webpack-plugin"),
  miniCssExtractPlugin = require("mini-css-extract-plugin"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin"),
  pathLib = require("path"),
  { VueLoaderPlugin } = require(`vue-loader`),
  __BaseConfig__ = {
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            chunks: "initial",
            name: "vendors",
            test: /[\\/]node_modules[\\/]/,
            priority: 1
          },
          commons: {
            chunks: "initial",
            name: "commons",
            minChunks: 3
          }
        }
      }
    },
    entry: {
      index: pathLib.resolve(__dirname, "../ps-vue-baogang/src/index.js"),
      login: pathLib.resolve(__dirname, "../ps-vue-baogang/src/login.js"),
      index_sc: pathLib.resolve(__dirname, "../ps-vue-baogang/src/app-sc/index.js"),
      index_oc: pathLib.resolve(__dirname, "../ps-vue-baogang/src/app-oc/index.js")
    },
    output: {
      path: pathLib.resolve(__dirname, "../ps-vue-baogang/build"),
      filename: "[name].js",
      chunkFilename: "[name].[hash:8].js"
    },
    plugins: [
      new htmlWebpackPlugin({
        filename: "index.html",
        template: "./ps-vue-baogang/src/index.html",
        chunks: ["index", "vendors", "commons"],
        inject: "body",
        hash: true
      }),
      new htmlWebpackPlugin({
        filename: "login.html",
        template: "./ps-vue-baogang/src/login.html",
        chunks: ["login", "vendors", "commons"],
        inject: "body",
        hash: true
      }),
      new htmlWebpackPlugin({
        filename: "index_sc.html",
        template: "./ps-vue-baogang/src/app-sc/index.html",
        chunks: ["index_sc", "vendors", "commons"],
        inject: "body",
        hash: true
      }),
      new htmlWebpackPlugin({
        filename: "index_oc.html",
        template: "./ps-vue-baogang/src/app-oc/index.html",
        chunks: ["index_oc", "vendors", "commons"],
        inject: "body",
        hash: true
      }),
      new VueLoaderPlugin(),
      new miniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[name].[hash:8].css"
      }),
      new CleanWebpackPlugin()
    ],
    module: {
      rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: "url-loader",
        options: {
          limit: 1000,
          name: "images/[name].[hash].[ext]"
        }
      },
      {
        test: /\.less$/,
        use: [miniCssExtractPlugin.loader, "css-loader", "less-loader"]
      },
      {
        test: /\.css$/,
        use: [miniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.jsx?$/,
        use: ["babel-loader"]
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"]
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader'
      }]
    },
    resolve: {
      extensions: [".js", ".jsx", ".vue"]
    }
  };
module.exports = __BaseConfig__;