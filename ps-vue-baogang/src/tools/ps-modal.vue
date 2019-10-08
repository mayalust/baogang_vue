<template>
  <div class="ps-modal baogang" v-clickoutside="handleClose">
    <transition name="ps-zoom-in" @after-leave="afterLeave">
      <div v-show="visible" class="ps-model-content">
        <ps-popper-content></ps-popper-content>
      </div>
    </transition>
  </div>
</template>
<script>
import Clickoutside from "element-ui/src/utils/clickoutside";
export default {
  props: ["data"],
  data() {
    return {
      visible: false,
      show: false
    };
  },
  directives: {
    Clickoutside
  },
  methods: {
    handleClose() {
      this.visible = false;
      this.close && this.close();
    },
    afterLeave() {
      this.show = false;
    }
  },
  watch: {
    show(val) {
      this.visible = val;
    }
  }
};
</script>
<style lang="less">
.ps-modal {
  z-index: 2000;
  margin-top: 10px;
  & > .ps-model-content {
    transform-origin: center top;
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
</style>


