import singletonAjax from "../tools/ajax.js";

const ajax = singletonAjax();
const KpiQuery = {
  "isRealTimeData": true,
  "includeInstance": true,
}
export default {
  namespaced: true,
  state: {
    treeResourceState: {}
  },
  getters: {},
  mutations: {
    setTreeResourceState(state, val) {
      state.treeResourceState = val;
    }
  },
  actions: {
    getTreeResourceState({ dispatch, commit }, ids) {
      return ajax.post("kpiDataFlexService.getKpiValueList", ["kpi", {
        nodeIds: ids,
        kpiCodes: [999999],
        isRealTimeData: true,
      }]).then(states => {
        commit("setTreeResourceState", states.reduce((a, b) => {
          a[b.nodeId] = b;
          return a;
        }, {}))
      })
    },
    getKpiValueList({ state }, obj) {
      let param = Object.assign({}, KpiQuery, obj);
      return ajax.post("kpiDataFlexService.getKpiValueList", ["kpi", param]).then(d => {
        return Promise.resolve(d.reduce((a, b) => {
          let { kpiCode, nodeId, instance } = b;
          a[nodeId] = a[nodeId] || {};
          a[nodeId][kpiCode] = a[nodeId][kpiCode] || {};
          if (instance == null) {
            a[nodeId][kpiCode]["_"] = b;
          } else {
            a[nodeId][kpiCode][instance] = b;
          }
          return a;
        }, {}));
      })
    }
  }
};