<template>
  <div class="row">
    <div class="col-md-7">
      <div class="block">
        <ps-configure
          :configData="configData"
          :domains="domains"
          @click="globalClick"
        />
      </div>
    </div>
    <div class="col-md-5"></div>
  </div>
</template>
<script>
import mapper from "../../../tools/mapper";
import PsConfigure from "../../components/configure/ps-configure";
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
      resourceInfo: ["childDevices"]
    }),
    initData() {
      let { childDevices, currentResourceId } = this;
      if (!childDevices || childDevices.length == 0 || !currentResourceId) {
        return;
      }
      return { childDevices, currentResourceId };
    }
  },
  watch: {
    initData(val) {
      if (val == null) {
        return;
      }
      let { childDevices, currentResourceId } = val,
        ids = [currentResourceId].concat(childDevices);
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
    PsConfigure
  }
};
</script>
<style lang="less" scoped>
</style>