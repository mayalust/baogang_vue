import vuepopper from "element-ui/src/utils/vue-popper";
import Clickoutside from "element-ui/src/utils/clickoutside";
export default {
  name: "TableButtonGroup",
  render(h) {
    let { $slots, show } = this,
    children = $slots.default;
    let displayChildren =
      children.length > 3 ?
      children
      .slice(0, 2)
      .concat(
        h("div", {
          attrs: {
            class: "btn btn-default",
          },
          ref: "reference",
          domProps: {
            innerText: "...更多"
          },
          on: {
            click: e => {
              e.stopPropagation();
              this.show = true;
              this.$nextTick(() => {
                this.createPopper();
              })
            }
          }
        })
      )
      .concat(
        show ? h("ul", {
          attrs: {
            class: "table-btn-group-drop"
          },
          ref: "popper",
          directives: [{
            name: "clickoutside",
            value: () => {
              //if use render function to generate you have to remove popperEle, popper manually
              setTimeout(() => {
                this.show = false;
                this.popperElm = null;
              }, 10);
            }
          }]
        }, children.slice(2).map(d => {
          return h("li", {
            on: {
              click: () => {
                let {
                  data: {
                    on: { click }
                  }
                } = d;
                click.call(this.$parent);
                this.popperElm = null;
                this.show = false;
              }
            }
          }, d.children)
        })) : []
      ) :
      children;
    return h(
      "div",
      {
        attrs: {
          class: "btn-group"
        }
      },
      displayChildren
    );
  },
  data() {
    return {
      show: false,
    }
  },
  directives: {
    Clickoutside
  },
  mixins: [vuepopper]
};