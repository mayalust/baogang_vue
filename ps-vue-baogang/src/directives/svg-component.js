import svgMarker from "../svg/marker";
import svbBarChart from "../svg/3dbar-chart";
import svgAlert from "../svg/alarm";
export default {
  SvgMarker: {
    bind(el, args, vnode) {
      let { value } = args, { context } = vnode;
      context.$nextTick(() => {
        el.ins = svgMarker.init(el, value);
        el.ins.setPos({
          x: 50,
          y: 50
        });
        el.ins.setAlarmStatus(value.state || 0);
      })
    },
    update(el, args, vnode) {
      let { value } = args;
      el.ins.setAlarmStatus(value.state || 0);
    }
  },
  SvgBarChart: {
    bind(el, args, vnode) {
      let {
        value: {
          label,
          value,
          state,
          onClick
        }
      } = args, { context } = vnode;
      context.$nextTick(() => {
        el.$svgBarChartIns = svbBarChart.init(el, {
          title: label
        });
        el.$svgBarChartIns.setValue(value);
        el.$svgBarChartIns.setAlarmStatus(state)
        el.$svgBarChartIns.on("click", onClick);
      })
    },
    update(el, args, vnode) {
      let {
        value: {
          value,
          state
        }
      } = args, { context } = vnode;
      el.$svgBarChartIns.setValue(value);
      el.$svgBarChartIns.setAlarmStatus(state)
    }
  },
  SvgAlert: {
    bind(el, args, vnode) {
      let {
        value: {
          label,
          state,
          click,
          mouseover
        }
      } = args, { context } = vnode;
      context.$nextTick(() => {
        el.$svgAlertIns = svgAlert.init(el, {
          title: label
        });
        el.$svgAlertIns.setAlarmStatus(state)
        el.$svgAlertIns.on("click", click);
        el.$svgAlertIns.on("mouseover", mouseover);
      })
    }
  }
}