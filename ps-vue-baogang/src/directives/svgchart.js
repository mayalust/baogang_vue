import svgcharts from "../tools/svgcharts";
export default {
  bind(el, args, vnode) {
    let { value } = args, { context } = vnode;
    context.$nextTick(() => {
      svgcharts.init(el, value);
    })
  }
}