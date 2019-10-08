let a = new Array(11)
  .join(0)
  .split("")
  .map((d, i) => (i + 1 < 10 ? "0" + (i + 1) : "" + (i + 1)));
console.log(a);
//require("webpack-dev-server/bin/webpack-dev-server");