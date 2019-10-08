import utils from "../tools/utils";
const { throttle } = utils;

function bind(target, fn) {
  return function () {
    return fn.apply(target, arguments);
  };
}
class Cover {
  constructor() {
    this.dom = document.createElement("div");
    this.style({
      width: "100%",
      height: "100%",
      position: "fixed",
      top: "0",
      left: "0",
      cursor: "col-resize",
      zIndex: 9999
    });
  }
  style(config) {
    for (let i in config) {
      this.dom.style[i] = config[i];
    }
  }
  add() {
    document.body.appendChild(this.dom);
  }
  remove() {
    this.dom.remove();
  }
  destroy() {
    this.remove();
    this.dom = null;
  }
}
class MoveBar {
  constructor(dom) {
    this.dom = dom;
    this.parent = dom.parentNode;
    this.cover = new Cover();
    this.parentSibling = this.parent.nextElementSibling;
    this.mousedownFn = bind(this, this.mousedown);
    this.mouseupFn = bind(this, this.mouseup);
    this.mousemoveFn = bind(this, throttle(this.mousemove, 30));
    dom.addEventListener("mousedown", this.mousedownFn);
  }
  mousedown(e) {
    this.cover.add();
    this.startMouseX = e.clientX;
    window.addEventListener("mousemove", this.mousemoveFn);
    window.addEventListener("mouseup", this.mouseupFn);
  }
  mouseup(e) {
    this.cover.remove();
    window.removeEventListener("mousemove", this.mousemoveFn);
    window.removeEventListener("mouseup", this.mouseupFn);
  }
  getMax() {
    let screenWidth =
      document.body.clientWidth || document.documentElement.clientWidth;
    return [screenWidth / 6 - 20, screenWidth / 6 + 200];
  }
  mousemove(e) {
    let { offsetX } = e;
    this.parent.style.width = (offsetX + 5) + "px";
  }
  destroy() {
    this.dom.addEventListener("mousedown", this.mousedownFn);
    window.removeEventListener("mousemove", this.mousemoveFn);
    window.removeEventListener("mouseup", this.mouseupFn);
    this.cover.destroy();
    this.parentSibling.style.width = "";
    this.parent.style.width = "";
    this.parentSibling = null;
    this.parent = null;
    this.cover = null;
    this.dom = null;
    this.mousedownFn = null;
    this.mousemoveFn = null;
    this.mouseupFn = null;
  }
}
export default {
  bind(el, args, vnode) {
    let { context } = vnode;
    context.$nextTick(() => {
      new MoveBar(el);
    });
  }
}