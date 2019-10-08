<template>
  <router-view />
</template>
<script>
import mapper from "../tools/mapper.js";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  computed: {
    ...mapState({
      userInfo: ["user", "currentRoleValue"]
    }),
    route() {
      const { user, currentRoleValue } = this;
      if (!this.hasKey(user) || !this.hasKey(currentRoleValue)) {
        return;
      }
      let { domainPath } = user,
        { data } = currentRoleValue,
        name = "device",
        id = this.$ps.getResourceIdfromDomainPath(domainPath),
        minorRole = data[0].firsts,
        { length } = minorRole;
      minorRole = minorRole[length - 1];
      this.navigateToRole(minorRole, {
        id
      });
    }
  },
  watch: {
    route(route) {
      this.$router.push(route);
    }
  }
};
</script>
<style lang="less" scoped>
span {
  color: red;
}
</style>