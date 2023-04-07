<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-15 08:31:51
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-24 14:54:55
-->
<template>
  <div class="app-container assembly-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <!-- 树形 -->
        <subsystem-tree
          placeholder="请输入区域列表名称"
          :treeData="treeData"
          title="区域列表"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>
      <el-col :span="20">
        <!-- 右侧 tabel 数据 -->
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
import SubsystemTree from "@/components/SubsystemTree";
import EquipmentTable from "./LightingControlTable.vue";
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
      getAreaTree({ regionId: 0 }).then((response) => {
        this.treeData = response.data;
      });
    },
    getTreeNode(data) {
      this.treeNode = data
    },
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
.assembly-container-col {
  min-height: calc(100vh - 124px);
  background-color: #fff;
}
</style>
