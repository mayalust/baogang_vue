<template>
  <div class="dataTables_length">
    <table>
      <tr>
        <td>每页显示</td>
        <td style="width:70px;">
          <el-select
            v-model="value"
            placeholder="请选择"
            @change="change($event)"
          >
            <el-option v-for="item in pageSizeDics" :value="item" :key="item" />
          </el-select>
        </td>
        <td>
          项
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import mapper from "../../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  props: ["value"],
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      pageSizeDics: [5, 10, 15, 20, 25, 50, 75, 100]
    };
  },
  methods: {
    change(event) {
      this.$emit("change", event);
    }
  }
};
</script>
<style lang="less" scoped>
span {
  color: white;
}
</style>