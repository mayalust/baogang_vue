<template>
  <div
    class="block"
    style="margin:0px 5px 5px 0;height:248px; overflow-y:auto;"
    v-loading="loading"
  >
    <h6>诊断绩效统计（当月内）</h6>
    <table style="width: 100%; table-layout: fixed;">
      <thead></thead>
      <tbody>
        <tr>
          <td
            class="col-md-2"
            style="padding: 3px; text-align: center; position: relative;"
          >
            <span style="display: inline-block; width: 10px;"
              ><span></span>
              <div
                style="font-size: 20px; top: 5px; position: absolute; color: rgba(0, 0, 0, 0);"
              >
                *
              </div></span
            ><span>区域</span>
          </td>
          <td
            class="col-md-5"
            style="padding: 3px; text-align: center; position: relative;"
          >
            <span style="display: inline-block; width: 10px;"
              ><span></span>
              <div
                style="font-size: 20px; top: 5px; position: absolute; color: rgba(0, 0, 0, 0);"
              >
                *
              </div></span
            ><span>综合诊断准确率</span>
          </td>
          <td
            class="col-md-5"
            style="padding: 3px; text-align: center; position: relative;"
          >
            <span style="display: inline-block; width: 10px;"
              ><span></span>
              <div
                style="font-size: 20px; top: 5px; position: absolute; color: rgba(0, 0, 0, 0);"
              >
                *
              </div></span
            ><span>智能诊断准确率</span>
          </td>
        </tr>
        <tr v-for="item in configData" :key="item.id">
          <td
            class="col-md-2"
            style="padding: 3px; text-align: center; color: rgb(255, 255, 255); position: relative;"
          >
            <span style="display: inline-block; width: 10px;"
              ><span></span>
              <div
                style="font-size: 20px; top: 5px; position: absolute; color: rgba(0, 0, 0, 0);"
              >
                *
              </div></span
            ><span> {{ item.label }} </span>
          </td>
          <td class="col-md-5" style="padding: 3px;">
            <div style="display:table;">
              <td style="vertical-align: middle; text-align: right;">
                <span
                  style="width:35px;display:inline-block;padding-right:2px;"
                  >{{ leftValue(item) + "%" }}</span
                >
              </td>
              <td style="vertical-align: middle; width: 100%;">
                <div class="progress sm" style="margin: auto;">
                  <div
                    class="progress-bar"
                    :class="valueClass(item)"
                    :style="leftValuePersent(item)"
                  ></div>
                </div>
              </td>
            </div>
          </td>
          <td class="col-md-5" style="padding: 3px;">
            <div style="display:table;">
              <td style="vertical-align: middle; text-align: right;">
                <span
                  style="width:35px;display:inline-block;padding-right:2px;"
                  >{{ rightValue(item) + "%" }}</span
                >
              </td>
              <td style="vertical-align: middle; width: 100%;">
                <div class="progress sm" style="margin: auto;">
                  <div
                    class="progress-bar"
                    :class="rightValueClass(item)"
                    :style="rightValuePersent(item)"
                  ></div>
                </div>
              </td>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import mapper from "../../../tools/mapper.js";
import PsStatusOverallUnit from "./ps-status-overall-unit";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  props: ["configData", "valueListMap"],
  computed: {
    loading() {
      let { valueListMap } = this;
      return !this.hasKey(valueListMap);
    }
  },
  methods: {
    leftValue(item) {
      let val = this.getValueByIns(item, 7303);
      return Math.round(val * 1000) / 10;
    },
    rightValue(item) {
      let val = this.getValueByIns(item, 7304);
      return Math.round(val * 1000) / 10;
    },
    valueClass(item) {
      let val = this.getValueByIns(item, 7304);
      if (val > 0.5) {
        return "progress-bar-danger";
      }
      return "progress-bar-info";
    },
    rightValueClass(item) {
      let val = this.getValueByIns(item, 7304);
    },
    leftValuePersent(item) {
      let val = this.getValueByIns(item, 7303) || 0;
      return {
        width: val * 100 + "%"
      };
    },
    rightValuePersent(item) {
      let val = this.getValueByIns(item, 7304);
      return {
        width: val * 100 + "%"
      };
    },
    getValueByIns(item, ins) {
      let { valueListMap } = this,
        { id, label } = item,
        value = valueListMap[id];
      let val = this.attribute(value, `${ins}/all,rate/value`);
      return val || 0;
    }
  },
  components: {
    PsStatusOverallUnit
  }
};
</script>
<style lang="less" scoped>
.block {
  overflow: hidden;
}
</style>

