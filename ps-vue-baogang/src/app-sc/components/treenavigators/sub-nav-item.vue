<template>
  <td>
    <span
      v-text="label"
      class="title"
      ref="reference"
      @click="titleClick"
    ></span>
    <i
      @click="click($event)"
      :class="[
        'el-select__caret',
        'el-input__icon',
        'el-icon-arrow-up ' + iconClass
      ]"
    ></i>
    <transition name="ps-zoom-in" @after-leave="afterLeave">
      <div
        v-show="visible"
        class="ps-model-content"
        ref="popper"
        v-clickoutside="clickoutside"
      >
        <sub-nav-item-drop :brothers="brothers" />
      </div>
    </transition>
  </td>
</template>
<script>
import Clickoutside from "element-ui/src/utils/clickoutside";
import SubNavItemDrop from "./sub-nav-item-drop";
import psUtil from "../../../tools/proudsmart_util";
import mapper from "../../../tools/mapper";
import vuepopper from "element-ui/src/utils/vue-popper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  provide() {
    return {
      close: this.close
    };
  },
  props: ["navigator"],
  mixins: [vuepopper],
  data() {
    return {
      open: false,
      visible: false
    };
  },
  computed: {
    ...mapState({
      userInfo: ["deviceOnly"]
    }),
    iconClass() {
      return this.visible ? "is-reverse" : "";
    },
    label() {
      let {
        navigator: {
          value: { label, modelId, externalDevId }
        }
      } = this;
      if (modelId < 1000) return label;
      return `${label} ( ${externalDevId} )`;
    },
    brothers() {
      let {
        navigator: { brothers }
      } = this;
      return brothers;
    }
  },
  methods: {
    titleClick() {
      let {
        deviceOnly,
        navigator: {
          value: { modelId, id }
        }
      } = this;
      this.$parent.show = false;
      if (modelId > 1000 || deviceOnly == 0) {
        this.navigateToSelf({ id });
        return;
      }
    },
    click() {
      let { brothers } = this;
      if (brothers.length == 0) {
        return;
      }
      if (this.open == false) {
        this.open = true;
        this.visible = true;
      }
      this.createPopper();
    },
    close() {
      this.visible = false;
    },
    clickoutside() {
      this.close();
    },
    afterLeave() {
      this.open = false;
    }
  },
  directives: {
    Clickoutside
  },
  components: {
    SubNavItemDrop
  }
};
</script>
<style lang="less" scoped>
.title {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.ps-zoom-in-enter-active,
.ps-zoom-in-leave-active {
  -webkit-transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.2s linear;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.2s linear;
  transform: scaleY(1);
  -webkit-transform: scaleY(1);
}
.ps-zoom-in-enter,
.ps-zoom-in-leave-to {
  opacity: 0;
  transform: scaleY(0.3);
  -webkit-transform: scaleY(0.3);
}
.el-select__caret {
  cursor: pointer;
  transform: rotateZ(-90deg);
  &.is-reverse {
    transform: rotateZ(-180deg);
  }
}
</style>
