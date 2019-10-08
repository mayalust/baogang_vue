<template>
  <div class="tree-item" :style="treeItemStyle" :class="lastCls">
    <div class="tree-content">
      <div :style="treeStyle" class="tree-content-inner" @click="click($event)">
        <i
          @click="innerClick($event)"
          v-if="hasChildren"
          :class="[
            'el-select__caret',
            'el-input__icon',
            'el-icon-arrow-up ' + iconClass
          ]"
        ></i>
        <i class="fa fa-circle" v-if="!hasChildren" />
        <span v-text="label"></span>
        <span v-text="view" style="margin-left:100px;"></span>

        <div class="btn-group" role="group" style="float:right;margin-top:3px;">
          <button
            type="button"
            class="btn btn-sm btn-default"
            v-for="(button, index) in filter(buttons)"
            :key="index"
            v-text="button.label"
            @click="groupClick(button.click, $event)"
          ></button>
        </div>
      </div>
    </div>
    <ps-collapse-transition>
      <div class="wrap" v-if="open">
        <ps-tree
          :buttons="buttons"
          :option="res"
          :level="nextlevel"
          :key="res.id"
          :openMap="openMap"
          v-for="(res, i) in children"
          :last="i == children.length - 1"
        />
      </div>
    </ps-collapse-transition>
  </div>
</template>
<script>
import psUtility from "ps-ultility";
import PsCollapseTransition from "../../../tools/ps-collapse-transition.js";
import Utils from "../../../tools/utils";
import mapper from "../../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper,
  { extend } = psUtility;
export default {
  name: "PsTree",
  props: ["option", "level", "last", "openMap", "buttons"],
  methods: {
    filter(children) {
      return children.filter(child => {
        let { visible } = child,
          { level } = this;
        return visible ? visible.call(this, level) : true;
      });
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
    groupClick(callback, eventname) {
      let { option } = this;
      event.stopPropagation();
      callback.call(this, option);
    },
    click(event) {
      let {
        option: {
          children,
          value: { id }
        }
      } = this;
      if (children && children.length > 0) {
        this.innerClick();
        return;
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: ["mainTab"]
    }),
    ...mapState({
      userInfo: ["deviceOnly"],
      resourceInfo: ["currentResource"]
    }),
    open() {
      let {
        option: {
          value: { id }
        }
      } = this;
      return this.openMap[id];
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
          value: { label, index, alias }
        }
      } = this;
      return `${label}(${index}) - ${alias || ""}`;
    },
    view() {
      let {
        option: {
          value: { vueRouter, viewId }
        }
      } = this;
      return vueRouter || viewId;
    },
    nextlevel() {
      let { level } = this;
      return level + 1;
    },
    children() {
      let {
        option: { children }
      } = this;
      return children;
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
  color: #666;
  .fa {
    color: #eee;
  }
  .wrap {
    transform-origin: center top;
  }
  &.last {
    &:before {
      height: 18px;
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
    background-color: #ddd;
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
      top: 18px;
      left: 10px;
      z-index: 9;
      background-color: #ddd;
    }
    .tree-content-inner {
      .fa-circle {
        font-size: 6px;
        padding: 6px;
      }
      &.current-selected {
        background-color: #00354e;
        &:hover {
          background-color: #00354e;
        }
      }
      &.no-fold {
        background-color: rgba(250, 250, 250, 0.1);
      }
      line-height: 36px;
      background-color: rgba(250, 250, 250, 0);
      border-bottom: 1px solid #eee;
      .el-select__caret {
        float: left;
        line-height: 26px;
        transform: rotateZ(90deg);
        margin-top: 5px;
        &.is-reverse {
          transform: rotateZ(180deg);
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