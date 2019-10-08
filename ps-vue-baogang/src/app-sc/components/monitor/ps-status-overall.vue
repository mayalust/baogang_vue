<template>
  <div
    class="block"
    style="margin:0px 5px 5px 0;height:248px; overflow-y:auto;"
    v-loading="loading"
  >
    <h6>状态总览</h6>
    <ps-status-overall-unit
      v-for="domain in configData"
      :key="domain.id"
      :domain="domain"
      :col="col"
      :valueListMap="valueListMap"
    />
  </div>
</template>
<script>
import mapper from "../../../tools/mapper.js";
import PsStatusOverallUnit from "./ps-status-overall-unit";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  props: ["configData", "valueListMap", "col"],
  computed: {
    loading() {
      let { valueListMap } = this;
      return !this.hasKey(valueListMap);
    }
  },
  methods: {},
  components: {
    PsStatusOverallUnit
  }
};
</script>
<style lang="less" scoped>
.block {
  overflow: hidden;
}
</style>

