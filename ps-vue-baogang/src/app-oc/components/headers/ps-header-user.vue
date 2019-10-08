<template>
  <ul class="ps-dropdown-menu">
    <li class="user-header">
      <img
        src="../../../../../images/user/user.png"
        class="img-circle"
        alt="User Image"
      />
      <p v-text="user.userName"></p>
      <small v-text="datestring"></small>
    </li>
    <li class="user-footer">
      <div class="pull-right">
        <button class="btn btn-primary" @click="logoutFn">退出</button>
      </div>
    </li>
  </ul>
</template>
<script>
import mapper from "../../../tools/mapper";
import psutil from "ps-ultility";
const { mapState, mapGetters, mapMutations, mapActions } = mapper,
  { dateparser } = psutil;
export default {
  computed: {
    ...mapState({
      userInfo: ["user"]
    }),
    datestring() {
      let user = this.user,
        { lastLoginTime } = user;
      return (
        "最近登录时间 : " +
        dateparser(lastLoginTime).getDateString("yyyy-MM-dd,hh:mm:ss")
      );
    }
  },
  methods: {
    ...mapActions({
      userInfo: ["logout"]
    }),
    logoutFn() {
      let loadingIns = this.$loading({
        body: true
      });
      this.logout().then(d => {
        loadingIns.close();
        location.href = "./login.html";
      });
    }
  }
};
</script>
<style lang="less" scoped>
ul.ps-dropdown-menu {
  margin: 0;
  padding: 0;
  border: 1px solid rgba(250, 250, 250, 0.2);
  background-color: white;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  li {
    list-style: none;
    padding: 10px;
    border-radius: 3px;
    p {
      width: 250px;
      font-size: 17px;
    }
    &.user-header {
      img {
        border-radius: 50%;
        height: 90px;
        width: 90px;
      }
      text-align: center;
      color: white;
      font-size: 12px;
    }
    &.user-footer {
      background-color: white;
      &:after {
        content: "";
        display: block;
        clear: both;
      }
    }
  }
}
</style>


