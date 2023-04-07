<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-08 17:49:27
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-10-19 14:24:54
-->
<template>
  <div class="app-container assembly-container">
    <el-row :gutter="14">
      <!-- 树形 -->
      <el-col :span="4">
        <subsystem-tree
          placeholder="请输入区域列表名称"
          :treeData="treeData"
          title="区域列表"
        ></subsystem-tree>
      </el-col>
      <!-- 右侧tabel数据 -->
      <el-col :span="20">
        <overview-head class="assembly-head"></overview-head>
        <overview-table class="assembly-main"></overview-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAreaTree } from "@/api/device/districtManagement";
import SubsystemTree from "@/components/SubsystemTree";
import OverviewTable from "./FreshAirFanMonitoringTable.vue";
import OverviewHead from "./FreshAirFanMonitoringHead.vue";
export default {
  name: "envir-monitoring-eqpt",
  components: {
    SubsystemTree,
    OverviewTable,
    OverviewHead,
  },
  data() {
    return {
      treeData: [], //树形数据
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    // 获取树形数据
    getTree() {
      getAreaTree({ regionId: 0 }).then((response) => {
        this.treeData = response.data;
      });
    },
  },
};
</script>
<style scoped lang='scss' >
.assembly-container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
.assembly-head {
  min-height: calc(50vh - 50px);
  margin-bottom: 14px;
}
.assembly-main {
  min-height: calc(50vh - 101px);
  background-color: #fff;
}
</style>