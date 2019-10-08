export default {
  actions: {
    setDefaultNav({ commit, dispatch }) {
      dispatch("setMainIndexTo", 0);
    },
    setIndexTo({ dispatch, commit }, { mainIndex, subIndex }) {
      if (mainIndex == null) {
        return;
      }
      commit("setMainIndex", mainIndex);
      if (subIndex != null) {
        commit("setSubIndex", subIndex);
      }
    }
  }
};