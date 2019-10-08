<template>
  <div class="bg">
    <section
      class="col-md-12 ng-scope"
      style="display: block;height: 100%;padding: 5px;"
    >
      <div class="nav nav-tabs ng-scope">
        <li
          v-for="(role, index) in subNavigators"
          @click="click(role, index)"
          :key="role.value.id"
          :class="highlight(role.value, index)"
          style="cursor: pointer;"
        >
          <a v-text="role.value.label"> </a>
        </li>
      </div>
      <div class="block">
        <router-view />
      </div>
    </section>
  </div>
</template>
<script>
import mapper from "../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  computed: {
    ...mapState({
      userInfo: ["subNavigators", "subIndex", "mainIndex"],
      resourceInfo: ["currentResource"]
    }),
    ...mapGetters({
      userInfo: ["mainTab"]
    })
  },
  methods: {
    click(role) {
      let {
        currentResource: { id }
      } = this;
      this.navigateToRole(role, { id });
    },
    highlight(nav, index) {
      return index == this.subIndex ? "active" : "";
    }
  }
};
</script>
<style lang="less" scoped>
.bg {
  height: 100%;
  .block {
    height: calc(100% - 80px);
  }
}
</style>

