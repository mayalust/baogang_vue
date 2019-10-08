import Popper from "element-ui/src/utils/popper";
import PsModal from "./ps-modal";
import psUtil from "ps-ultility";
const pm = "@proppers_map",
  { extend } = psUtil,
  _Default = {
    placement: "bottom-start"
  };
export default {
  methods: {
    drop(referenceElm, PsPopperContent, options = {}, data = {}, close = () => {}) {
      this[pm] = this[pm] || new Map;
      let popperIns = this[pm].get(referenceElm);
      if (popperIns == null) {
        let popperElm = document.createElement("div"),
          base = this.$root.constructor,
          sub = base.extend({
            parent: this,
            components: {
              PsPopperContent
            }
          });
        document.body.appendChild(popperElm);
        PsModal.mixins = [{
          methods: {
            close
          },
          provide() {
            return { close: this.close }
          },
          propsData: { data }
        }];
        popperIns = new sub(PsModal);
        popperIns.$mount(popperElm);

        popperIns.show = true;
        this[pm].set(referenceElm, popperIns);
        this.$nextTick(() => {
          popperIns.popperJs = new Popper(referenceElm, popperIns.$el, extend(_Default, options));
        })
      } else {
        popperIns.show = true;
        this.$nextTick(() => {
          popperIns.popperJs.update();
        })
      }
    }
  }
};