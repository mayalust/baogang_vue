import mapper from "../../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  render() {
    let {
      bottom,
      configData: { bgimage }
    } = this;
    if (!this.hasKey(this.configData)) {
      return;
    }
    return (
      <div
        class="baowu-global-bg"
        style={{
          "padding-bottom": bottom || "65%",
          "background-image": "url(" + bgimage + ")"
        }}
      >
        <svg style="position:absolute;"></svg>
      </div>
    );
  },
  props: ["configData", "domains", "bottom"],
  computed: {
    ...mapState({
      resourceInfo: ["resourcesMini"],
      kpiDataInfo: ["treeResourceState"],
      dictsInfo: ["alertsClass"]
    })
  }
};
