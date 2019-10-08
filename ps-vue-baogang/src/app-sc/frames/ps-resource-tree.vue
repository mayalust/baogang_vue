<template>
  <div class="wrap" v-loading="resources.length == 0 || showloading">
    <div class="input-group">
      <div class="input-item">
        <input class="form-control" v-model="searchKey" />
      </div>
      <div class="input-item button">
        <button class="btn btn-primary" @click="searchClick(searchKey)">
          查询
        </button>
      </div>
      <div class="input-item button">
        <button class="btn btn-primary" @click="clearClick(searchKey)">
          清空
        </button>
      </div>
    </div>

    <div class="tree-wrap">
      <ps-tree
        :level="1"
        :option="res"
        :key="res.value.id"
        :last="i == filter(resources).length - 1"
        v-for="(res, i) in filter(resources)"
      />
    </div>
    <div v-if="filter(resources).length == 0">
      无满足条件的记录
    </div>
  </div>
</template>
<script>
import mapper from "../../tools/mapper";
import PsTree from "./ps-tree";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  data() {
    return {
      searchKey: "",
      showloading: false
    };
  },
  methods: {
    ...mapActions({
      resourceInfo: ["search", "open"]
    }),
    filter(children) {
      let { visibleMap } = this;
      return (children || []).filter(({ id }) => {
        return visibleMap[id] == null ? true : visibleMap[id];
      });
    },
    clearClick() {
      this.searchKey = "";
      this.searchClick(this.searchKey);
    },
    searchClick(searchKey) {
      if (searchKey) {
        this.search(({ label, externalDevId, modelId }) => {
          if (modelId < 1000) {
            return label.indexOf(searchKey) != -1;
          }
          return (
            label.indexOf(searchKey) != -1 ||
            externalDevId.indexOf(searchKey) != -1
          );
        });
      } else {
        this.search(searchKey);
        this.open(node => {
          return node.id == this.currentResourceId;
        });
      }
    }
  },
  computed: {
    ...mapState({
      resourceInfo: ["rootResources", "currentResourceId", "visibleMap"]
    }),
    resources() {
      let {
        rootResources: { data }
      } = this;
      return data || [];
    }
  },
  watch: {
    rootResources: {
      handler(res) {
        let { currentResourceId } = this;
        this.open(({ id }) => {
          return id == currentResourceId;
        });
      },
      immediate: true
    }
  },
  components: {
    PsTree
  }
};
</script>
<style lang="less" scoped>
.wrap {
  background-color: rgba(0, 0, 0, 0.6);
  width: calc(100% - 10px);
  height: calc(100vh - 110px);
  position: relative;
  .input-group {
    display: table;
    width: 100%;
    .input-item {
      vertical-align: middle;
      display: table-cell;
      padding: 3px;
      &.button {
        width: 60px;
      }
    }
  }
  .tree-wrap {
    width: 100%;
    height: calc(100% - 50px);
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>