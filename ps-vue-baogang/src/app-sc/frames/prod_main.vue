<template>
  <div class="baogang">
    <ps-header></ps-header>
    <div class="steel content-box-frame" id="free-board">
      <div :style="leftPart" class="content-box-item" v-if="showLeft">
        <div class="move-bar" v-movebar="movebar_width"></div>
        <ps-resource-tree />
      </div>
      <div class="content-box-item">
        <div class="content-wrap">
          <sub-nav></sub-nav>
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PsHeader from "../components/headers/ps-header.vue";
import mapper from "../../tools/mapper";
import psutil from "ps-ultility";
import movebar from "../../directives/movebar";
import SubNav from "../components/treenavigators/sub-nav";
import PsResourceTree from "./ps-resource-tree";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  computed: {
    ...mapState({
      userInfo: ["showTree"]
    }),
    showLeft() {
      let { showTree } = this;
      return showTree == 1;
    },
    leftPart() {
      let { showTree } = this;
      return {
        width: showTree == 1 ? "300px" : "0"
      };
    },
    rightPart() {
      let { showTree } = this;
      return {
        left: showTree == 1 ? "300px" : "0"
      };
    }
  },
  data() {
    return {
      movebar_width: 300
    };
  },
  directives: {
    movebar
  },
  components: {
    PsHeader,
    PsResourceTree,
    SubNav
  }
};
</script>
<style lang="less" scoped>
.baogang {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.steel {
  position: absolute;
  top: 110px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  &.content-box-frame {
    display: table;
    min-height: 0;
    width: 100%;
    .content-box-item {
      display: table-cell;
      vertical-align: top;
      position: relative;
      .content-wrap {
        height: ~"calc(100vh - 110px)";
        overflow-x: hidden;
        overflow-y: scroll;
      }
      .move-bar {
        cursor: col-resize;
        position: absolute;
        background-color: #25729d;
        right: 0;
        width: 10px;
        border-right: 5px solid rgba(0, 0, 0, 0.3);
        height: 100%;
      }
      &.left {
        left: 0;
      }
      &.right {
        right: 0;
      }
      transition: 0.2s width cubic-bezier(0.075, 0.82, 0.165, 1);
    }
  }
}
</style>

