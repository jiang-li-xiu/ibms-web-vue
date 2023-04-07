<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-08 17:49:27
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 15:58:56
-->
<template>
  <div class="main-box">
    <el-row :gutter="20">
      <!-- 树形 -->
      <el-col :span="4">
        <subsystem-tree
          title="停车场区域列表"
          placeholder="请输入停车场区域列表名称"
          :treeData="treeData"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>
      <!-- 右侧tabel数据 -->
      <el-col :span="20">
        <overview-head class="assembly-head"></overview-head>
        <overview-table
          class="assembly-main"
          :treeNode="treeNode"
        ></overview-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAreaTree } from "@/api/device/districtManagement";
import SubsystemTree from "@/components/SubsystemTree";
import OverviewTable from "./ParkingOverviewTable.vue";
import OverviewHead from "./ParkingOverviewHead.vue";
export default {
  name: "ParkingOverview",
  components: {
    SubsystemTree,
    OverviewTable,
    OverviewHead,
  },
  data() {
    return {
      treeData: null,
      treeNode: {},
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    // 获取树形数据
    getTree() {
      getAreaTree({ regionId: 0, subSystemCode: "sub-parkinglot" }).then(
        (response) => {
          this.treeData = response.data;
        }
      );
    },
    getTreeNode(data) {
      this.treeNode = data;
    },
  },
};
</script>
<style scoped lang='scss' >
.assembly-head {
  min-height: calc(20vh - 40px);
  background-color: #fff;
  margin-bottom: 20px;
}
.assembly-main {
  min-height: calc(80vh - 104px);
  background-color: #fff;
}
</style>