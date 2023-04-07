<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-09-07 09:18:36
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-05-31 17:17:36
-->
<template>
  <div class="subsystemtree">
    <!-- 顶部标题 -->
    <div class="title">{{ title }}</div>

    <!-- 搜索 -->
    <div class="search" v-if="show">
      <el-input
        :placeholder="placeholder"
        v-model="filterText"
        clearable
      ></el-input>
    </div>

    <!-- 树形 -->
    <div class="tree">
      <el-tree
        v-if="condition"
        class="filter-tree"
        :data="dataList"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        :default-expanded-keys="[0]"
        node-key="regionId"
        @node-click="handleNodeClick"
        ref="tree"
      ></el-tree>
    </div>
  </div>
</template>

<script>
import bus from "@/utils/bus.js";

export default {
  name: "SubsystemTree",
  props: {
    title: {
      type: String,
      default: () => {
        return "顶部标题";
      },
    },
    show: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    placeholder: {
      type: String,
      default: () => {
        return "请输入需要搜索的字段";
      },
    },
    treeData: {
      type: Array,
      default: () => {
        return [
          {
            label: "一级 1",
            regionName: "一级 1",
            childrens: [
              {
                regionName: "二级 1-1",
                label: "一级 1 / 二级 1-1",
                childrens: [
                  {
                    regionName: "三级 1-1-1",
                    label: "一级 1 / 二级 1-1 / 三级 1-1-1",
                  },
                ],
              },
            ],
          },
        ];
      },
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          childrens: "childrens",
          label: "label",
        };
      },
    },
    // 需要搜索的key值
    searchKey: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  created() {
    this.getData(this.treeData);
  },
  data() {
    return {
      // 搜索字段
      filterText: "",
      condition: true,
      dataList: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    treeData: function (val) {
      this.getData(val);
    },
  },

  beforeDestroy() {
    bus.$off("busMethod"); // 组件销毁时关闭监听
  },

  methods: {
    getData(val) {
      let list = [
        {
          regionId: 0,
          id: 0,
          sectorName: "所有部门",
          childrens: val,
        },
      ];
      this.condition = false;
      this.dataList = this.fnb(list);
      this.condition = true;
    },
    /*
     * list 这里开始为 arr 数组
     * ico 连接 的字符
     * site 记录前一段的位置
     */
    fnb(list, ico = "", site = "") {
      return list.map((item) => {
        item.label = site + ico + item.sectorName;
        // 判断有没有子节点 NO
        if (!item.childrens) {
          return item;
        } else {
          item.childrens = this.fnb(
            item.childrens,
            " / ",
            site + ico + item.sectorName
          );
          return item;
        }
      });
    },
    // 搜索功能：对树节点进行筛选时执行的方法
    filterNode(value, data) {
      if (!value) return true;
      return data[this.searchKey].indexOf(value) !== -1;
    },

    // 鼠标左键方法
    handleNodeClick(data) {
      this.$emit("busMethod", data); // 传递id到table组件
    },
  },
};
</script>

<style scoped lang="scss">
.subsystemtree {
  min-height: calc(100vh - 124px);
  background: #fff;
  .title {
    width: 100%;
    background-color: #434348;
    text-align: center;
    color: #fff;
    height: 5vh;
    line-height: 5vh;
    font-weight: 600;
    font-size: 15px;
  }
  .search {
    padding: 10px;
  }
}
</style>
