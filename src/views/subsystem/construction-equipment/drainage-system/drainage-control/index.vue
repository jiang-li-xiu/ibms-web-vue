<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-07 08:38:14
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-24 15:28:25
-->
<template>
  <div class="main-box">
    <el-row :gutter="20">
      <el-col :span="4">
        <subsystem-tree
          title="区域列表"
          :treeData="treeData"
          :defaultProps="defaultProps"
          placeholder="请输入区域名称"
          searchKey="regionName"
          @getTreeNode="getTreeNode"
        >
        </subsystem-tree>
      </el-col>
      <el-col :span="20">
        <drainage-control-table
          :treeNode="treeNode"
        ></drainage-control-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getAreaTree } from "@/api/device/districtManagement";
import SubsystemTree from "@/components/SubsystemTree";
import DrainageControlTable from "./DrainageControlTable";
export default {
  name: "DrainageControl",
  components: {
    SubsystemTree,
    DrainageControlTable,
  },
  props: {},
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
<style lang="scss" scoped>
</style>
