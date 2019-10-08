<template>
  <transition>
    <div
      v-if="visible"
      class="modal bootstrap-dialog type-primary fade size-normal in block"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-f2 padding-bottom-20">
            <div class="bootstrap-dialog-header">
              <a role="button" class="close" @click="close">×</a>
              <h4 class="modal-title info-box-number" v-text="title"></h4>
            </div>
          </div>
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import mapper from "../../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
import Popup from "element-ui/src/utils/popup";
import Migrating from "element-ui/src/mixins/migrating";
import emitter from "element-ui/src/mixins/emitter";
export default {
  name: "PsDialog",
  props: ["title"],
  mixins: [Popup, emitter, Migrating],
  mounted() {
    document.body.appendChild(this.$el);
  },
  methods: {
    close() {
      this.$emit("close");
    }
  },
  destroyed() {
    this.$el.remove();
  }
};
</script>
<style lang="less" scoped>
.modal {
  display: block;
}
</style>