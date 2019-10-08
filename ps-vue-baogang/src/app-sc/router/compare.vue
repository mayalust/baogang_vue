<template>
  <div class="tracker-wrapper">
    <div class="leftKpi">
      <p>
        <span>指标</span>
        <ps-select v-model="kpinode" :options="trackerJson" @change="changeSelect" width="200px"></ps-select>
      </p>
      <div>
        <ul>
          <li v-for="(v,i) in kpiChildren">
            <ps-checkbox v-model="v.check" @change="kpiChange(v)">{{v.label}}</ps-checkbox>

          </li>
        </ul>
        分类:
        <ul>
          <li v-for="(v,i) in categoryChildren">
            <ps-checkbox v-model="v.check" @change="categoryChange(v)">{{v.label}}</ps-checkbox>

          </li>
        </ul>
      </div>
    </div>
    <div class="showKpi">
      <div class="searchParams">
<!--        <div v-if="false">-->
<!--          基地test：-->
<!--          <ps-button-group class="scroll">-->
<!--            <ps-button-->
<!--                    outline-->
<!--                    v-for="customer in customerName"-->
<!--                    @click="customerClick(customer)"-->
<!--                    :class="[{ active: customer.id === customerSelected }, 'btnMargin']"-->
<!--                    :key="customer.id"-->
<!--            >{{ customer.label }}</ps-button-->
<!--            >-->
<!--          </ps-button-group>-->
<!--        </div>-->

        <div class="search">
          <ps-button outline @click="searchClick">
            <span class="glyphicon glyphicon-search">搜索</span>
          </ps-button>
        </div>

        <div class="params">
          <div>
            基地：
            <ps-button-group class="scroll">
              <ps-button
                      outline
                      v-for="(domin, i) in domins"
                      @click="dominClick(domin.value)"
                      :class="[{ active: domin.value.id === dominSelected }, 'btnMargin']"
                      :key="domin.id"
              >{{ domin.value.label }}</ps-button
              >
            </ps-button-group>
          </div>

          <div v-if="customerShow">
            区域：
            <ps-button-group class="scroll">
              <ps-button
                      outline
                      v-for="(customer, i) in customers"
                      @click="customerClick(customer)"
                      :class="[{ active: customer.id === customerSelected }, 'btnMargin']"
                      :key="customer.id"
              >{{ customer.label }}</ps-button
              >
            </ps-button-group>
          </div>

          <div v-if="projectShow">
            产线：
            <ps-button-group class="scroll">
              <ps-button
                      outline
                      v-for="(project, i) in projects"
                      @click="projectClick(project)"
                      :class="[{ active: project.id === projectSelected }, 'btnMargin']"
                      :key="project.id"
              >{{ project.label }}</ps-button
              >
            </ps-button-group>
          </div>
        </div>

        <div class="searchTime">

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
        </div>

        {{dicTest}}

      </div>
    </div>

  </div>
</template>
<script>
import PsUi from "proudsmart-ui";
import mapper from "../../tools/mapper";
import trackerJson from "../../json/tracker.json";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;

export default {
  name: "Tracker",
  data() {
    return {
      customers: [],
      projects: [],
      customerShow: false,
      projectShow: false,
      customerName: [
        {
          id: 0,
          label: "第一个"
        },
        {
          id: 1,
          label: "第2个"
        }
      ],
      dominsName: [],
      dominSelected: null,
      customerSelected: null,
      projectSelected: null,
      dominId: null,
      customerId: null,
      projectId: null,
      trackerJson,
      kpinode: "1",
      kpiChildren: trackerJson[0].children,
      categoryChildren: trackerJson[0].children[0].category,
      categoryId: trackerJson[0].children[0].category[0].id,
      beginDate: "",
      endDate: ""
    };
  },
  computed: {
    ...mapState({
      resourceInfo: ["rootResources"]
    }),
    ...mapState('dictsInfo', {
      dicTest: state => state.dictArr
    }),
    domins: function() {
      return this.rootResources.data
        ? this.rootResources.data[0].children
        : [
            {
              value: {
                id: "-1",
                label: "加载ing。。。。"
              }
            }
          ];
    }
  },
  mounted() {
    this.$ps
      .post("resourceUIService.getResourceByModelId", "300")
      .then(domin => {
        this.customerName = domin;
      });
  },
  methods: {
    customerClick: function(d) {
      this.customerSelected = d.id;
      this.customerId = d.id;
      if (d.children && d.children.length > 0) {
        this.projects = d.children;
        this.projectShow = true;
      } else {
        this.projectShow = false;
      }
    },
    dominClick: function(d) {
      this.dominSelected = d.id;
      this.dominId = d.id;
      if (d.children && d.children.length > 0) {
        this.customers = d.children;
        this.customerShow = true;
      } else {
        this.customerShow = false;
        this.projectShow = false;
      }
    },
    projectClick: function(d) {
      console.log(d);
      this.projectSelected = d.id;
      this.projectId = d.id;
    },
    changeSelect: function (d,e) {
      this.kpiChildren = e.children;
      this.categoryChildren = e.children[0].category;
      this.categoryId = e.children[0].category[0].id;
    },
    kpiChange: function (d) {
      this.kpiChildren.forEach(b => {
        if(b.id !== d.id){
          b.check = false;
        }
      })
      this.categoryChildren = d.category;
      this.categoryId = d.category[0].id;
    },
    categoryChange: function (d) {
      this.categoryChildren.forEach(b => {
        if(b.id !== d.id){
          b.check = false;
        }
      })
      this.categoryId = d.id;
    },
    searchClick: function () {
      console.log(this._data);
      this.getAllDicts();
    },
    ...mapActions({
      dictsInfo: ["getAllDicts"]
    })
  }
};
</script>
<style scoped lang="less">
.tracker-wrapper {
  .scroll {
    /*overflow-x: scroll;*/
    /*width: 100%;*/
  }
  .active {
    background-color: #308ee0;
    color: #fff;
  }
  .btnMargin {
    margin: 3px;
  }
  .content-box-frame {
    background: red;
  }
  .leftKpi {
    width: 20%;
    border: 1px solid;
    float: left;
  }
  .showKpi {
    width: 70%;
    border: 1px solid;
    float: left;
  }
  ul {
    li {
      list-style: none;
    }
  }
  .search-item {
    display: inline-block;
    vertical-align: top;
    padding: 5px;
    width: 15%;
  }
}
</style>
