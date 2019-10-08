<template>
  <div>
    <div>专业分析</div>
    <div v-text="currentResource.label"></div>
  </div>
</template>
<script>
import mapper from "../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  computed: {
    ...mapState({
      resourceInfo: ["currentResource"]
    })
  },
  methods: {
    click() {}
  }
};
</script>
<style lang="less" scoped>
span {
  color: white;
}
</style>

