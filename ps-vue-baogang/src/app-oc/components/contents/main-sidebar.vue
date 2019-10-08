<template>
  <aside class="main-sidebar">
    <div class="slimScrollDiv">
      <section class="sidebar">
        <form class="sidebar-form">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="搜索..."
              v-model="searchKey"
            />
            <span class="input-group-btn">
              <button class="btn btn-flat" @click="search(searchKey, $event)">
                <i class="fa fa-search"></i>
              </button>
            </span>
          </div>
        </form>
        <ul class="sidebar-menu">
          <li
            class="treeview"
            v-for="(menulv1, inx) in subMenusLv1"
            :key="menulv1.functionCode"
            :class="selectedMenu == inx ? 'active' : ''"
          >
            <a @click="mainClick(menulv1, inx)">
              <i :class="menulv1.icon" />
              <span v-text="menulv1.name"></span>
              <i
                class="fa fa-angle-left pull-right"
                v-if="getChildren(menulv1).length > 0"
              ></i>
            </a>
            <ps-collapse-transition>
              <ul class="treeview-menu" v-if="selectedMenu == inx">
                <li
                  v-for="(menulv2, inx2) in getChildren(menulv1)"
                  :key="menulv2.functionCode"
                  :class="subMenuCls(inx, inx2)"
                >
                  <a @click="subClick(menulv2, inx, inx2)">
                    <i :class="menulv2.icon || 'fa fa-circle'" />
                    <span v-text="menulv2.name"></span>
                  </a>
                </li>
              </ul>
            </ps-collapse-transition>
          </li>
        </ul>
      </section>
    </div>
  </aside>
</template>
<script>
import PsCollapseTransition from "../../../tools/ps-collapse-transition.js";
import mapper from "../../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  mounted() {
    console.log(this);
  },
  data() {
    return {
      searchKey: "",
      showloading: false,
      selectedMenu: -1,
      searchTxt: null
    };
  },
  methods: {
    ...mapActions({
      resourceInfo: ["search", "open"]
    }),
    search(searchKey, event) {
      event.preventDefault();
      this.searchTxt = searchKey;
    },
    getChildren(menu) {
      return menu.function
        ? menu.function.filter(({ functionCode }) => {
            return /^S(?:\d+)$/.test(functionCode);
          })
        : [];
    },
    subMenuCls(inx, inx2) {
      let { mainIndex, subIndex } = this,
        rs = mainIndex == inx && subIndex == inx2 ? "active" : "";
      return rs;
    },
    mainClick(menu, mainIndex) {
      let menus = this.getChildren(menu),
        subIndex = -1;
      if (menus.length > 0) {
        this.selectedMenu = this.selectedMenu == mainIndex ? -1 : mainIndex;
        return;
      }
      let name = menu.url.split("#/").pop();
      this.$router.push({
        name,
        params: {
          mainIndex,
          subIndex
        }
      });
    },
    subClick({ url }, mainIndex, subIndex) {
      let name = url.split("#/").pop();
      this.$router.push({
        name,
        params: {
          mainIndex,
          subIndex
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      userInfo: ["subMenus"]
    }),
    ...mapState({
      userInfo: ["mainIndex", "subIndex"]
    }),
    subMenusLv1() {
      let { subMenus, searchTxt } = this;
      return (subMenus["function"] || []).filter(({ name }) => {
        return searchTxt == null || name.indexOf(this.searchTxt) != -1;
      });
    }
  },
  components: {
    PsCollapseTransition
  },
  watch: {
    mainIndex(val) {
      this.selectedMenu = val;
    }
  }
};
</script>
<style lang="less" scoped>
.sidebar-menu {
  a {
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
  }
  .treeview-menu {
    display: block;
  }
}
</style>