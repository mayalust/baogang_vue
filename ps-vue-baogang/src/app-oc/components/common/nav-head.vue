<template>
  <div class="box-header">
    <div class="box-tools pull-left nav-tabs-header">
      <ul class="nav nav-tabs" role="tablist">
        <li
          @click="navigateTo(nav.url)"
          :class="nav.active ? 'active' : ''"
          v-for="nav in navigators"
          :key="nav.url"
        >
          <a v-text="nav.label"></a>
        </li>
      </ul>
    </div>
    <div class="box-tools pull-right">
      <span class="history-btn ng-hide" onclick="window.history.back();"
        ><i class="proudsmart ps-back-01"></i
      ></span>
    </div>
  </div>
</template>
<script>
import mapper from "../../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  props: ["navigators"],
  methods: {
    navigateTo(name) {
      let {
        $route: { params }
      } = this;
      this.$router.push({
        name,
        params
      });
    }
  }
};
</script>
<style lang="less" scoped>
span {
  color: white;
}
</style>