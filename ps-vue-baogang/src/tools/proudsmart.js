import Vue from "vue";
import singletonAjax from "../tools/ajax.js";
import psUtil from "ps-ultility";
import noMatch from "./prod_no_match";
import routersTemplate from '../app-sc/routers-template';
//import Configure from '../directives/configure';
const ajax = singletonAjax(),
  { extend } = psUtil,
  { createMainRouter, createLv1Router, createLv2Router } = routersTemplate
class ProudSmart {
  post(url, p) {
    return ajax.post(url, p);
  }
  login(username, pw) {
    return this.post("userLoginUIService.login", [username, pw])
  }
  getResourceIdfromDomainPath(domainPath) {
    return domainPath.split("/").filter(d => d).pop();
  }
  getMainTab(role) {
    let parent = role;
    while (parent.$level > 0) {
      parent = parent.$parent;
    }
    return parent;
  }
  getTabValue(tab) {
    let queue = [tab],
      item;
    while ((item = queue.shift())) {
      if (item.children && item.children.length > 0) {
        queue.push(item.children[0]);
      } else {
        return item
      }
    }
  }
}
const install = Vue => {
  //Vue.directive("Configure", Configure);
  Vue.mixin({
    beforeCreate: psInit
  });
  Vue.prototype.attribute = function (obj, path) {
    if (obj == null) {
      return;
    }
    let arr = typeof path == "string" ?
      path.split(new RegExp("[.\\/]")).filter(d => d) :
      path,
      item;
    while (item = arr.shift()) {
      obj = obj[item];
      if (obj == null) {
        return;
      }
    }
    return obj;
  }
  Vue.prototype.navigateToSelf = function (ext = {}, name) {
    let {
      $store: {
        getters
      },
      $router,
      $route: {
        params
      }
    } = this, currentTab = getters["userInfo/currentTab"];
    /** 如果提供组件名强行刷新 到当前标签 */
    if (name != null) {
      $router.push({
        name,
        params: Object.assign(params, ext)
      });
      return;
    }
    this.navigateToRole(currentTab, ext);
  }
  Vue.prototype.navigateTo = function navigateTo(condition, ext = {}) {
    let {
      $store: {
        state: {
          userInfo: {
            currentRoleValue
          }
        }
      }
    } = this, role;
    if (typeof condition == "string") {
      role = currentRoleValue.find((node) => {
        let { value: { label } } = node;
        return label == condition;
      });
    }
    if (typeof condition == "object") {
      role = currentRoleValue.attr(condition);
    }
    if (typeof condition == "function") {
      role = currentRoleValue.find(condition)
    }
    if (role == null) {
      return Vue.warn("role cannot be found, please check your condition");
    }
    this.navigateToRole(role);
  }
  Vue.prototype.navigateToRole = function navigateToRole(role, ext = {}, component = noMatch) {
    let { firsts } = role;
    firsts.shift();
    let prefix, id, { length } = firsts,
      { value: { name, viewId, vueRouter }, level } = firsts[length - 1],
      ctrlName = vueRouter || (viewId + "").split("prod_")[1] || "v" + viewId,
      {
        $router,
        $store: {
          dispatch
        }
      } = this,
      levels = ["mainIndex", "subIndex", "minorIndex"],
      mainTab = firsts[0],
      { value: { showTree, deviceOnly } } = mainTab,
      params = { showTree, deviceOnly, ...ext };
    params.showTree = params.showTree || 0;
    params.deviceOnly = params.deviceOnly || 0;
    const checkMainTabName = ({ value: { name } }) => {
        return name == "可视化管理" || name == "区域态势" || name == "综合趋势" || name == "实时状态"
      },
      onComplete = (e) => {

      },
      onAbort = (e) => {
        console.warn(`页面不变只刷新路由参数`);
      },
      makeSureResource = ({ id, deviceOnly }) => {
        return dispatch("resourceInfo/getResourceById", id).then(resource => {
          let { id, modelId } = resource;
          if (modelId < 1000 && deviceOnly == 1) {
            return dispatch("resourceInfo/getResourceTree").then(() => {
              let {
                $store: {
                  state: {
                    resourceInfo: {
                      rootResources
                    }
                  }
                }
              } = this, domain = rootResources.find(node => {
                  return node.id == id;
                }), { firsts } = domain,
                device = firsts[firsts.length - 1];
              return Promise.resolve(device.value);
            })
          }
          return Promise.resolve(resource)
        })
      },
      getCtrlName = (ctrlName, mainTab, { id, modelId, domainPath, domains, values }) => {
        if (checkMainTabName(mainTab)) {
          params.deviceOnly = 0;
          values = values || {};
          let domainsArr = (domainPath || domains).split("/").filter(d => d),
            arr = ["global", "area", "factory", "line", "product"]
          domainsArr.shift();
          let { length } = domainsArr;
          if (modelId == 302) {
            params.showTree = 1;
            return Promise.resolve(arr[length - 1]);
          }
          if (modelId < 1000) {
            params.showTree = 0;
            return Promise.resolve(arr[length - 1]);
          }
          params.showTree = 1;
          return dispatch("resourceInfo/getAttrsByModelId", modelId).then((attrs => {
            let { viewType } = attrs,
            sourceValue = viewType && viewType.sourceValue;
            return Promise.resolve(values.viewType || sourceValue || "device");
          }));
        }
        return Promise.resolve(ctrlName);
      };
    makeSureResource(params).then(resource => {
      params.id = resource.id;
      return getCtrlName(ctrlName, mainTab, resource)
    }).then(ctrlName => {
      firsts.forEach(({ level, index }) => {
        level--;
        params[levels[level]] = index;
        prefix = ["", "main2lv", "main3lv"][level];
      });
      let p = {
          name: prefix.length > 0 ? `${prefix}_${ctrlName}` : ctrlName,
          params: params
        },
        match = $router.resolve(p),
        { route: { matched } } = match;
      if (matched.length == 0) {
        let name = ctrlName,
          path = ctrlName,
          filename = ctrlName,
          para = { name, path, filename };
        if (level == 1) {
          $router.addRoutes([createMainRouter(para, component)]);
        } else if (level == 2) {
          $router.addRoutes([createLv1Router(para, component)]);
        } else if (level == 3) {
          $router.addRoutes([createLv2Router(para, component)]);
        }
      }
      $router.push(p, onComplete, onAbort);
    })
  }
  Vue.prototype.toObject = function toObject(arr, key = "id") {
    return arr.reduce((a, b) => {
      a[b[key]] = b;
    }, {})
  }
  Vue.prototype.hasKey = function hasKey(obj) {
    let i;
    for (i in obj) {
      return true;
    }
    return false;
  }
}

function psInit() {
  var options = this.$options;
  if (options.ps) {
    this.$ps = typeof options.ps === 'function' ?
      options.ps() :
      options.ps;
  } else if (options.parent && options.parent.$ps) {
    this.$ps = options.parent.$ps;
  }
}
export default {
  install: install,
  ProudSmart: ProudSmart,
  version: "1.0.0"
}