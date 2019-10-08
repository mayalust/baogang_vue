//import psSvgBar from "../../../svg/ps-svg-bar.js";
import mapper from "../../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  render() {
    let { configData, treeResourceState, valueListMap } = this;
    configData = configData || [];
    return (
      <div class="baowu-global-bg">
        <svg style={{ position: "absolute", width: "100%", height: "100%" }}>
          {configData.map(data => {
            let { x, y, label, id } = data,
              state = this.attribute(treeResourceState, [id, "value"]) || 0,
              value = this.attribute(valueListMap, [id, 3014, "value"]) || 0,
              onClick = e => {
                this.$emit("click", data);
              };
            return (
              <g
                style={{
                  transform: `translate(${x + "%"},${y + "%"})`
                }}
                v-svg-bar-chart={{
                  label,
                  state: state,
                  value,
                  onClick
                }}
              ></g>
            );
          })}
        </svg>
      </div>
    );
  },
  props: ["configData", "valueListMap"],
  computed: {
    ...mapState({
      kpiDataInfo: ["treeResourceState"]
    })
  }
};
