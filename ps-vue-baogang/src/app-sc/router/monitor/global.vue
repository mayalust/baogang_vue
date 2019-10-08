<template>
  <div class="row">
    <div class="col-md-7">
      <ps-configure-global
        :configData="domains"
        :valueListMap="valueListMap"
        @click="globalClick"
      />
    </div>
    <div class="col-md-5">
      <ps-status-overall :configData="domains" :valueListMap="valueListMap" />
      <ps-diagnose-sum :configData="domains" :valueListMap="valueListMap" />
      <ps-abnormal-handle :configData="domains" :valueListMap="valueListMap" />
    </div>
  </div>
</template>
<script>
import mapper from "../../../tools/mapper";
import PsConfigureGlobal from "../../components/configure/ps-configure-global";
import PsStatusOverall from "../../components/monitor/ps-status-overall";
import PsDiagnoseSum from "../../components/monitor/ps-diagnose-sum";
import PsAbnormalHandle from "../../components/monitor/ps-abnormal-handle";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  data() {
    return {
      domains: [],
      valueListMap: {}
    };
  },
  computed: {
    ...mapGetters({
      resourceInfo: ["childDomains"]
    })
  },
  methods: {
    ...mapActions({
      resourceInfo: ["getResourceByIds"],
      kpiDataInfo: ["getKpiValueList"]
    }),
    globalClick({ id }) {
      this.navigateToSelf({
        id
      });
    }
  },
  watch: {
    childDomains(ids) {
      if (ids.length == 0) {
        return;
      }
      let lngsstart = 72,
        lngswidth = 65,
        latsstart = 13.5,
        latswidth = 40,
        lngs = [lngsstart, lngsstart + lngswidth],
        lats = [latsstart, latsstart + latswidth];
      this.getKpiValueList({
        nodeIds: ids,
        kpiCodes: [3014, 6100, 7303, 7304, 7203, 7302]
      })
        .then(valueListMap => {
          this.valueListMap = valueListMap;
          return this.getResourceByIds(ids);
        })
        .then(domains => {
          domains.sort((a, b) => {
            let n1 = a.values.number,
              n2 = b.values.number;
            return n1 < n2 ? -1 : 1;
          });
          this.domains = domains.map(
            ({ id, description, label, values: { longitude, latitude } }) => {
              let x = ((longitude - lngs[0]) / (lngs[1] - lngs[0])) * 100,
                y = ((lats[1] - latitude) / (lats[1] - lats[0])) * 100;
              return {
                id,
                description,
                label,
                x,
                y
              };
            }
          );
        });
    }
  },
  components: {
    PsConfigureGlobal,
    PsStatusOverall,
    PsDiagnoseSum,
    PsAbnormalHandle
  }
};
</script>
<style lang="less" scoped>
span {
  color: white;
}
</style>