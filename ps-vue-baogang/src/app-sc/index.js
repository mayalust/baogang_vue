import main from "./main.vue";
import Vue from "vue";
import Vuex from "vuex";
import Router from 'vue-router';
import names from "../../loaders/ps-router-loader.js?path=app-sc!./routers.js";
import router from "./routers.js";
import ps from "../tools/proudsmart.js";
import ElSelect from "element-ui/lib/select";
import ElLoadings from "element-ui/lib/loading";
import ElOption from "element-ui/lib/option";
import ElScrollerbar from "element-ui/lib/scrollbar";
import proudsmartUi from "proudsmart-ui";
import store from "../store";
import PsConfigure from './components/configure/ps-configure';
import PsEcharts from "../directives/echart";
import Svgchart from "../directives/svgchart";
import SvgComps from "../directives/svg-component";

/** import css */

import "element-ui/lib/theme-chalk/index.css";
import "font-awesome/css/font-awesome.min.css";
import "../../../less/admin-lte/AdminLTE.less";
import "../../../css/proudsmart/index.css";
import "../../../less/admin-lte/skins/skin-blue.less";
import "../../../less/theme/steel.less";
import "../less/proudsmart.less";
import 'proudsmart-ui/lib/proudsmart-ui-css/themes/baowu/index.css';

/** import css */

const { ProudSmart } = ps, { Store } = Vuex,
[el] = document.getElementsByTagName("app-vue"), { use } = Vue,
  setComponents = obj => {
    for (let i in obj) {
      Vue.component(i, obj[i]);
    }
  },
  setDirectives = obj => {
    for (let i in obj) {
      Vue.directive(i, obj[i]);
    }
  },
  useGroup = function () {
    let args = [].slice.call(arguments);
    args.forEach(d => {
      use.call(Vue, d);
    })
  };
useGroup(
  ps,
  Router,
  Vuex,
  proudsmartUi,
  ElSelect,
  ElOption,
  ElLoadings,
  ElScrollerbar
);
setComponents({
  PsConfigure
})
setDirectives({
  ...PsEcharts,
  ...SvgComps,
  Svgchart
})
main.router = new Router(router(names));
main.ps = new ProudSmart();
main.store = new Store(store);
if (el == null) {
  throw new Error("html中没有<app-vue />标签请手动添加");
}
new Vue(main).$mount(el);