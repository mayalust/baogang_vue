<template>
  <section class="content" v-loading="loading">
    <div class="box">
      <nav-head :navigators="navigators" />
      <ps-dialog :title="dialogTitle" :visible="showDialog" @close="close">
        <components-tree-dialog :option="dataOption" :formats="formats" />
        <components-tree-dialog-buttons :buttons="popButtons" />
      </ps-dialog>
      <el-scrollbar tag="div" wrap-class="scroll-wrap" view-class="scroll-view">
        <div class="box-body">
          <div
            class="angular-dataTable-header ng-scope"
            ng-if="source.showheader != false"
            style="margin : 0px auto 5px auto"
          >
            <span ng-repeat="head in source.header" class="ng-scope">
              <button
                class="btn btn-primary btn-sm"
                style="margin: 2px;"
                @click="addRole"
              >
                <i class="fa fa-plus"></i>
                <span>添加角色</span>
              </button>
            </span>
            <div class="combined-query pull-right">
              <span style="display:block; float:left; margin : 0 6px;">
                <input
                  class="form-control input-sm"
                  v-model="searchkey"
                  placeholder="搜索角色名称"
                />
              </span>
              <button
                class="btn btn-primary btn-sm"
                style="display:block; float:left;margin-top : 0;"
                @click="search"
              >
                <i class="fa fa-search"></i>
                <span class="hidden-sm">查询</span>
              </button>
            </div>
          </div>

          <table
            class="table table-hover no-footer dataTable"
            style="width: 100%;"
          >
            <thead>
              <tr role="row" style="height: 0px;">
                <th style="width:14px;" @click="allCheckedClick($event)">
                  <input
                    type="checkbox"
                    v-model="allChecked"
                    class="no-events"
                  />
                </th>
                <th v-for="(hedaer, inx) in headers" :key="inx">
                  <div class="dataTables_sizing" v-text="hedaer"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="rolesList.length == 0">
                <td :colspan="headers.length + 1" style="text-align:center;">
                  无符合条件的数据
                </td>
              </tr>
              <tr
                style="cursor: pointer;"
                v-for="role in rolesList"
                :key="role.id"
                @click="rowClick(role)"
              >
                <td>
                  <input
                    type="checkbox"
                    v-model="selectedMap[role.roleID]"
                    class="no-events"
                  />
                </td>
                <td style="width: 30%;">
                  <span v-text="role.roleName"></span>
                </td>
                <td>
                  <span v-text="role.description"></span>
                </td>
                <td style="width: 200px;">
                  <div>
                    <table-button-group placement="bottom-end">
                      <button
                        v-for="(button, index) in buttons"
                        class="btn"
                        :key="index"
                        :class="button.cls"
                        @click="
                          groupClick(button, role);
                          $event.stopPropagation();
                        "
                      >
                        <i class="fa fa-edit hidden-lg hidden-md hidden-sm"></i>
                        <span class="hidden-xs" v-text="button.label"></span>
                      </button>
                    </table-button-group>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="row">
            <div class="col-sm-6">
              <table-page-size v-model="pageSize" />
            </div>
            <div class="col-sm-6">
              <table-pagination v-model="page" :total="total" />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </section>
</template>
<script>
import mapper from "../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper,
  DefaultInput = {
    roleName: "",
    description: ""
  };
