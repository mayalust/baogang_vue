import { createNamespacedHelpers } from "vuex";
import { extend } from "ps-ultility";
class Mapper {
  constructor() {
    ["state", "getters", "mutations", "actions"].forEach(name => {
      name = "map" + name[0].toUpperCase() + name.substring(1);
      this[name] = function (moduleName, components) {
        let obj = {},
          rs = {};
        if (typeof moduleName == "string") {
          obj[moduleName] = components;
        } else {
          obj = moduleName;
        }
        for (let i in obj) {
          let helper = createNamespacedHelpers(i);
          extend(rs, helper[name](obj[i]));
        }
        return rs;
      }
    })
  }
}
export default new Mapper