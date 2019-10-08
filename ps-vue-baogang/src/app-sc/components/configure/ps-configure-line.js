import mapper from "../../../tools/mapper";
import { screenOffset } from "ps-ultility";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  render() {
    let { configData, bottom, treeResourceState, currentMouseoverId } = this,
      { cells, width, height, bgimage } = configData;
    const hasNeededLabel = text => {
      return ({ label }) => {
        let formatedText = text.trim().toLowerCase(),
          formatedLabel = label.trim().toLowerCase();
        return formatedLabel.indexOf(formatedText) != -1;
      };
    };
    cells = cells || [];
    return (
      <div
        ref="offsetParent"
        class="baowu-global-bg"
        style={{
          "padding-bottom": bottom || "65%",
          "background-image": "url(" + bgimage + ")"
        }}
      >
        <div
          ref="popper"
          class="popper-dropmenu"
          style={{
            position: "fixed",
            color: "white",
            cursor: "pointer",
            display:
              this.children && this.children.length > 0 ? "block" : "none",
            ...this.position
          }}
          onClick={({ currentTarget, target }) => {
            if (currentTarget == target) {
              this.$emit("click", { id: currentMouseoverId });
            }
          }}
          onMouseout={e => {
            let { currentTarget, toElement, fromElement } = e;
            if (currentTarget.contains(toElement)) {
              return;
            }
            this.currentMouseoverId = 0;
          }}
        >
          <ul class="popper-dropmenu-content">
            {this.children.map(child => {
              let { alertsClass } = this,
                { id } = child,
                { value } = this.treeResourceState[id] || {},
                cls = alertsClass[value] || alertsClass[0];

              return (
                <li
                  onClick={() => {
                    this.$emit("click", child);
                  }}
                >
                  <span class={"circle " + cls}></span>
                  {child.label}
                </li>
              );
            })}
          </ul>
        </div>

        <svg style={{ width: "100%", height: "100%", position: "absolute" }}>
          {cells
            .filter(data => {
              let {
                  attrs: {
                    text: { text }
                  }
                } = data,
                hasSome = this.domains.some(hasNeededLabel(text));
              if (!hasSome) {
                console.warn(text);
              }
              return hasSome;
            })
            .map(data => {
              let {
                  position: { x, y },
                  attrs: {
                    text: { text }
                  }
                } = data,
                domain = this.domains.find(hasNeededLabel(text)),
                state =
                  this.attribute(treeResourceState, [domain.id, "value"]) || 0;
              const mouseover = e => {
                  this.currentMouseoverId = domain.id;
                  let { offsetParent, popper } = this.$refs,
                    { clientWidth, clientHeight } = offsetParent,
                    { top, left } = screenOffset(offsetParent);
                  this.position = {
                    top: (y / height) * clientHeight + top + "px",
                    left: (x / width) * clientWidth + left + "px"
                  };
                  document.body.append(popper);
                },
                click = e => {
                  this.$emit("click", domain);
                };
              return (
                <g
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    transform:
                      "translate(" +
                      (x / width) * 100 +
                      "%," +
                      (y / height) * 100 +
                      "%)"
                  }}
                  v-svg-alert={{
                    label: text,
                    state,
                    mouseover,
                    click
                  }}
                ></g>
              );
            })}
        </svg>
      </div>
    );
  },
  data() {
    return {
      currentMouseoverId: 0,
      position: {
        top: 0,
        left: 0
      }
    };
  },
  props: ["configData", "domains", "bottom"],
  computed: {
    ...mapState({
      resourceInfo: ["resourcesMini"],
      kpiDataInfo: ["treeResourceState"],
      dictsInfo: ["alertsClass"]
    }),

    children() {
      let arr = [],
        { currentMouseoverId, resourcesMini } = this;
      if (currentMouseoverId == 0) {
        return [];
      }
      for (let i in resourcesMini) {
        let parentID = resourcesMini[i].domains
          .split("/")
          .filter(d => d)
          .pop();
        if (currentMouseoverId == parentID) {
          arr.push(resourcesMini[i]);
        }
      }
      return arr;
    }
  },
  beforeDestroy() {
    let { popper } = this.$refs;
    popper.remove();
  }
};
