<template>
  <section class="content">
    <div class="box">
      <nav-head :navigators="navigators" />
    </div>
  </section>
</template>
<script>
import mapper from "../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  data() {
    return {
      navigators: [
        {
          label: "用户管理",
          url: "usermanager",
          active: true
        },
        {
          label: "角色管理",
          url: "rolemanager"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      resourceInfo: ["currentResource"]
    })
  },
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