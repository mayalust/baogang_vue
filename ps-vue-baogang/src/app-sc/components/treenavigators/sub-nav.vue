<template>
  <table class="sub-nav-wrap">
    <sub-nav-item
      v-for="navigator in navigators"
      :navigator="navigator"
      :key="navigator.id"
      placement="bottom-start"
    ></sub-nav-item>
  </table>
</template>
<script>
import SubNavItem from "./sub-nav-item";
import mapper from "../../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  computed: {
    ...mapState({
      resourceInfo: ["currentResourceId", "rootResources"]
    }),
    navigators() {
      let { rootResources, currentResourceId } = this;
      if (!this.hasKey(rootResources) || currentResourceId == 0) {
        return [];
      }
      let current = rootResources.find(({ id }) => {
          return id == currentResourceId;
        }),
        parents = current.parents;
      return parents.concat([current]);
    }
  },
  components: {
    SubNavItem
  }
};
</script>
<style lang="less">
table.sub-nav-wrap {
  margin-left: 5px;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
</style>
