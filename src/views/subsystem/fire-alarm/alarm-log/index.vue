<!--
 * @Author: MJ
 * @Date: 2021-10-28 14:36:27
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 16:12:42
 * @Description: 
-->
<template>
  <div class="main-box">
    <el-row :gutter="20">
      <el-col :span="4">
        <!-- 树形 -->
        <subsystem-tree
          title="区域列表"
          :treeData="treeData"
          :defaultProps="defaultProps"
          placeholder="输入区域名称"
          searchKey="regionName"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>
      <el-col :span="20">
        <!-- 右侧tabel数据 -->
        <alarm-log-table
          class="assembly-container-col"
          :treeNode="treeNode"
        ></alarm-log-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SubsystemTree from "@/components/SubsystemTree";
import AlarmLogTable from "./AlarmLogTable";

import { getRegionTree } from "@/api/subsystem/public-broadcasting/index";

export default {
  name: "ParkingOverview",
  components: {
    SubsystemTree,
    AlarmLogTable,
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
      getRegionTree({ regionId: 0, subSystemCode: "sub-firealarm" }).then(
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

<style scoped lang="scss">
.assembly-container-col {
  min-height: calc(100vh - 124px);
  background-color: #fff;
}
</style>
