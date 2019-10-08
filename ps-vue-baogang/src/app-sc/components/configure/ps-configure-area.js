import mapper from "../../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  render() {
    let { configData, bottom, treeResourceState } = this,
      { cells, width, height, bgimage } = configData;
    cells = cells || [];
    return (
      <div
        class="baowu-global-bg"
        style={{
          "padding-bottom": bottom || "50%",
          "background-image": "url(" + bgimage + ")"
        }}
      >
        {cells
          .filter(data => {
            let {
              attrs: {
                text: { text }
              }
            } = data;
            return this.domains.some(({ id, label }) => {
              return text == label;
            });
          })
          .map(data => {
            let {
                position: { x, y },
                attrs: {
                  text: { text }
                }
              } = data,
              domain = this.domains.find(({ id, label }) => {
                return label == text;
              }),
              state =
                this.attribute(treeResourceState, [domain.id, "value"]) || 0;
            return (
              <div
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: (y / height) * 100 + "%",
                  left: (x / width) * 100 + "%"
                }}
                onClick={() => {
                  this.$emit("click", domain);
                }}
              >
                <svg
                  v-svg-marker={{ title: text, state }}
                  width="150"
                  height="150"
                  style={{
                    position: "absolute",
                    top: "-50px",
                    left: "-50px"
                  }}
                ></svg>
              </div>
            );
          })}
      </div>
    );
  },
  props: ["configData", "domains", "bottom"],
  computed: {
    ...mapState({
      kpiDataInfo: ["treeResourceState"]
    })
  }
};
