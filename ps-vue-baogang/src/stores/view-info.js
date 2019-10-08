import singletonAjax from "../tools/ajax.js";

const ajax = singletonAjax();

function parse(str) {
  let rs;
  try {
    rs = JSON.parse(str);
  } catch (e) {
    return;
  }
  return rs;
}
export default {
  namespaced: true,
  state: {
    allViews: {}
  },
  getters: {},
  mutations: {
    setView(state, [id, value]) {
      let { content } = value,
      json = parse(content);
      value.content = json;
      state.allViews[id] = value;
    }
  },
  actions: {
    getViewById({ commit, dispatch, state }, id) {
      if (state.allViews[id] == null) {
        commit("setView", [
          id,
          ajax.post("viewFlexService.getViewById", id)
        ]);
      }
      if (state.allViews[id] instanceof Promise) {
        return state.allViews[id].then(view => {
          commit("setView", [id, view]);
          return Promise.resolve(view);
        });
      }
      return state.allViews[id];
    }
  }
};