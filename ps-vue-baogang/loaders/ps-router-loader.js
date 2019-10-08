const psFile = require("ps-file"),
  { parse } = require("querystring"),
  pathLib = require("path");
module.exports = function (source) {
  let { query } = this, { path } = parse(query.substring(1)),
    routerPath = pathLib.resolve(__dirname, `../src/${path}/router`),
    ins = psFile(routerPath),
    callback = this.async();
  ins
    .children(({ isDir }) => !isDir)
    .then(nodes => {
      let names = nodes
        .map((item) => {
          let { basename, path } = item,
          filename = path.split(routerPath)[1].split(".vue")[0].replace(/\\|\//g, '/'),
            rs = filename.substring(1).replace('@', '/').replace(/\[(.+)\]/g, '/:$1'),
            json;
          basename = basename.replace("@", "_").replace(/\[(.+)\]/g, '_$1');
          json = {
            name: basename,
            path: rs,
            filename
          }
          return `${JSON.stringify(json)}`
        })
        .join(","),
        codes = `export default [${names}]`;
      callback(null, codes);
    })
    .catch(e => {
      console.error(e);
    });
};