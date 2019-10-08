const WebpackBase = require("./webpack_base/webpack.base.config"),
  { origin } = require(`./js/services/service_factory`),
  __DEVELOPMENT__ = {
    devtool: "eval-source-map",
    mode: "development",
    ...WebpackBase,
    watch: true, // 开启监听文件更改，自动刷新
    watchOptions: {
      ignored: /node_modules/, //忽略不用监听变更的目录
      aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包
      poll: 1000 //每秒询问的文件变更的次数
    },
    devServer: {
      open: true,
      openPage: "./index.html",
      contentBase: "./",
      proxy: {
        "/api": {
          target: origin,
          security: false,
          changeOrigin: true
        },
        "/upload": {
          target: origin,
          security: false,
          changeOrigin: true
        }
      }
    }
  };
module.exports = __DEVELOPMENT__;