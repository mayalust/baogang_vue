import userInfo from "./stores/user-info.js";
import generalInfo from "./stores/general-info.js";
import resourceInfo from "./stores/resource-info.js";
import alertInfo from './stores/alert-info';
import kpiDataInfo from "./stores/kpi-data-info.js";
import dictsInfo from "./stores/dicts-info.js";
import viewInfo from "./stores/view-info.js";
export default {
  modules: {
    userInfo,
    generalInfo,
    resourceInfo,
    kpiDataInfo,
    dictsInfo,
    alertInfo,
    viewInfo
  }
};