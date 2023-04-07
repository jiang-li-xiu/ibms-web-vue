<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-08 17:49:27
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-19 14:06:40
-->
<template>
  <div class="app-container assembly-container">
    <el-row :gutter="14">
      <!-- 树形 -->
      <!-- <el-col :span="4">
        <subsystem-tree
          placeholder="请输入区域列表名称"
          :treeData="treeData"
          title="区域列表"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col> -->

      <!-- 右侧tabel数据 -->
      <el-col :span="24" style="height: calc(100vh - 124px); overflow: hidden">
        <overview-head
          class="assembly-head"
        ></overview-head>

        <div class="assembly-main">
          <!-- 监测数据变化情况 -->
          <envir-monitoring-table></envir-monitoring-table>

          <!-- 温湿度对比 -->
          <temperature-humidity-table
            style="margin-top: 20px"
            :treeNode="treeNode"
          ></temperature-humidity-table>

          <!-- 温湿度对比 -->
          <!-- <monitor-sector-table
            :treeNode="treeNode"
            style="margin-top: 20px; margin-bottom: 20px"
          ></monitor-sector-table> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { getAreaTree } from "@/api/device/districtManagement";

// import SubsystemTree from "@/components/SubsystemTree";
import EnvirMonitoringTable from "./EnvirMonitoringTable.vue";
import OverviewHead from "./EnvirMonitoringHead.vue";
import TemperatureHumidityTable from "./TemperatureHumidityTable.vue";
import MonitorSectorTable from "./MonitorSectorTable.vue";

export default {
  name: "envir-monitoring-eqpt",
  components: {
    // SubsystemTree,
    EnvirMonitoringTable,
    OverviewHead,
    TemperatureHumidityTable,
    MonitorSectorTable,
  },
  data() {
    return {
      // treeData: [], //树形数据
      // treeNode: {},
    };
  },
  created() {
    // this.getTree();
  },
  methods: {
    // // 获取树形数据
    // getTree() {
    //   getAreaTree({ regionId: 0, subSystemCode: "sub-environment" }).then(
    //     (response) => {
    //       this.treeData = response.data;
    //     }
    //   );
    // },
    // getTreeNode(data) {
    //   this.treeNode = data;
    // },
  },
};
</script>
<style scoped lang="scss">
.assembly-container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
.assembly-head {
  min-height: calc(20vh - 100px);
  background-color: #fff;
  margin-bottom: 14px;
}

.assembly-main {
  // min-height: calc(80vh - 101px);
  height: 77.5vh;
  // height: 46.5em;
  overflow-y: scroll;
}

.assembly-main::-webkit-scrollbar {
  width: 0 !important;
}
</style>
