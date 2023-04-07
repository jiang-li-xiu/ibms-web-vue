<!--
 * @Author: your name
 * @Date: 2021-09-08 18:06:43
 * @LastEditTime: 2022-05-17 16:35:00
 * @LastEditors: PengXuanwei
 * @Description: In User Settings Edit
 * @FilePath: \ibms-web-vue\src\views\subsystem\parking-system\parking-equipment\index.vue
-->
<template>
  <div class="main-box">
    <el-row :gutter="20">
      <el-col :span="4">
        <!-- 树形 -->
        <subsystem-tree
          :treeData="treeData"
          title="区域列表"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>
      <el-col :span="20">
        <!-- 右侧tabel数据 -->
        <equipment-table
          class="assembly-container-col"
          :treeNode="treeNode"
        ></equipment-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAreaTree } from "@/api/device/districtManagement";
import SubsystemTree from "@/components/SubsystemTree/index.vue";
import EquipmentTable from "./EnvirMonitoringEqptTable.vue";
export default {
  name: "ParkingOverview",
  components: {
    SubsystemTree,
    EquipmentTable,
  },
  data() {
    return {
      treeData: [], //树形数据
      treeNode: {},
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    // 获取树形数据
    getTree() {
      getAreaTree({ regionId: 0, subSystemCode: "sub-environment" }).then(
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
.assembly-container-col {
  min-height: calc(100vh - 124px);
  background-color: #fff;
}
</style>