<template>
  <div class="alert-record-wrapper">
    <div class="search-box">
      <div class="search-item">
        <p>告警来源</p>
        <ps-select
            v-model="alertResource"
            :options="alertResourceOptions"
            :filter="false"
        ></ps-select>
      </div>

      <div class="search-item">
        <p>开始时间</p>
        <ps-date
            v-model="beginDate"
            :with-time="false"
            format="yyyy-MM-dd"
        ></ps-date>
      </div>

      <div class="search-item">
        <p>结束时间</p>
        <ps-date
            v-model="endDate"
            :with-time="false"
            format="yyyy-MM-dd"
        ></ps-date>
      </div>

      <div class="search-item">
        <p style="color: transparent">查询</p>
        <ps-button style="color: #fff" @click="searchData">查询</ps-button>
      </div>
    </div>

    <div style="padding: 15px">
      <ps-table :table="table"></ps-table>
    </div>
  </div>
</template>
<script>
import PsUi from "proudsmart-ui";
import mapper from "../../../tools/mapper";

const {mapState, mapGetters, mapMutations, mapActions} = mapper;
const getParameter = (resource, alertResource, beginDate, endDate) => {

  let param = {
    severities: "1,2,3,4",
    states: "0,5,10,20,30",
    appName: alertResource ? alertResource : '',
    firstTimeFrom: beginDate ? beginDate : null,
    firstTimeTo: endDate ? endDate : null
  }
  if (resource.category === 'Device') {
    param.nodeIds = resource.id + '';
  } else if (resource.category === 'Domain') {
    param.domain = resource.domains;
  }
  return param;
};
export default {
  name: "AlertRecord",
  computed: {
    ...mapState({
      resourceInfo: ["currentResourceId", 'currentResource']
    })
  },
  methods: {
    ...mapActions({
      alertInfo: ["getAlertList"]
    }),
    searchData () {
      this.table.refresh(getParameter(this.currentResource, this.alertResource, this.beginDate, this.endDate));
    }
  },
  watch: {
    currentResource: {
      immediate: true,
      handler (resource) {
        this.table.refresh(getParameter(resource, this.alertResource, this.beginDate, this.endDate));
      }
    }
  },
  data () {
    let _this = this;
    return {
      alertResource: "",
      beginDate: "",
      endDate: "",
      alertResourceOptions: [{
        id: 0,
        label: "全部"
      }, {
        id: "1",
        label: "在线预警"
      }, {
        id: "2",
        label: "智能诊断"
      }, {
        id: "3",
        label: "大数据分析"
      }, {
        id: "4",
        label: "离线诊断"
      }],
      table: new PsUi.Table({
        columns: [{
          key: "alertId",
          label: "报警编号"
        }, {
          key: "severity",
          label: "报警级别",
          type: "status",
          format (value, row) {
            let ret = [];
            switch (value) {
              case 2:
                ret = ["注意", "info"];
                break;
              case 3:
                ret = ["警告", "warning"];
                break;
              case 4:
                ret = ["危险", "danger"];
                break;
            }
            return ret;
          }
        }, {
          key: "firstArisingTime",
          label: "首次报警时间",
          type: "dateTime"
        }, {
          key: "count",
          label: "报警次数"
        }, {
          key: "arisingTime",
          label: "最近报警时间",
          type: "dateTime"
        }, {
          key: "instanceName",
          label: "报警位置",
          format (value, row) {
            return row.message.split(' ')[0];
          }
        }, {
          key: "appName",
          label: "报警来源",
          format (value) {
            switch (value) {
              case '1':
                return '在线预警';
              case '2':
                return '智能诊断';
              case '3':
                return '大数据分析';
              case '4':
                return '离线诊断';
              case '130':
                return '点检异常';
              case '100':
                return '当日点检';
              case '110':
                return '精密检测';
              case '120':
                return '检修计划';
              case '140':
                return '备修委托';
              case '210':
                return '临时委托';
              case '220':
                return '辊道备修';
              case '合并告警':
                return '合并告警';
              default:
                return value;
            }
          }
        }, {
          key: "message",
          label: "报警描述"
        }, {
          key: "state",
          label: "报警状态",
          type: 'status',
          format (value) {
            let ret = [];
            if (value == 0 || value == -100) {
              ret = ['新产生', 'info'];
            } else if (value == 5 || value == 10) {
              ret = ['已确认', 'primary'];
            } else if (value == 20) {
              ret = ['已解决', 'success'];
            } else {
              ret = ['已忽略', 'warning'];
            }
            return ret;
          }
        }],
        initToExecuteAjax: false,
        ajax (d) {
          return _this.getAlertList(d.parameter);
        }
      })
    };
  }
};
</script>
<style scoped lang="less">
.alert-record-wrapper {
  .search-box {
    padding: 10px;

    .search-item {
      display: inline-block;
      vertical-align: top;
      padding: 5px;
      width: 15%;
    }
  }
}
</style>
