<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-15 08:31:51
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-23 14:53:05
-->
<template>
  <div class="main-box">
    <el-row :gutter="20">
      <el-col :span="4">
        <!-- 树形 -->
        <subsystem-tree
          placeholder="请输入区域列表名称"
          :treeData="treeData"
          :defaultProps="defaultProps"
          title="区域列表"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>
      <el-col :span="20">
        <!-- 右侧tabel数据 -->
        <equipment-table
          :treeNode="treeNode"
        ></equipment-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAreaTree } from "@/api/device/districtManagement";
import SubsystemTree from "@/components/SubsystemTree";
import EquipmentTable from "./PowerDistributionSystemSeeTable.vue";
export default {
  name: "ParkingOverview",
  components: {
    SubsystemTree,
    EquipmentTable,
  },
  data() {
    return {
      treeData: [], //树形数据
      defaultProps: {
        children: "children",
        label: "regionName",
      },
      treeNode: {},
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    // 获取树形数据
    getTree() {
      getAreaTree({ regionId: 0, subSystemCode: "sub-electricsystem" }).then(
        (response) => {
          this.treeData = response.data;
        }
      );
    },
    getTreeNode(data) {
      this.treeNode = data
    },
  },
};
</script>
<style scoped lang='scss' >
</style>