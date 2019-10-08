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
      resourceInfo: ["getResourceById"],
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
    })
  },
  watch: {
    currentResourceId(val) {
      if (!val) {
        return;
      }
      this.getResourceById(val).then(resource => {
        let {
          values: {
            view: { viewId }
          }
        } = resource;
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