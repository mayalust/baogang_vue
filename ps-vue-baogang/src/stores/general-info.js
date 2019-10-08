import singletonAjax from "../tools/ajax.js";
const ajax = singletonAjax(),
  _APIS = {
    GET_UNREAD_MESSAGE: "psMessageService.queryMessageByStatusAndUserIDWithPage"
  }
export default {
  namespaced: true,
  state: {
    unreadMessages: [],
    unreadMessagesNum: 0
  },
  getters: {

  },
  mutations: {
    getUnreadMessage(state, { data, total }) {
      state.unreadMessages = data;
      state.unreadMessagesNum = total;
    }
  },
  actions: {
    getGeneralInfo({ commit, dispatch }) {
      return dispatch("getUnreadMessage")
    },
    getUnreadMessage({ commit }) {
      let param = [0, { "start": 0, "length": 10, "sortType": "DESC", "sort": "_id" }];
      return ajax.post(_APIS.GET_UNREAD_MESSAGE, param).then(d => {
        commit("getUnreadMessage", d);
        return Promise.resolve(d)
      })
    }
  }
};