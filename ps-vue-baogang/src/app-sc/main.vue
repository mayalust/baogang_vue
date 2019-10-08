<template>
  <router-view />
</template>
<script>
import mapper from "../tools/mapper.js";
const { mapActions } = mapper;
export default {
  mounted() {
    let loadingIns = this.$loading({
      body: true
    });
    this.getCurrentUser()
      .then(d => {
        console.log("成功登录宝钢系统");
        return this.completeUserInfo();
      })
      .then(d => {
        return this.getGeneralInfo();
      })
      .then(d => {
        loadingIns.close();
        this.$watch(
          "$route",
          val => {
            let {
              params: {
                mainIndex,
                subIndex,
                minorIndex,
                showTree,
                deviceOnly,
                id
              }
            } = val;
            if (mainIndex != null) {
              this.setIndexTo({
                mainIndex,
                subIndex,
                minorIndex,
                showTree,
                deviceOnly
              });
              this.setCurrentResource(id);
            }
          },
          {
            immediate: true
          }
        );
        return this.getResourceTree();
      })
      .then(d => {
        console.log("初始化完成");
      })
      .catch(e => {
        loadingIns.close();
        if (e.hasOwnProperty("code") && e.code != 0) {
          location.href = "./login.html";
        }
        console.error(e);
      });
  },
  methods: {
    ...mapActions({
      userInfo: [
        "getCurrentUser",
        "completeUserInfo",
        "setDefaultNav",
        "setIndexTo"
      ],
      generalInfo: ["getGeneralInfo"],
      resourceInfo: ["setCurrentResource", "getResourceTree"]
    })
  }
};
</script>
<style lang="less" scoped>
span {
  color: red;
}
</style>