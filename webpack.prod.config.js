const WebpackBase = require("./webpack_base/webpack.base.config"),
  __DEVELOPMENT__ = {
    devtool: "source-map",
    mode: "production",
    ...WebpackBase,
    watch: false,
  };
module.exports = __DEVELOPMENT__;