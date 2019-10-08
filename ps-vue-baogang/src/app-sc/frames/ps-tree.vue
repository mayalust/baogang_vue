<template>
  <div class="tree-item" :style="treeItemStyle" :class="lastCls">
    <div class="tree-content" v-if="show">
      <div
        :style="treeStyle"
        class="tree-content-inner"
        @click="click($event)"
        :class="click2fold"
      >
        <span class="tag" :class="state"></span>
        <span v-text="label"></span>
        <i
          @click="innerClick($event)"
          v-if="hasChildren"
          :class="[
            'el-select__caret',
            'el-input__icon',
            'el-icon-arrow-up ' + iconClass
          ]"
        ></i>
      </div>
    </div>
    <ps-collapse-transition>
      <div class="wrap" v-if="open">
        <ps-tree
          :option="res"
          :level="nextlevel"
          :key="res.id"
          v-for="(res, i) in filter(children)"
          :last="i == filter(children).length - 1"
        />
      </div>
    </ps-collapse-transition>
  </div>
</template>
<script>
import psUtility from "ps-ultility";
import PsCollapseTransition from "../../tools/ps-collapse-transition.js";
import Utils from "../../tools/utils";
import mapper from "../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper,
  { extend } = psUtility,
  tags = ["tag-green", "tag-green", "tag-yellow", "tag-orange", "tag-red"];
export default {
  name: "PsTree",
  props: ["option", "level", "last"],
  methods: {
    filter(children) {
      let { visibleMap } = this,
        list = (children || []).filter(({ value: { id } }) => {
          return visibleMap[id] == true;
        });
      return list;
    },
    innerClick(event) {
      event && event.stopPropagation();
      let {
        option: {
          value: { id }
        }
      } = this;
      this.openMap[id] = !this.openMap[id];
    },
    click(event) {
      let {
        deviceOnly,
        option: {
          value: { modelId, id }
        }
      } = this;
      if (modelId > 1000) {
        this.navigateToSelf({ id });
      }
      if (deviceOnly == 1) {
        this.innerClick();
        return;
      }
      this.navigateToSelf({ id });
    }
  },
  computed: {
    ...mapGetters({
      userInfo: ["mainTab"]
    }),
    ...mapState({
      userInfo: ["deviceOnly"],
      resourceInfo: ["visibleMap", "openMap", "currentResource"],
      kpiDataInfo: ["treeResourceState"]
    }),
    click2fold() {
      let {
        deviceOnly,
        currentResource,
        option: {
          value: { modelId, id }
        }
      } = this;
      if (currentResource && currentResource.id == id) {
        return "current-selected";
      }
      if (modelId > 1000) {
        return "";
      }
      return deviceOnly == 1 ? "no-fold" : "";
    },
    state() {
      let {
        option: {
          value: { id }
        },
        treeResourceState
      } = this;
      if (treeResourceState == null || treeResourceState[id] == null) {
        return "tag-green";
      }
      let inx = treeResourceState[id].value;
      return tags[inx] || "tag-green";
    },
    show() {
      let {
        option: {
          value: { id }
        },
        visibleMap
      } = this;
      return visibleMap[id] == true;
    },
    open() {
      let {
        option: {
          value: { id }
        },
        openMap
      } = this;
      return openMap[id] == true;
    },
    lastCls() {
      return this.last ? "last" : "";
    },
    iconClass() {
      return this.open ? "is-reverse" : "";
    },
    hasChildren() {
      return this.children && this.children.length > 0;
    },
    treeItemStyle() {
      return this.level == 1 ? `margin-left:0px;` : `margin-left:15px;`;
    },
    treeStyle() {
      return `padding-left:${15 * this.level}px;margin-left:-${15 *
        this.level}px`;
    },
    label() {
      let {
        option: {
          value: { modelId, label, externalDevId }
        }
      } = this;
      if (modelId < 1000) return label;
      return `${label} ( ${externalDevId} )`;
    },
    nextlevel() {
      let { level } = this;
      return level + 1;
    },
    children() {
      let { option } = this;
      return option && option.children;
    }
  },
  components: {
    PsCollapseTransition
  }
};
</script>
<style lang="less">
.tree-item {
  position: relative;
  margin-left: -15px;
  color: white;
  .wrap {
    transform-origin: center top;
  }
  &.last {
    &:before {
      height: 13px;
    }
  }
  .ps-zoom-in-enter-active,
  .ps-zoom-in-leave-active {
    -webkit-transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.2s linear;
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.2s linear;
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
  .ps-zoom-in-enter,
  .ps-zoom-in-leave-to {
    opacity: 0;
    transform: scaleY(0.3);
    -webkit-transform: scaleY(0.3);
  }
  &:before {
    content: "";
    display: block;
    position: absolute;
    width: 1px;
    height: 100%;
    top: 0;
    left: 10px;
    z-index: 9;
    background-color: #555;
  }
  .tree-content {
    padding-left: 20px;
    user-select: none;
    &:before {
      content: "";
      display: block;
      position: absolute;
      width: 8px;
      height: 1px;
      top: 12px;
      left: 10px;
      z-index: 9;
      background-color: #555;
    }
    .tree-content-inner {
      &.current-selected {
        background-color: #00354e;
        &:hover {
          background-color: #00354e;
        }
      }
      &.no-fold {
        background-color: rgba(250, 250, 250, 0.1);
      }
      line-height: 26px;
      background-color: rgba(250, 250, 250, 0);
      .el-select__caret {
        float: right;
        line-height: 26px;
        transform: rotateZ(-90deg);
        &.is-reverse {
          transform: rotateZ(-180deg);
        }
      }
      .tag {
        display: inline-block;
        width: 18px;
        height: 14px;
        &.tag-green {
          background-image: url(../../../../images/baogang/tree-tag-green.png);
        }
        &.tag-orange {
          background-image: url(../../../../images/baogang/tree-tag-orange.png);
        }
        &.tag-yellow {
          background-image: url(../../../../images/baogang/tree-tag-yellow.png);
        }
        &.tag-red {
          background-image: url(../../../../images/baogang/tree-tag-red.png);
        }
      }
      &:hover {
        cursor: pointer;
        background-color: rgba(250, 250, 250, 0.3);
        transition: 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) background-color;
        -webkit-transition: 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)
          background-color;
      }
    }
  }
}
</style>

