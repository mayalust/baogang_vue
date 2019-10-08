import main from "./main.vue";
import Vue from "vue";
import Vuex from "vuex";
import Router from 'vue-router';
import names from "../../loaders/ps-router-loader.js?path=app-oc!./routers.js";
import vueRouterNames from "../../loaders/ps-router-loader.js?path=app-sc!./routers.js";
import router from "./routers.js";
import ps from "../tools/proudsmart.js";
import ElSelect from "element-ui/lib/select";
import ElLoadings from "element-ui/lib/loading";
import ElOption from "element-ui/lib/option";
import ElInput from "element-ui/lib/input";
import ElScrollerbar from "element-ui/lib/scrollbar";
import ElSwitch from "element-ui/lib/switch";
import proudsmartUi from "proudsmart-ui";
import store from "../store";
import userInfo from "./store/user-info";
import NavHead from "./components/common/nav-head";
import TablePagination from "./components/common/table-pagination";
import TablePageSize from "./components/common/table-page-size";
import TableButtonGroup from "./components/common/table-button-group.js";
import PsDialog from "./components/common/ps-dialog";
import PsTable from "./components/common/ps-table";
import ComponentsTreeDialog from "./dialog/components-tree-dialog.js";
import ComponentsTreeDialogButtons from "./dialog/components-tree-dialog-buttons.js";

/** import css */

import "element-ui/lib/theme-chalk/index.css";
import "font-awesome/css/font-awesome.min.css";
import "../../../less/admin-lte/AdminLTE.less";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/proudsmart/index.css";
import "../less/proudsmart.less";
import "../../../less/admin-lte/skins/skin-blue.less";
import "../../../less/theme/steel.less";
import 'proudsmart-ui/lib/proudsmart-ui-css/themes/baowu/index.css';
import "../../../css/proudsmart-webfont/font-proudsmart.css";

/** import css */

const { ProudSmart } = ps, { Store } = Vuex,
ext = { userInfo },
  [el] = document.getElementsByTagName("app-vue"), { use } = Vue,
  useGroup = function () {
    let args = [].slice.call(arguments);
    args.forEach(d => {
      use.call(Vue, d);
    })
  },
  setComponent = obj => {
    for (let i in obj) {
      Vue.component(i, obj[i]);
    }
  },
  extendStore = (store, ext) => {
    function extend(a, b) {
      for (let i in b) {
        a[i] = b[i]
      }
    }
    for (let i in store["modules"]) {
      for (let j in store["modules"][i]) {
        if (ext[i] == null) {
          continue
        }
        extend(store["modules"][i][j], ext[i][j]);
      }
    }
  }
useGroup(
  ps,
  Router,
  Vuex,
  proudsmartUi,
  ElSwitch,
  ElInput,
  ElSelect,
  ElOption,
  ElLoadings,
  ElScrollerbar
);
setComponent({
  NavHead,
  TablePagination,
  TablePageSize,
  TableButtonGroup,
  PsDialog,
  PsTable,
  ComponentsTreeDialog,
  ComponentsTreeDialogButtons
});
store.modules.fileInfo = {
  namespaced: true,
  state: {
    vueRouterNames
  }
}
extendStore(store, ext);
main.router = new Router(router(names));
main.ps = new ProudSmart();
main.store = new Store(store);
if (el == null) {
  throw new Error("<app-vue />is needed, please set one as root element");
}
new Vue(main).$mount(el);