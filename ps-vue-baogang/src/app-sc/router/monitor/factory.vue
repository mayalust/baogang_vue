<template>
  <div class="row">
    <div class="col-md-8">
      <ps-configure-area
        :configData="configData"
        :domains="domains"
        bottom="45%"
        @click="globalClick"
      />
    </div>
    <div class="col-md-4">
      <ps-status-overall
        :configData="domains"
        :valueListMap="valueListMap"
        col="3"
      />
      <ps-diagnose-sum :configData="domains" :valueListMap="valueListMap" />
      <ps-abnormal-handle
        :configData="domains"
        :valueListMap="valueListMap"
        col="3"
      />
    </div>
  </div>
</template>
<script>
import mapper from "../../../tools/mapper";
import PsConfigureArea from "../../components/configure/ps-configure-area";
import PsStatusOverall from "../../components/monitor/ps-status-overall";
import PsDiagnoseSum from "../../components/monitor/ps-diagnose-sum";
import PsAbnormalHandle from "../../components/monitor/ps-abnormal-handle";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  data() {
    return {
      domains: [],
      domainsMap: {},
      configData: {},
      valueListMap: {}
    };
  },
  methods: {
    ...mapActions({
      resourceInfo: ["getResourceByIds"],
      viewInfo: ["getViewById"],
      kpiDataInfo: ["getKpiValueList"]
    }),
    globalClick({ id }) {
      this.navigateToSelf({
        id
      });
    }
  },
  computed: {
    ...mapState({
      resourceInfo: ["currentResourceId"]
    }),
    ...mapGetters({
      resourceInfo: ["childCustomers"]
    }),
    initData() {
      let { childCustomers, currentResourceId } = this;
      if (!childCustomers || childCustomers.length == 0 || !currentResourceId) {
        return;
      }
      return { childCustomers, currentResourceId };
    }
  },
  watch: {
    initData(val) {
      if (val == null) {
        return;
      }
      let { childCustomers, currentResourceId } = val,
        ids = [currentResourceId].concat(childCustomers);
      this.getKpiValueList({
        nodeIds: ids,
        kpiCodes: [6100, 7303, 7304, 7203, 7302]
      })
        .then(valueListMap => {
          this.valueListMap = valueListMap;
          return this.getResourceByIds(ids);
        })
        .then(domains => {
          let {
            values: {
              view: { viewId }
            }
          } = domains.shift();
          domains.sort((a, b) => {
            let n1 = a.values.number,
              n2 = b.values.number;
            return n1 < n2 ? -1 : 1;
          });
          this.domains = domains;
          this.domainsMap = domains.reduce((a, b) => {
            if (b && b.id) {
              a[b.id] = b;
            }
            return a;
          }, {});
          this.getViewById(viewId).then(({ content }) => {
            this.configData = content;
          });
        });
    }
  },
  components: {
    PsConfigureArea,
    PsStatusOverall,
    PsDiagnoseSum,
    PsAbnormalHandle
  }
};
</script>
<style lang="less" scoped>
</style>

