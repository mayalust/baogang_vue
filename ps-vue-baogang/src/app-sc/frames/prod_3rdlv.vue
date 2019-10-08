<template>
  <div class="bg">
    <section
      class="col-md-12 ng-scope"
      style="display: block;height: 100%;padding: 5px;"
    >
      <div class="nav nav-tabs ng-scope">
        <li
          v-for="(role, index) in minorNavigators"
          @click="click(role, index)"
          :key="role.value.id"
          :class="highlight(role.value, index)"
          style="cursor: pointer;"
        >
          <a v-text="role.value.label"> </a>
        </li>
      </div>
      <router-view />
    </section>
  </div>
</template>
<script>
import mapper from "../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  computed: {
    ...mapState({
      userInfo: ["minorNavigators", "minorIndex", "subIndex", "mainIndex"],
      resourceInfo: ["currentResourceId"]
    }),
    ...mapGetters({
      userInfo: ["mainTab"]
    })
  },
  methods: {
    click(role) {
      let { currentResourceId } = this;
      this.navigateToRole(role, {
        id: currentResourceId
      });
    },
    highlight(nav, index) {
      return index == this.minorIndex ? "active" : "";
    }
  }
};
</script>
<style lang="less" scoped>
</style>