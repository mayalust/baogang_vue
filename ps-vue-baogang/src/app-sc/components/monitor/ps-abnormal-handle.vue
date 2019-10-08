<template>
  <div
    class="block"
    style="margin:0px 5px 5px 0;height:248px; overflow-y:auto;"
    v-loading="loading"
  >
    <h6>异常事件处理（当月内）</h6>
    <table style="width: 100%; table-layout: fixed;">
      <tbody>
        <tr>
          <td style="padding: 3px;">
            <div
              style="width: 80%; justify-content: center; align-items: center; display: -webkit-flex; margin: 0px auto;"
            >
              <div
                style="height: 16px; width: 33px; background-color: rgb(210, 0, 6); margin-right: 8px;"
              ></div>
              <div>危险告警数</div>
              <div
                style="height: 16px; width: 33px; background-color: rgb(238, 107, 28); margin-left: 15px; margin-right: 8px;"
              ></div>
              <div>警告告警数</div>
              <div
                style="height: 16px; width: 33px; background-color: rgb(239, 216, 11); margin-left: 15px; margin-right: 8px;"
              ></div>
              <div>注意告警数</div>
              <div
                style="height: 16px; width: 33px; background-color: rgb(163, 85, 249); margin-left: 15px; margin-right: 8px;"
              ></div>
              <div>点检异常数</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <div
        :class="colCls"
        v-echarts="createOption(op)"
        v-for="op in configData"
        :key="op.id"
        style="height:250px"
      ></div>
    </div>
  </div>
</template>
<script>
import mapper from "../../../tools/mapper.js";
import PsStatusOverallUnit from "./ps-status-overall-unit";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  data() {
    return {
      instances: {
        1: "点检异常数",
        2: "注意告警数",
        3: "警告告警数",
        4: "危险告警数"
      }
    };
  },
  props: ["configData", "valueListMap", "col"],
  computed: {
    total(id) {
      let { valueListMap } = this,
        num = 0;
      for (let i in valueListMap) {
        num += this.attribute(valueListMap, [i, 7302, "_", "value"]) - 0 || 0;
      }
      return num;
    },
    loading() {
      let { valueListMap } = this;
      return !this.hasKey(valueListMap);
    },
    colCls() {
      let { col } = this;
      col = col || 2;
      return `col-md-${col}`;
    }
  },
  methods: {
    persentage(id) {
      let { valueListMap, total } = this,
        val = this.attribute(valueListMap, [id, 7302, `_`, "value"]) || 0;
      return (total ? Math.round((val / total) * 10000) / 100 : 0) + "%";
    },
    getValueFromInstance(id, num) {
      let { valueListMap } = this;
      return (
        this.attribute(valueListMap, [id, 7203, `${num},count`, "value"]) || 0
      );
    },
    createOption({ id, label }) {
      return {
        title: {
          text: label,
          textStyle: {
            color: "#ffffff",
            fontSize: 12
          },
          left: "center",
          bottom: "75"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ["#A355F9", "#efd80b", "#ee6b1c", "#d20006"],

        grid: {
          top: "top"
        },
        graphic: [
          {
            type: "image",
            id: "logo",
            right: 11,
            top: 8,
            z: -10,
            bounding: "raw",
            style: {
              width: 200
            }
          }
        ],
        series: [
          {
            name: "",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "36%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center",
                formatter: function(params) {}
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.getValueFromInstance(id, 1),
                name: this.instances[1]
              },
              {
                value: this.getValueFromInstance(id, 2),
                name: this.instances[2]
              },
              {
                value: this.getValueFromInstance(id, 3),
                name: this.instances[3]
              },
              {
                value: this.getValueFromInstance(id, 4),
                name: this.instances[4]
              }
            ]
          },
          {
            name: "",
            type: "pie",
            clockWise: false,
            hoverAnimation: true,
            radius: ["50", "50"],
            center: ["50%", "36%"],
            label: {
              normal: {
                position: "center"
              }
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{c}: {b} "
            },
            data: [
              {
                label: {
                  normal: {
                    formatter: this.persentage(id),
                    textStyle: {
                      color: "#ffffff",
                      fontSize: 18
                    }
                  }
                },
                value: "异常处理率",
                name: this.persentage(id) + ""
              }
            ]
          }
        ]
      };
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
.row {
  padding: 0;
  margin: 0;
}
.col-md-2,
.col-md-6 {
  padding: 0;
  margin: 0;
}
</style>

