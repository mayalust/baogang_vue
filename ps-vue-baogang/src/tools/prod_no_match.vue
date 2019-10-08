<template>
  <div>
    <div>
      错误[404]:未找到指定路由所呈现的页面，请在src/router/下创建对应页面。
    </div>
  </div>
</template>
<script>
import mapper from "./mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {};
</script>
<style lang="less" scoped>
span {
  color: white;
}
</style>