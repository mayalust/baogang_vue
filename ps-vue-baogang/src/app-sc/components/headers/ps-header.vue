<template>
  <header class="main-header">
    <div class="logo" @click="click" :style="enterPriseImage"></div>
    <nav class="navbar navbar-static-top">
      <a
        class="sidebar-toggle2 proudsmart title"
        v-for="menu in mainMenus"
        :key="menu.functionCode"
        v-text="getMenuName(menu)"
      ></a>
      <div class="navbar-custom-menu steel">
        <ul class="nav navbar-nav">
          <li class="dropdown notifications-menu">
            <a class="dropdown-toggle" @click="showDetailMessages($event)"
              ><i class="fa fa-bell-o"></i>
              <span
                class="label label-warning"
                v-text="unreadMessagesNum"
              ></span>
            </a>
          </li>
          <li class="dropdown user user-menu">
            <a class="dropdown-toggle" @click="showDetailUser($event)"
              ><img
                src="../../../../../images/user/user.png"
                class="user-image"
              />
              <span v-text="userName"></span>
            </a>
          </li>
          <li class="dropdown select-area">
            <el-select
              v-model="loginAccount"
              @change="loginNameChange"
              placeholder="请选择"
              filterable
              :valueKey="format.value"
            >
              <el-option
                v-for="item in loginNames"
                :key="item[format.value]"
                :label="item[format.label]"
                :value="item"
              >
              </el-option>
            </el-select>
            <!-- <ps-select v-model="value" :options="loginNames" :format="format">
            </ps-select> -->
          </li>
          <li class="dropdown select-area">
            <el-select
              v-model="role"
              placeholder="请选择"
              filterable
              :valueKey="formatRoles.value"
            >
              <el-option
                v-for="item in currentRoles"
                :key="item[formatRoles.value]"
                :label="item[formatRoles.label]"
                :value="item"
              >
              </el-option>
            </el-select>
            <!-- <ps-select
              v-model="selectRoleId"
              :options="currentRoles"
              :format="formatRoles"
            > -->
          </li>
        </ul>
      </div>
    </nav>
    <ps-header-body />
  </header>
</template>
<script>
import psUtil from "../../../tools/proudsmart_util";
import PsHeaderUser from "./ps-header-user";
import PsHeaderMessage from "./ps-header-message";
import PsHeaderBody from "./ps-header-body";
import mapper from "../../../tools/mapper";
import ultils from "../../../tools/utils";
const { mapState, mapGetters, mapMutations, mapActions } = mapper,
  { debounce } = ultils;
export default {
  mixins: [psUtil],
  data() {
    return {
      loginAccount: {},
      role: {},
      selectLogin: null,
      formatRoles: {
        value: "roleID",
        label: "roleName"
      },
      format: {
        value: "id",
        label: "userName"
      }
    };
  },
  computed: {
    ...mapGetters({
      userInfo: [
        "userName",
        "currentRoles",
        "enterPriseImage",
        "mainMenus",
        "loginNames"
      ]
    }),
    ...mapState({
      userInfo: ["user", "enterpriseConfig", "selectRoleId"],
      generalInfo: ["unreadMessagesNum"]
    })
  },
  methods: {
    getMenuName(menu) {
      let config = this.enterpriseConfig[menu.functionCode];
      return config ? config.label : menu.name;
    },
    click() {
      console.log("返回首页");
    },
    loginNameChange(obj) {
      let { account, password } = obj,
        loadingIns = this.$loading({
          body: true
        });
      this.$store
        .dispatch("userInfo/reLogin", [account, password])
        .then(d => {
          loadingIns.close();
          location.href = "/";
        })
        .catch(d => {
          loadingIns.close();
          location.href = "/login.html";
        });
    },
    showDetailUser(event) {
      let reference = event.currentTarget;
      this.drop(reference, PsHeaderUser);
    },
    showDetailMessages(event) {
      let reference = event.currentTarget;
      this.drop(reference, PsHeaderMessage);
    }
  },
  components: {
    PsHeaderBody
  },
  watch: {
    user: {
      handler(user) {
        let { loginName } = user,
          obj = this.loginNames.find(({ account }) => account == loginName);
        this.loginAccount = obj || {};
      },
      immediate: true
    },
    currentRoles: {
      handler(roles) {
        let id = this.selectRoleId,
          obj = roles.find(({ roleID }) => roleID == id);
        this.role = obj || {};
      },
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
header.main-header {
  .logo {
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  nav.navbar {
    a.title {
      color: white !important;
      font-size: 20px !important;
      font-weight: bold !important;
      padding: 10px;
    }
  }
  .select-area {
    padding: 8px 8px 0;
  }
  .navbar-custom-menu {
    a {
      cursor: pointer;
    }
  }
}
</style>

