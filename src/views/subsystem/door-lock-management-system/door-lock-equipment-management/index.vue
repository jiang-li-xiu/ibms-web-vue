<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 10:54:29
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-17 09:15:40
-->
<template>
  <div class="main-box">
    <el-row :gutter="20">
      <!-- 树形 -->
      <el-col :span="4">
        <subsystem-tree
          title="区域列表"
          :treeData="treeData"
          :defaultProps="defaultProps"
          placeholder="请输入区域名称"
          searchKey="regionName"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>
      <!-- 列表 -->
      <el-col :span="20">
        <equipment-list :treeNode="treeNode"></equipment-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// API
import { getRegionTree } from "@/api/subsystem/access-control-system/accessControlEquipment";
// 组件
import SubsystemTree from "@/components/SubsystemTree";
import EquipmentList from "./EquipmentList";
export default {
  components: { SubsystemTree, EquipmentList },
  data() {
    return {
      //树形数据
      treeData: [],
      defaultProps: {
        children: "children",
        label: "regionName",
      },
      treeNode: {},
    };
  },
  created() {
    this.getRegionTrees();
  },
  methods: {
    // 获取树形数据
    getRegionTrees() {
      getRegionTree({ regionId: 0 }).then((response) => {
        this.treeData = response.data;
      });
    },
    getTreeNode(data) {
      console.log(data);
      this.treeNode = data;
    },
  },
};
</script>

<style></style>
