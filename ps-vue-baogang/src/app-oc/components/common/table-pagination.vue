<template>
  <div class="dataTables_paginate paging_simple_numbers">
    <ul class="pagination">
      <li
        class="paginate_button previous"
        @click="prevClick"
        :class="prevDisabled"
      >
        <a>上页</a>
      </li>
      <li
        class="paginate_button"
        v-for="(number, inx) in numbers"
        :key="inx"
        :class="currentPage(number)"
        @click="moveTo(number)"
      >
        <a v-text="n2str(number)"></a>
      </li>
      <li class="paginate_button next" @click="nextClick" :class="nextDisabled">
        <a>下页</a>
      </li>
    </ul>
  </div>
</template>
<script>
import mapper from "../../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  props: ["value", "total"],
  model: {
    prop: "value",
    event: "change"
  },
  computed: {
    prevDisabled() {
      let { value } = this;
      return value == 0 ? "disabled" : "";
    },
    nextDisabled() {
      let { value, total } = this;
      return value == total - 1 ? "disabled" : "";
    },
    numbers() {
      let { value, total } = this,
        inx = 0,
        rs = [].slice.call(new Array(total + 1).join("0"));
      return rs
        .map((n, inx) => {
          if (inx == 0) {
            return inx;
          }
          if (rs.length - 1 == inx) {
            return inx;
          }
          if (inx > value - 3 && inx < value + 3) {
            return inx;
          }
          return "...";
        })
        .reduce((a, b) => {
          if (a[a.length - 1] != b) {
            a.push(b);
          }
          return a;
        }, []);
    }
  },
  methods: {
    n2str(num) {
      if (isNaN(num)) {
        return num;
      }
      return num + 1;
    },
    change(inx) {
      this.$emit("change", inx);
    },
    moveTo(inx) {
      this.change(inx);
    },
    prevClick() {
      let { value } = this;
      if (value > 0) {
        this.moveTo(value - 1);
      }
    },
    nextClick() {
      let { value, total } = this;
      if (value < total - 1) {
        this.moveTo(value + 1);
      }
    },
    currentPage(inx) {
      if (isNaN(inx)) {
        return "disabled";
      }
      return inx == this.value ? "active" : "";
    }
  },
  watch: {
    total(val) {
      let { value } = this;
      if (value > val - 1) {
        this.moveTo(val - 1);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.dataTables_paginate {
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  float: right;
}
</style>