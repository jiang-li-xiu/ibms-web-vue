<!--
 * @Author: MJ
 * @Date: 2021-09-17 11:06:25
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 16:52:14
 * @Description: 
-->
<template>
  <div class="main-box">
    <el-row :gutter="20">
      <el-col :span="4">
        <subsystem-tree
          title="广播设备区域列表"
          :treeData="treeData"
          :defaultProps="defaultProps"
          placeholder="请输入区域名称"
          searchKey="regionName"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>

      <el-col :span="20">
        <timed-playback-Management-table
          :treeNode="treeNode"
        ></timed-playback-Management-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SubsystemTree from "@/components/SubsystemTree";
import TimedPlaybackManagementTable from "./TimedPlaybackManagementTable";

import { getRegionTree } from "@/api/subsystem/access-control-system/accessControlEquipment";

export default {
  components: {
    SubsystemTree,
    TimedPlaybackManagementTable,
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
      this.treeNode = data;
    },
  },
};
</script>

<style lang='scss' scoped>
.timed-playback-management-box {
  padding: 20px;
  background-color: #eee;
}
</style>