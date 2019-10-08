<template>
  <div class="alert-record-wrapper">
    <div class="search-box">
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
        <ps-button style="color: #fff">查询</ps-button>
      </div>
    </div>

    {{ currentResourceId }}

    <div style="padding: 15px">
      <ps-table :table="table"></ps-table>
    </div>
  </div>
</template>
<script>
import PsUi from "proudsmart-ui";
import mapper from "../../tools/mapper";

const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  name: "MalfunctionHistory",
  computed: {
    ...mapState({
      resourceInfo: ["currentResourceId"]
    })
  },
  methods: {
    ...mapActions({
      alertInfo: ["getAlertList"]
    })
  },
  data() {
    let _this = this;
    return {
      alertResource: "",
      beginDate: "",
      endDate: "",
      table: new PsUi.Table({
        columns: [
          {
            key: "deviceId",
            label: "设备编号"
          },
          {
            key: "department",
            label: "基地"
          },
          {
            key: "ProductionLineName",
            label: "产线"
          },
          {
            key: "failureName",
            label: "故事/事故名称"
          },
          {
            key: "stopBeginTime",
            label: "停机开始时间",
            type: "dateTime"
          },
          {
            key: "stopEndTime",
            label: "停机结束时间",
            type: "dateTime"
          },
          {
            key: "specialtyProp",
            label: "专业属性"
          },
          {
            key: "failureGrade",
            label: "事故等级"
          },
          {
            key: "dutyUserName",
            label: "责任人"
          },
          {
            key: "correctiveAction",
            label: "纠正措施"
          }
        ],
        initToExecuteAjax: false,
        // realPage: true,
        ajax(d) {
          console.log(d);
          // return _this.getAlertList(page);
          return _this.$ps.post(
            "deviceResumeUIService.getDeviceFaultResumeListByDeviceId",
            [
              d.parameter,
              {
                // stopBeginTime:[time?time.firstTimeFrom:"",time?time.firstTimeTo:""]
              }
            ]
          );
        }
      })
    };
  },
  watch: {
    currentResourceId: function(n) {
      console.log(n);
      this.table.refresh(n);
    }
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
