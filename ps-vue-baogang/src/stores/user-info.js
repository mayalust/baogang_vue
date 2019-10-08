import loginNames from "../json/loginNames.json";
import loginNamesLocal from "../json/loginNamesLocal.json";
import singletonAjax from "../tools/ajax.js";
import baseConfig from "../../../localdb/info.json";
import util from "../tools/utils";
import { extend } from "ps-ultility";
const ajax = singletonAjax(),
  compareByIndex = (a, b) => {
    return a.index < b.index ? -1 : 1;
  },
  { TreeNode } = util;

function parse(str) {
  let rs;
  try {
    rs = JSON.parse(str);
  } catch (e) {
    return;
  }
  return rs;
}

function hasNoKey(obj) {
  for (let i in obj) {
    return false;
  }
  return true;
}

export default {
  namespaced: true,
  state: {
    loginNames,
    loginNamesLocal,
    baseConfig,
    mainIndex: -1,
    subIndex: -1,
    minorIndex: -1,
    showTree: 0,
    deviceOnly: 0,
    mainNavigators: [],
    subNavigators: [],
    minorNavigators: [],
    selectRoleId: 0,
    currentRoleValue: {},
    configs: {},
    user: {},
    rolesMap: {},
    functionMap: {},
    enterpriseConfig: {}
  },
  getters: {
    currentTab(state) {
      let { mainIndex, mainNavigators, subIndex, subNavigators, minorIndex, minorNavigators } = state;
      if (minorIndex != -1) {
        return minorNavigators[minorIndex]
      }
      if (subIndex != -1) {
        return subNavigators[subIndex];
      }
      return mainNavigators[mainIndex];
    },
    mainTab(state) {
      let { mainIndex, mainNavigators } = state;
      return mainNavigators[mainIndex];
    },
    loginNames(state) {
      let values =
        location.hostname == "localhost" ?
        state.loginNames.concat(state.loginNamesLocal) :
        state.loginNamesLocal;
      return values.map((d, i) => {
        d.id = i;
        return d;
      });
    },
    messageType(state) {
      let { configs } = state;
      if (configs["messageType"] == null) {
        return {};
      }
      let msgTypeArr = configs["messageType"];
      return msgTypeArr.reduce((a, b) => {
        let { value } = b,
        json = parse(value);
        return extend(a, json);
      }, {});
    },
    userName(state) {
      return state.user.userName || "";
    },
    subMenus(state) {
      let { functionMap, enterpriseConfig } = state;
      if (hasNoKey(enterpriseConfig)) {
        return {};
      }
      return functionMap["F01"];
    },
    mainMenus(state) {
      let rs = [],
        inx = 0,
        { functionMap, enterpriseConfig } = state;
      if (hasNoKey(enterpriseConfig)) {
        return [];
      }
      while (inx < 5) {
        let item = functionMap["F0" + inx];
        if (item) {
          rs.push(item);
        }
        inx++;
      }
      return rs;
    },
    enterPriseImage(state) {
      let { enterprise } = state.user;
      if (enterprise == null) {
        return;
      }
      return {
        "background-image": `url(${enterprise.enterpriseLogo}`
      };
    },
    currentRoles(state) {
      const { user, rolesMap } = state;
      if (user == null) {
        return [];
      }
      let { roleID } = user;
      if (roleID == null) {
        return [];
      }
      return roleID
        .split(",")
        .map(roleId => rolesMap[roleId])
        .filter(d => d);
    }
  },
  mutations: {
    setMainIndex(state, n) {
      state.mainIndex = n;
    },
    setSubIndex(state, n) {
      state.subIndex = n;
    },
    setMinorIndex(state, n) {
      state.minorIndex = n;
    },
    setRoleValue(state, n) {
      state.selectRoleId = n;
    },
    setCurrentRoleValue(state, n) {
      let { rolesMap, selectRoleId } = state, { values } = rolesMap[selectRoleId],
        json = parse(values);
      state.currentRoleValue = new TreeNode([json], compareByIndex);
    },
    setMainNavigators(state) {
      let { currentRoleValue } = state, { data } = currentRoleValue, { children } = data[0];
      state.mainNavigators = children;
    },
    setSubNavigators(state) {
      let { mainIndex, mainNavigators } = state, { children } = mainNavigators[mainIndex];
      state.subNavigators = children;
    },
    setMinorNavigators(state, n) {
      let { subIndex, subNavigators } = state, { children } = subNavigators[subIndex];
      state.minorNavigators = children;
    },
    setShowTree(state, n) {
      state.showTree = n;
    },
    setDeviceOnly(state, n) {
      state.deviceOnly = n;
    },
    queryEnterpriseRole(state, n) {
      state.rolesMap = n;
    },
    getCurrentUser(state, n) {
      const reduceNode = (d, callback, start) => {
          let queue = [d],
            item;
          while ((item = queue.shift())) {
            start = callback(start, item);
            if (item.function != null) {
              [].push.apply(queue, item.function);
            }
          }
          return start;
        },
        menus = reduceNode(
          n,
          (a, b) => {
            let { functionCode } = b;
            if (functionCode != null) {
              a[functionCode] = b;
            }
            return a;
          }, {}
        );
      state.selectRoleId = n.roleID.split(",")[0];
      state.functionMap = menus;
      state.user = n;
    },
    getAllConfigs(state, n) {
      let rs = n.reduce((a, b) => {
        a[b.groupName] = a[b.groupName] || [];
        a[b.groupName].push(b);
        return a;
      }, {});
      state.configs = rs;
    },
    getEnterpriseConfig(state) {
      let n = state.configs["EnterpriseConfig"],
        rs = n.reduce((a, b) => {
          let json = parse(b.value) || {};
          return extend(a, json);
        }, {});
      state.enterpriseConfig = rs;
    }
  },
  actions: {
    setDefaultNav({ commit, dispatch }) {
      dispatch("setMainIndexTo", 0);
    },
    setIndexTo({ dispatch, commit }, { mainIndex, subIndex, minorIndex, showTree, deviceOnly }) {
      commit("setShowTree", showTree);
      commit("setDeviceOnly", deviceOnly);
      if (mainIndex == null) {
        return;
      }
      commit("setMainIndex", mainIndex);

      commit("setSubNavigators");
      if (subIndex == null) {
        commit("setSubIndex", -1);
        commit("setMinorIndex", -1);
        return;
      }
      commit("setSubIndex", subIndex);
      commit("setMinorNavigators");
      if (minorIndex == null) {
        commit("setMinorIndex", -1);
        return;
      }
      commit("setMinorIndex", minorIndex);
      //commit("setCurrentTab");
    },
    setMainIndexTo({ commit, state }, val) {
      commit("setMainIndex", val);
      commit("setSubNavigators");
      let { subNavigators } = state;
      if (subNavigators.length == 0) {
        commit("setSubIndex", -1);
        //commit("setCurrentTab");
        return;
      }
      commit("setSubIndex", 0);
      commit("setMinorNavigators");
      let { minorNavigators } = state;
      if (minorNavigators.length == 0) {
        commit("setMinorIndex", -1);
        //commit("setCurrentTab");
        return;
      }
      commit("setMinorIndex", 0);
      //commit("setCurrentTab");
    },
    setSubIndexTo({ commit, state }, val) {
      commit("setSubIndex", val);
      commit("setMinorNavigators");
      let { minorNavigators } = state;
      if (minorNavigators.length == 0) {
        commit("setMinorIndex", -1);
        //commit("setCurrentTab");
      }
      commit("setMinorIndex", 0);
      //commit("setCurrentTab");
    },
    login({ commit }, param) {
      return ajax.post("userLoginUIService.login", param);
    },
    logout({ commit }) {
      return ajax.post("userLoginUIService.logout");
    },
    reLogin({ commit, dispatch }, param) {
      return dispatch("logout").then(d => {
        return dispatch("login", param);
      });
    },
    getCurrentUser({ commit }) {
      return ajax.post("userLoginUIService.getCurrentUser").then(d => {
        commit("getCurrentUser", d);
        return Promise.resolve(d);
      });
    },
    completeUserInfo({ dispatch, commit }) {
      return dispatch("EnterpriseConfig")
        .then(d => {
          return dispatch("queryEnterpriseRole");
        })
        .then(d => {
          commit("setCurrentRoleValue");
          commit("setMainNavigators");
        });
    },
    queryEnterpriseRole({ commit }) {
      return ajax.post("userEnterpriseService.queryEnterpriseRole").then(d => {
        commit(
          "queryEnterpriseRole",
          d.reduce((a, b) => {
            a[b["roleID"]] = b;
            return a;
          }, {})
        );
        return Promise.resolve(d);
      });
    },
    EnterpriseConfig({ commit }) {
      return ajax.post("configUIService.getAllConfigs").then(d => {
        commit("getAllConfigs", d);
        commit("getEnterpriseConfig");
        return Promise.resolve(d);
      });
    }
  }
};