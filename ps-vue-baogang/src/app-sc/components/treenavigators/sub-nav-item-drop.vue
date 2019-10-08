<template>
  <el-scrollbar
    tag="ul"
    wrap-class="sub-nav-item-drop-wrap"
    view-class="sub-nav-item-drop"
  >
    <li
      v-for="brother in brothers"
      @click="click(brother)"
      :key="brother.value.id"
    >
      <span v-text="brother.value.label"></span>
    </li>
  </el-scrollbar>
</template>
<script>
import mapper from "../../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  inject: ["close"],
  props: ["brothers"],
  computed: {
    ...mapState({
      userInfo: ["deviceOnly"],
      resourceInfo: ["visibleMap", "openMap", "currentResource"]
    })
  },
  methods: {
    click(brother) {
      let {
          value: { modelId, id }
        } = brother,
        { deviceOnly } = this;
      this.$parent.show = false;
      this.close();
      if (modelId > 1000 || deviceOnly == 0) {
        this.navigateToSelf({ id });
        return;
      }
    }
  }
};
</script>
<style lang="less">
.sub-nav-item-drop-wrap {
  max-height: 300px;
  color: black;
  margin-top: 9px;
  ul.sub-nav-item-drop {
    padding: 5px;
    margin: 0;
    background-color: white;
    li {
      -moz-user-select: none;
      -khtml-user-select: none;
      user-select: none;
      cursor: pointer;
      line-height: 25px;
      list-style: none;
      font-size: 12px;
      min-width: 80px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
