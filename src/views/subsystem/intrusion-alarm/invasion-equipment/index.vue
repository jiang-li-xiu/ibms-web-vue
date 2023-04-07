<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-03-09 14:09:38
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 16:15:13
-->
<template>
  <div class="main-box">
    <el-row :gutter="20">
      <el-col :span="4">
        <subsystem-tree
          title="入侵报警设备区域列表"
          :treeData="treeData"
          :defaultProps="defaultProps"
          placeholder="输入区域名称"
          searchKey="regionName"
          @getTreeNode="getTreeNode"
        >
        </subsystem-tree>
      </el-col>
      <el-col :span="20">
        <equipment-table :treeNode="treeNode"></equipment-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SubsystemTree from "@/components/SubsystemTree";
import EquipmentTable from "./EquipmentTable";

import { getRegionTree } from "@/api/subsystem/public-broadcasting/index";

export default {
  components: {
    SubsystemTree,
    EquipmentTable,
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "regionName",
      },
      treeNode: {},
    };
  },
  mounted() {
    this.getTree();
  },

  methods: {
    getTree() {
      getRegionTree({
        regionId: 0,
        subSystemCode: "sub-instrusiondetect",
      }).then((response) => {
        this.treeData = response.data;
      });
    },
    getTreeNode(data) {
      this.treeNode = data;
    },
  },
};
</script>

<style lang='scss' scoped>
.invasion-equipment-box {
  padding: 20px;
  box-sizing: border-box;
  background-color: #eee;
}
</style>