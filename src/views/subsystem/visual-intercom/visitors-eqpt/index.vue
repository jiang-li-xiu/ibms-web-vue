<!--
 * @Author: your name
 * @Date: 2021-09-08 18:06:43
 * @LastEditTime: 2022-05-17 16:48:11
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
          placeholder="请输入区域名称"
          searchKey="regionName"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>

      <el-col :span="20">
        <!-- 右侧tabel数据 -->
        <visitorseqpt-table :treeNode="treeNode"></visitorseqpt-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SubsystemTree from "@/components/SubsystemTree";
import VisitorseqptTable from "./VisitorseqptTable";

import { getAreaTree } from "@/api/subsystem/intrusion-alarm";

export default {
  name: "ParkingOverview",
  components: {
    SubsystemTree,
    VisitorseqptTable,
  },
  data() {
    return {
      treeData: [],
      treeNode: {},
    };
  },
  mounted() {
    this.getAreaListTree();
  },

  methods: {
    // 获取属性数据
    getAreaListTree() {
      getAreaTree({ regionId: 0, subSystemCode: "sub-intercom" }).then(
        (res) => {
          this.treeData = res.data;
        }
      );
    },
    getTreeNode(data) {
      this.treeNode = data;
    },
  },
};
</script>

<style scoped lang='scss'>
</style>