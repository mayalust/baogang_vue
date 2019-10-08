<template>
  <section class="content">
    <div class="box">
      <nav-head :navigators="navigators" />
      <div
        class="angular-dataTable-header ng-scope"
        ng-if="source.showheader != false"
        style="margin : 0px auto 5px auto"
      >
        <span ng-repeat="head in source.header" class="ng-scope">
          <button class="btn btn-primary btn-sm" style="margin: 2px;">
            <i class="fa fa-plus"></i>
            <span>添加角色</span>
          </button>
        </span>
        <div class="combined-query pull-right">
          <span style="display:block; float:left; margin : 0 6px;">
            <input
              class="form-control input-sm"
              v-model="searchkey"
              placeholder="用户名/登录名/手机号/邮箱"
            />
          </span>
          <button
            class="btn btn-primary btn-sm"
            style="display:block; float:left;margin-top : 0;"
          >
            <i class="fa fa-search"></i>
            <span class="hidden-sm">查询</span>
          </button>
        </div>
      </div>
      <ps-table v-model="pageInfo" :headers="headers">
        <tr v-for="(user, index) in users" :key="index">
          <td v-text="user.userName"></td>
          <td v-text="user.loginName"></td>
          <td v-text="user.mobilePhone"></td>
          <td v-text="user.email"></td>
          <td v-text="getRoleName(user.roleID)"></td>
          <td v-text="getDomainName(user.domainPath)"></td>
          <td v-text="user.status"></td>
        </tr>
      </ps-table>
    </div>
  </section>
</template>
<script>
import mapper from "../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  data() {
    return {
      searchkey: "",
      pageInfo: {
        page: 0,
        pageSize: 10,
        checks: {}
      },
      headers: [
        "用户名",
        "登录名",
        "手机号",
        "邮箱",
        "已分配角色",
        "管理域",
        "状态"
      ],
      users: [],
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
      userInfo: ["rolesMap"],
      resourceInfo: ["currentResource"]
    })
  },
  methods: {
    ...mapActions({
      resourceInfo: ["getResourceByIds"]
    }),
    queryUserByCondition() {
      return this.$ps.post("userUIService.queryUserByCondition", {});
    },
    getRoleName(roleID) {
      let { rolesMap } = this;
      return roleID
        .split(",")
        .map(roleID => {
          return rolesMap[roleID] && rolesMap[roleID]["roleName"];
        })
        .join(",");
    },
    getDomainName(domainPath) {
      let { domainsMap } = this,
        id = domainPath
          .split("/")
          .filter(d => d)
          .pop();
      if (domainsMap == null || domainsMap[id] == null) {
        return "-";
      }
      let { label } = domainsMap[id];
      return label;
    }
  },
  mounted() {
    this.queryUserByCondition()
      .then(users => {
        this.users = users;
        let ids = Array.from(
          users.reduce((a, b) => {
            let id = b.domainPath
              .split("/")
              .filter(d => d)
              .pop();
            a.add(id);
            return a;
          }, new Set())
        );
        return this.getResourceByIds(ids);
      })
      .then(domains => {
        this.domainsMap = domains.reduce((a, b) => {
          a[b.id] = b;
          return a;
        }, {});
      });
  }
};
</script>
<style lang="less" scoped>
span {
  color: white;
}
</style>
