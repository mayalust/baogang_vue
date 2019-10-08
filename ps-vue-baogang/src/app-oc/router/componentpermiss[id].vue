<template>
  <section class="content">
    <div class="box">
      <nav-head :navigators="navigators" />
      <div style="padding : 10px;">
        <button class="btn btn-primary" @click="save">保存</button>
        <button class="btn btn-default">重置</button>
        <ps-dialog :title="dialogTitle" :visible="showDialog" @close="close">
          <components-tree-dialog :option="dataOption" :formats="formats" />
          <components-tree-dialog-buttons :buttons="popButtons" />
        </ps-dialog>
      </div>

      <el-scrollbar tag="div" wrap-class="scroll-wrap" view-class="scroll-view">
        <component-tree
          v-for="(op, index) in treeData"
          :key="index"
          :option="op"
          :level="1"
          :last="true"
          :openMap="openMap"
          :buttons="buttons"
        />
      </el-scrollbar>
    </div>
  </section>
</template>
<script>
import mapper from "../../tools/mapper";
import Utils from "../../tools/utils";
import ComponentTree from "../components/common/component-tree";
const { mapState, mapGetters, mapMutations, mapActions } = mapper,
  { TreeNode } = Utils,
  _DefautOption = {
    index: "",
    name: "",
    label: "",
    alias: "",
    vueRouter: null,
    showTree: 0,
    deviceOnly: 0
  };

export default {
  data() {
    let _self = this,
      { rolesMap, $route } = _self;
    return {
      treeData: [],
      dialogTitle: "",
      showDialog: false,
      dataOption: {},
      openMap: {},
      navigators: [
        {
          label: "菜单功能",
          url: "permission/menus"
        },
        {
          label: "视图权限",
          url: "permission/view"
        },
        {
          label: "设备控制",
          url: "permission/equipment"
        },
        {
          label: "组件权限",
          url: "componentpermiss",
          active: true
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
      ],
      buttons: [
        {
          label: "添加",
          click(menu) {
            let obj = Object.assign({}, _DefautOption);
            _self.showDialog = true;
            _self.dialogTitle = "添加";
            _self.dataOption = obj;
            _self.$once("submit", d => {
              menu.appendChild(_self.dataOption);
            });
          },
          visible(level) {
            return level < 3;
          }
        },
        {
          label: "编辑",
          click(menu) {
            let { value } = menu,
              obj = Object.assign({}, _DefautOption, value);
            _self.showDialog = true;
            _self.dialogTitle = "编辑";
            _self.dataOption = obj;
            _self.$once("submit", d => {
              menu.update(_self.dataOption);
            });
          },
          visible(level) {
            return level > 1;
          }
        },
        {
          label: "删除",
          click(menu) {
            menu.remove();
          },
          visible(level) {
            return level > 1;
          }
        }
      ]
    };
  },
  computed: {
    ...mapState({
      userInfo: ["rolesMap"],
      fileInfo: ["vueRouterNames"]
    }),
    formats() {
      let { vueRouterNames } = this;
      return [
        {
          type: "input",
          label: "序号",
          value: "index",
          need: true
        },
        {
          type: "inputDisabled",
          label: "视图名(已弃用)",
          value: "viewId"
        },
        {
          type: "select",
          label: "vue路由",
          value: "vueRouter",
          options: vueRouterNames,
          need: true
        },
        {
          type: "input",
          label: "页签名称",
          value: "label",
          need: true
        },
        {
          type: "input",
          label: "别名",
          value: "alias"
        },
        {
          type: "switch",
          label: "显示树",
          value: "showTree"
        },
        {
          type: "switch",
          label: "只包含设备",
          value: "deviceOnly"
        }
      ];
    },
    selectedRoleValues() {
      let { rolesMap, $route } = this;
      if (!this.hasKey(rolesMap) || $route == null) {
        return {};
      }
      let {
          params: { id }
        } = $route,
        json = JSON.parse(rolesMap[id].values),
        obj = new TreeNode([json]);
      return obj;
    }
  },
  methods: {
    ...mapActions({
      userInfo: ["queryEnterpriseRole"]
    }),
    save() {
      let { selectedRoleValues } = this,
        json = selectedRoleValues.rawData(),
        str = JSON.stringify(json[0]),
        {
          rolesMap,
          $route: {
            params: { id }
          }
        } = this,
        role = rolesMap[id];
      role.values = str;
      console.log(role);
      let loadingIns = this.$loading({
        body: true
      });
      this.$ps
        .post("userRoleUIService.modifyRole", role)
        .then(d => {
          return this.queryEnterpriseRole();
        })
        .then(d => {
          loadingIns.close();
        });
    },
    reset() {},
    close() {
      this.showDialog = false;
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
  },
  watch: {
    selectedRoleValues: {
      handler(val) {
        if (typeof val.queue != "function") {
          return;
        }
        let openMap = {};
        val.queue((node, parents, { level }) => {
          openMap[node.id] = level < 1;
        });
        this.openMap = openMap;
        this.treeData = val.data;
      },
      immediate: true
    }
  },
  components: {
    ComponentTree
  }
};
</script>
<style lang="css">
.scroll-wrap {
  height: calc(100vh - 160px);
  padding-right: 20px;
  overflow-x: hidden;
}
</style>