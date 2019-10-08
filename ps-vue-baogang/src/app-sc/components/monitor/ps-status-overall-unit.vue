<template>
  <div :class="colCls" style="padding:0;margin:0;">
    <div>
      <table style="width: 100%; table-layout: fixed;">
        <tbody>
          <tr>
            <td style="padding: 3px;">
              <div
                style="height: 70px; border: 1px solid rgba(250, 250, 250, 0.3); background-color: rgba(0, 100, 250, 0.1);"
              >
                <div
                  style="font-size: 12px; color: rgb(255, 255, 255); position: absolute; top: 12px; left: 15px; font-weight: bold;"
                >
                  {{ label }}
                </div>
                <div
                  style="position: absolute; top: 30px; left: 15px; color: rgb(170, 170, 170); font-size: 10px;"
                >
                  重要台数
                </div>
                <div
                  style="position: absolute; top: 45px; left: 15px; font-size: 14px; font-weight: bold;"
                >
                  {{ description }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row">
      <div style="undefined" class="col-md-6">
        <div>
          <table style="width: 100%; table-layout: fixed;">
            <tbody>
              <tr>
                <td style="padding: 3px;">
                  <div
                    style="height: 25px; width: 40px; margin: auto; position: relative;"
                  >
                    <div
                      style="width: 10px; height: 25px; position: absolute; left: 25px;"
                    ></div>
                    <div
                      style="text-align: right; color: rgb(160, 160, 160); margin-right: 15px; position: absolute; font-size: 12px;"
                    >
                      监测台数
                    </div>
                    <div
                      id="515445641576264"
                      severity="undefined"
                      value="2454"
                      style="color: rgb(255, 255, 255); position: absolute; font-size: 12px; text-align: right; font-weight: bold; top: 12px;"
                    >
                      {{ all }}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 3px;">
                  <div
                    style="height: 25px; width: 40px; margin: auto; position: relative;"
                  >
                    <div
                      style="width: 10px; height: 25px; background-color: rgb(238, 107, 28); position: absolute; left: 25px;"
                    ></div>
                    <div
                      style="text-align: right; color: rgb(160, 160, 160); margin-right: 15px; position: absolute; font-size: 12px;"
                    >
                      警告
                    </div>
                    <div
                      id="515445641576264"
                      severity="3"
                      value="7"
                      style="color: rgb(255, 255, 255); position: absolute; font-size: 12px; text-align: right; font-weight: bold; top: 12px; cursor: pointer;"
                    >
                      {{ warning }}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 3px;">
                  <div
                    style="height: 25px; width: 40px; margin: auto; position: relative;"
                  >
                    <div
                      style="width: 10px; height: 25px; background-color: rgb(236, 228, 23); position: absolute; left: 25px;"
                    ></div>
                    <div
                      style="text-align: right; color: rgb(160, 160, 160); margin-right: 15px; position: absolute; font-size: 12px;"
                    >
                      注意
                    </div>
                    <div
                      id="515445641576264"
                      severity="2"
                      value="11"
                      style="color: rgb(255, 255, 255); position: absolute; font-size: 12px; text-align: right; font-weight: bold; top: 12px; cursor: pointer;"
                    >
                      {{ notice }}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 3px;">
                  <div
                    style="height: 25px; width: 40px; margin: auto; position: relative;"
                  >
                    <div
                      style="width: 10px; height: 25px; background-color: rgb(0, 188, 121); position: absolute; left: 25px;"
                    ></div>
                    <div
                      style="text-align: right; color: rgb(160, 160, 160); margin-right: 15px; position: absolute; font-size: 12px;"
                    >
                      正常
                    </div>
                    <div
                      id="515445641576264"
                      severity="undefined"
                      value="2432"
                      style="color: rgb(255, 255, 255); position: absolute; font-size: 12px; text-align: right; font-weight: bold; top: 12px;"
                    >
                      {{ normal }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-md-6">
        <div style="margin: 0px; font-size: 12px; height: 125px;">
          <div style="height: 100%; width: 100%;" v-svgchart="option"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mapper from "../../../tools/mapper.js";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  props: ["domain", "valueListMap", "col"],
  computed: {
    label() {
      let {
        domain: { label }
      } = this;
      return label;
    },
    colCls() {
      let { col } = this;
      col = col || 2;
      return `col-md-${col}`;
    },
    description() {
      let {
        domain: { description }
      } = this;
      return description || 0;
    },
    all() {
      return this.getValueByInstance("severity,0");
    },
    normal() {
      return this.getValueByInstance("severity,-1");
    },
    notice() {
      return this.getValueByInstance("severity,2");
    },
    warning() {
      return this.getValueByInstance("severity,3");
    },
    risk() {
      return this.getValueByInstance("severity,4");
    },
    total() {
      let { all, normal, notice, warning, risk } = this;
      return normal + notice + warning;
    },
    option() {
      let { all, normal, notice, warning, risk } = this;
      return {
        title: {
          text: "svgChart入门示例"
        },
        grid: {
          top: "5%",
          left: "10%",
          height: "90%"
        },
        legend: {
          data: ["销量"]
        },
        xAxis: {
          show: false
        },
        yAxis: {
          show: false
        },
        series: [
          {
            stack: "总量",
            name: "销量1",
            type: "3dbar",
            itemStyle: {
              normal: {
                color: "#00bc79"
              }
            },
            data: [normal]
          },
          {
            stack: "总量",
            name: "销量2",
            type: "3dbar",
            itemStyle: {
              normal: {
                color: "#efd709"
              }
            },
            data: [notice]
          },
          {
            stack: "总量",
            name: "销量3",
            type: "3dbar",
            itemStyle: {
              normal: {
                color: "#ee6b1c"
              }
            },
            data: [warning]
          }
        ]
      };
    }
  },
  methods: {
    getValueByInstance(instance) {
      let {
          valueListMap,
          domain: { id }
        } = this,
        value = valueListMap[id];
      if (value != null) {
        value = value[6100];
      }
      if (value != null) {
        value = value[instance];
      }
      if (value != null) {
        return value.value;
      }
      return 0;
    }
  }
};
</script>
<style lang="less" scoped>
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