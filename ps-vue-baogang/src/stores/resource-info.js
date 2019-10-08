import singletonAjax from "../tools/ajax.js";
import psUitl from "ps-ultility";
import utils from "../tools/utils";
const ajax = singletonAjax(),
  { extend } = psUitl,
  { TreeNode } = utils;

export default {
  namespaced: true,
  state: {
    currentResourceId: 0,
    currentResource: {},
    resources: {},
    attrs: {},
    models: {},
    resourcesMini: {},
    domainsMap: {},
    customersMap: {},
    projectsMap: {},
    rootResources: {},
    visibleMap: {},
    openMap: {}
  },
  getters: {
    childDevices(state) {
      let { resourcesMini, currentResourceId } = state,
      ids = [], has;
      for (let i in resourcesMini) {
        has = i;
      };
      if (!has || !currentResourceId) {
        return [];
      }
      for (let i in resourcesMini) {
        let { domains, id } = resourcesMini[i],
          parentId = domains
          .split("/")
          .filter(d => d)
          .slice(-1)[0];
        if (parentId == currentResourceId) {
          ids.push(id);
        }
      }
      return ids;
    },
    childProjects(state) {
      let { projectsMap, currentResourceId } = state,
      ids = [], has;
      for (let i in projectsMap) {
        has = i;
      };
      if (!has || !currentResourceId) {
        return [];
      }
      for (let i in projectsMap) {
        let { domains, id } = projectsMap[i],
          parentId = domains
          .split("/")
          .filter(d => d)
          .slice(-2)[0];
        if (parentId == currentResourceId) {
          ids.push(id);
        }
      }
      return ids;
    },
    childCustomers(state) {
      let { customersMap, currentResourceId } = state,
      ids = [], has;
      for (let i in customersMap) {
        has = i;
      };
      if (!has || !currentResourceId) {
        return [];
      }
      for (let i in customersMap) {
        let { domains, id } = customersMap[i],
          parentId = domains
          .split("/")
          .filter(d => d)
          .slice(-2)[0];
        if (parentId == currentResourceId) {
          ids.push(id);
        }
      }
      return ids;
    },
    childDomains(state) {
      let { domainsMap, currentResourceId } = state,
      ids = [], has;
      for (let i in domainsMap) {
        has = i;
      };
      if (!has || !currentResourceId) {
        return [];
      }
      for (let i in domainsMap) {
        let { domains, id } = domainsMap[i],
          parentId = domains
          .split("/")
          .filter(d => d)
          .slice(-2)[0];
        if (parentId == currentResourceId) {
          ids.push(id);
        }
      }
      return ids;
    },
  },
  mutations: {
    search(state, searchCondition) {
      let { rootResources } = state;
      if (typeof rootResources.open !== "function") {
        return;
      }
      state.visibleMap = rootResources.search(searchCondition);
      state.openMap = rootResources.open(searchCondition);
    },
    open(state, openCondition) {
      let { rootResources } = state;
      if (typeof rootResources.open !== "function") {
        return;
      }
      state.openMap = rootResources.open(openCondition);
    },
    setResource(state, [id, resource]) {
      state.resources[id] = resource;
    },
    setAttrs(state, [id, attrs]) {
      state.attrs[id] = attrs;
    },
    setCurrentResource(state, resource) {
      state.currentResource = resource;
    },
    setResourcesMini(state, resource) {
      let resMap = resource.reduce((a, b) => {
        a[b.id] = b;
        return a;
      }, {});
      state.resourcesMini = resMap;
    },
    setDomains(state, domains) {
      let domainsMap = domains.reduce((a, b) => {
        a[b.id] = b;
        return a;
      }, {});
      state.domainsMap = domainsMap;
    },
    setCustomers(state, customers) {
      let customersMap = customers.reduce((a, b) => {
        a[b.id] = b;
        return a;
      }, {});
      state.customersMap = customersMap;
    },
    setProjects(state, projects) {
      let projectsMap = projects.reduce((a, b) => {
        a[b.id] = b;
        return a;
      }, {});
      state.projectsMap = projectsMap;
    },
    setRootResource(state) {
      let { resourcesMini, domainsMap, projectsMap, customersMap } = state,
      roots = [], visibleMap = {}, openMap = {},
        all = extend({}, resourcesMini, domainsMap, projectsMap, customersMap),
        devMap = runDeviceExtQueue(resourcesMini);

      function cutString(str) {
        let arr = [str.substring(0, 6)];
        str = str.substring(6);
        while (str.length > 2) {
          arr.push(str.substring(0, 3));
          str = str.substring(3);
        }
        return arr;
      }

      function setValue(obj, paths, val) {
        let item,
          last = paths[paths.length - 1];
        paths = paths.slice(0, -1);
        while ((item = paths.shift())) {
          obj[item] = obj[item] || {};
          obj = obj[item];
        }
        obj[last] = val;
      }

      function getValue(obj, paths) {
        let item;
        while ((item = paths.shift())) {
          obj = obj[item];
          if (obj == null) {
            return;
          }
        }
        return obj;
      }

      function runDeviceExtQueue({ resourcesMini }) {
        let rs = {};
        for (let i in resourcesMini) {
          let item = resourcesMini[i],
            { externalDevId } = item,
            arr = cutString(externalDevId);
          setValue(rs, arr, item);
        }
        return rs;
      }

      function runDomainQueue(domains) {
        for (let i in domains) {
          let item = domains[i],
            parentID = item.domainPath
            .split("/")
            .filter(d => d)
            .slice(-2, -1)[0],
            fd = all[parentID];
          visibleMap[item.id] = true;
          openMap[item.id] = true;
          if (fd == null) {
            roots.push(item);
            continue;
          }
          fd.children = fd.children || [];
          fd.children.push(item);
        }
      }

      function runDeviceQueue(devices) {
        for (let i in devices) {
          let item = devices[i],
            { externalDevId } = item,
            parentID = item.domains
            .split("/")
            .filter(d => d)
            .slice(-1)[0],
            arr = cutString(externalDevId),
            fd = all[parentID] || getValue(devMap, arr);
          visibleMap[item.id] = true;
          openMap[item.id] = true;
          if (fd == null) {
            console.warn(item);
            continue;
          }
          fd.children = fd.children || [];
          fd.children.push(item);
        }
      }

      function sort(a, b) {
        let numberA = a.values && a.values.number,
          numberB = b.values && b.values.number,
          externalDevId1 = a.externalDevId,
          externalDevId2 = b.externalDevId,
          title1 = format(a.label),
          title2 = format(b.label);

        function addZero(num) {
          let rs = "";
          for (let i = 0; i < 9 - num.length; i++) {
            rs += "0";
          }
          return rs + num;
        }

        function format(str) {
          let rs = "",
            match;
          while ((match = /\d+/.exec(str))) {
            rs += str.slice(0, match.index) + addZero(match[0]);
            str = str.slice(match.index + match[0].length);
          }
          return rs + str;
        }
        if (externalDevId1 && externalDevId2) {
          externalDevId1 < externalDevId2 ? -1 : 1;
        }
        if (numberA != null || numberB != null) {
          if (numberB == null) {
            return 1
          }
          if (numberA == null) {
            return -1
          }
          return numberA < numberB ? -1 : 1;
        }
        return title1 < title2 ? -1 : 1;
      }

      runDomainQueue(domainsMap);
      runDomainQueue(projectsMap);
      runDomainQueue(customersMap);
      runDeviceQueue(resourcesMini);
      state.visibleMap = visibleMap;
      state.openMap = openMap;
      state.rootResources = new TreeNode(roots, sort);
    },
    setCurrentResourceId(state, id) {
      state.currentResourceId = id;
    },
    setResourceTreeLoaded(state, promise) {
      state.resourceTreeLoaded = promise;
    }
  },
  actions: {
    search({ commit }, searchCondition) {
      commit("search", searchCondition);
    },
    open({ commit }, openCondition) {
      commit("open", openCondition);
    },
    getResourceByIds({ commit, state }, ids) {
      let rs = {},
        left = [];
      const queue = ids => {
        let id = ids[0],
          rest = ids.slice(1),
          proms;
        if (state.resources[id] == null) {
          left.push(id);
          proms = Promise.resolve();
        } else if (state.resources[id] instanceof Promise) {
          proms = state.resources[id];
        } else {
          proms = Promise.resolve(state.resources[id]);
        }
        return proms.then(d => {
          if (d != null) {
            rs[d.id] = d;
          }
          return rest.length > 0 ? queue(rest) : Promise.resolve()
        })
      }
      return queue(ids).then(() => {
        let proms = ajax.post("resourceUIService.getResourceByIds", [left]).then(resources => {
          return Promise.all(resources.map(res => {
            rs[res.id] = res;
            commit("setResource", [res.id, res]);
            return Promise.resolve(res);
          }))
        });
        left.forEach(id => {
          commit("setResource", [id, proms]);
        })
        return proms
      }).then(() => {
        return Promise.resolve(ids.map(id => {
          return rs[id];
        }));
      })
    },
    getResourceById({ commit, dispatch, state }, id) {
      if (state.resources[id] == null) {
        commit("setResource", [
          id,
          ajax.post("resourceUIService.getResourceById", id)
        ]);
      }
      if (state.resources[id] instanceof Promise) {
        return state.resources[id].then(resource => {
          commit("setResource", [id, resource]);
          return Promise.resolve(resource);
        });
      }
      return state.resources[id];
    },
    getAttrsByModelId({ commit, dispatch, state }, modelId) {
      if (state.attrs[modelId] == null) {
        commit("setAttrs", [
          modelId,
          ajax.post("resourceUIService.getAttrsByModelId", modelId).then(attrs => {
            return Promise.resolve(attrs.reduce((a, b) => {
              a[b.name] = b;
              return a;
            }, {}))
          })
        ]);
      }
      if (state.attrs[modelId] instanceof Promise) {
        return state.attrs[modelId].then(attrs => {
          commit("setAttrs", [modelId, attrs]);
          return Promise.resolve(attrs);
        });
      }
      return state.attrs[modelId];
    },
    getCurrentResource({ state, commit, dispatch }) {
      let { currentResourceId } = state;
      return dispatch("getResourceById", currentResourceId)
    },
    setCurrentResource({ commit, dispatch }, id) {
      commit("setCurrentResourceId", id);
      return dispatch("getResourceById", id).then(resource => {
        commit("setCurrentResource", resource);
      });
    },
    getResourceByModelId({ commit, dispatch }, modelId) {
      return ajax.post("resourceUIService.getResourceByModelId", modelId);
    },
    getDeviceByCondition({ commit, dispatch }) {
      return ajax.post(
        "resourceUIService.getDevicesByCondition?includeFields=label,externalDevId,id,values.images,domains,modelId", {}
      );
    },
    getResourceTree({ state, commit, dispatch }) {
      let { resourceTreeLoaded } = state;
      if (resourceTreeLoaded == null) {
        commit("setResourceTreeLoaded", dispatch("getResourceByModelId", 300)
          .then(domains => {
            commit("setDomains", domains);
            return dispatch("getResourceByModelId", 301);
          })
          .then(customers => {
            commit("setCustomers", customers);
            return dispatch("getResourceByModelId", 302);
          })
          .then(projects => {
            commit("setProjects", projects);
            return dispatch("getDeviceByCondition");
          })
          .then(devices => {
            commit("setResourcesMini", devices);
            commit("setRootResource");
            let { resourcesMini, domainsMap, projectsMap, customersMap } = state,
            all = Object.assign({}, resourcesMini, domainsMap, projectsMap, customersMap);
            dispatch("kpiDataInfo/getTreeResourceState", Object.keys(all), {
              root: true
            });
            return Promise.resolve("success");
          }))
      }
      return state.resourceTreeLoaded;
    }
  }
};