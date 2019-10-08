import singletonAjax from "../tools/ajax.js";

const ajax = singletonAjax();
export default {
  namespaced: true,
  state: {
    alertsClass: ["alerts-normal", "alerts-normal", "alerts-minor", "alerts-major", "alerts-critical"],
    dictArr: [],
    dictObj: {},
  },
  getters: {},
  mutations: {
    setAllDicts(state) {
      let { dictArr, dictObj } = state;
      state.dictArr = [1212, 12222]
    }
  },
  actions: {
    getAllDicts({ state, commit, dispatch }) {
      return ajax.post('dictionaryService.getAllDicts', null).then(d => {
        commit("setAllDicts");
        return d.data;
      });
    }
  }
};