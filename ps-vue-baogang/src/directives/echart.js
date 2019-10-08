import echarts from "echarts";
import baogang from "../../../localdb/echartTheme/baogang.json";
export default {
  echarts: {
    bind(el, args, vnode) {
      let { value } = args, { context } = vnode;
      context.$nextTick(() => {
        context.$echartsInstance = echarts.init(el, baogang);
        if (value != null) {
          context.$echartsInstance.setOption(value, true);
        }
      })
    },
    update(el, args, vnode) {
      let { value } = args, { context } = vnode;
      context.$nextTick(() => {
        context.$echartsInstance.setOption(value, true);
      })
    },
    destroy(el, args, vnode) {
      context.$echartsInstance.dispose();
    }
  },
  echartsLoading(el, args, vnode) {
    let {
      context: {
        $echartsInstance,
        $root: {
          constructor
        }
      }
    } = vnode, { value } = args;
    if ($echartsInstance == null) {
      constructor.warn("$echartsInstance is not defined!")
    }
    if (value) {
      return $echartsInstance.showLoading();
    }
    $echartsInstance.hideLoading();
  }
}