import singletonAjax from "../tools/ajax.js";

const ajax = singletonAjax();
export default {
  namespaced: true,
  state: {
    alertList: [],
    alertTotal: 0
  },
  actions: {
    getAlertList ({commit}, parameter) {
      let param = [parameter, {start: 0, length: 500, statCount: true}];
      return ajax.post('alertQueryFlexService.getAlertByPage', param).then(d => {
        return d.data;
      });
    }
  }
};
