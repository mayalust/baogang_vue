<template>
  <div class="steel" v-loading="showloading">
    <div class="wrap">
      <ul class="nav nav-tabs steelNavi">
        <li
          class="nav-item"
          v-for="(role, index) in mainNavigators"
          :class="highlight(role.value, index)"
          @click="click(role, index)"
          :key="role.value.id"
        >
          <a
            ><span style="margin-right: 3px;"></span
            ><span v-text="role.value.label"></span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import mapper from "../../../tools/mapper.js";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  computed: {
    ...mapState({
      userInfo: ["mainNavigators", "mainIndex"],
      resourceInfo: ["currentResource"]
    }),
    ...mapGetters({
      userInfo: ["mainTab"]
    }),
    showloading() {
      let list = this.mainNavigators;
      if (list == null) {
        return true;
      }
      return list.length == 0;
    }
  },
  methods: {
    ...mapActions({
      userInfo: ["setMainIndexTo"]
    }),
    click(role, index) {
      let {
        currentResource: { id }
      } = this;
      this.navigateToRole(role, { id });
    },
    highlight(role, index) {
      return this.mainIndex == index ? "active" : "";
    }
  }
};
</script>
<style lang="less" scoped>
.wrap {
  min-height: 56px;
  border-width: 2px 0px 0px;
  border-top-style: solid;
  border-right-style: initial;
  border-bottom-style: initial;
  border-left-style: initial;
  border-top-color: rgb(225, 191, 82);
  border-right-color: initial;
  border-bottom-color: initial;
  border-left-color: initial;
  border-image: initial;
  background: -webkit-linear-gradient(top, rgb(8, 39, 65), rgb(57, 100, 135));
  .nav-item {
    cursor: pointer;
  }
}
</style>