export default {
  data() {
    return {
      loading: false,
      page: 0,
      pageSize: 10,
      searchkey: "",
      searchCondition: null,
      selectedMap: {},
      dialogTitle: "",
      showDialog: false,
      dataOption: {},
      navigators: [
        {
          label: "用户管理",
          url: "usermanager"
        },
        {
          label: "角色管理",
          url: "rolemanager",
          active: true
        }
      ],
      headers: ["角色名称", "角色描述", "操作"],
      buttons: [
        {
          label: "编辑",
          cls: "btn-primary",
          click(role) {
            this.dialogTitle = "编辑";
            this.showDialog = true;
            this.dataOption = Object.assign({}, DefaultInput, role);
            this.$once("submit", d => {
              this.showDialog = false;
            });
          }
        },
        {
          label: "删除",
          cls: "btn-default",
          click(role) {
            console.log(role.roleName);
          }
        },
        {
          label: "权限配置",
          cls: "btn-default",
          click(role) {
            let {
              $router,
              $route: { params }
            } = this;
            params.id = role.roleID;
            $router.push({
              name: "componentpermiss_id",
              params
            });
          }
        },
        {
          label: "用户分配",
          cls: "btn-default",
          click(role) {
            console.log(role.roleName);
          }
        }
      ],
      popButtons: [
        {
          label: "取消",
          click: () => {
            this.close();
          }
        },
        {
          label: "确定",
          cls: "primary",
          click: () => {
            this.close();
            this.$emit("submit");
          }
        }
      ]
    };
  },
  computed: {
    ...mapState({
      userInfo: ["rolesMap"]
    }),
    formats() {
      return [
        {
          type: "input",
          label: "角色名称",
          value: "roleName",
          need: true
        },
        {
          type: "input",
          label: "角色描述",
          value: "description"
        }
      ];
    },
    allChecked() {
      let { selectedMap } = this,
        result = true;
      this.eachRoleCurrentPage(({ roleID }) => {
        if (!selectedMap[roleID]) {
          result = false;
          return true;
        }
      });
      return result;
    },
    rolesList() {
      let { searchCondition } = this,
        rs = [];
      this.eachRoleCurrentPage(role => {
        rs.push(role);
      });
      return rs;
    },
    total() {
      let { pageSize, searchCondition } = this,
        len = 0;
      this.eachRole(role => {
        len++;
      });
      return Math.ceil(len / pageSize);
    }
  },
  methods: {
    ...mapActions({
      userInfo: ["queryEnterpriseRole"]
    }),
    addRole() {
      this.dialogTitle = "编辑";
      this.showDialog = true;
      this.dataOption = Object.assign({}, DefaultInput);
      this.$once("submit", d => {
        this.showDialog = false;
      });
    },
    close() {
      this.showDialog = false;
    },
    eachRole(callback) {
      let { rolesMap, searchCondition } = this,
        inx = 0;
      for (let i in rolesMap) {
        if (rolesMap[i].roleID < 10000) {
          continue;
        }
        if (searchCondition && !searchCondition(rolesMap[i])) {
          continue;
        }
        let rs = callback && callback(rolesMap[i], inx);
        if (rs == true) {
          return;
        }
        inx++;
      }
    },
    eachRoleCurrentPage(callback) {
      let { page, pageSize } = this,
        rs = [];
      this.eachRole((role, inx) => {
        if (inx >= page * pageSize && inx < (page + 1) * pageSize) {
          callback(role);
        }
      });
    },
    allCheckedClick(evet) {
      event.preventDefault();
      let { page, pageSize, allChecked } = this,
        obj = {};
      this.eachRoleCurrentPage(({ roleID }) => {
        obj[roleID] = !allChecked;
      });
      this.selectedMap = Object.assign({}, this.selectedMap, obj);
    },
    search() {
      let { searchkey } = this;
      this.page = 0;
      this.searchCondition =
        searchkey == null || searchkey == ""
          ? () => true
          : ({ roleName }) => {
              return roleName.indexOf(searchkey) != -1;
            };
    },
    rowClick(role) {
      let { roleID } = role,
        { selectedMap } = this,
        obj = {};
      obj[roleID] = !selectedMap[roleID];
      this.selectedMap = Object.assign({}, selectedMap, obj);
    },
    groupClick(button, role) {
      let { click } = button;
      click.call(this, role, this.$event);
    },
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
<style lang="css">
.scroll-wrap {
  overflow: hidden;
  width: 100%;
  height: calc(100vh - 150px);
}
.no-events {
  pointer-events: none;
}
.scroll-view {
  width: calc(100% - 10px);
}
</style>
