<!--
 * @Author: MJ
 * @Date: 2021-09-15 16:18:37
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 16:49:33
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
          placeholder="输入区域名称"
          searchKey="regionName"
          @getTreeNode="getTreeNode"
        >
        </subsystem-tree>
      </el-col>
      <el-col :span="20">
        <broadcast-device-view-table
          :treeNode="treeNode"
        ></broadcast-device-view-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SubsystemTree from "@/components/SubsystemTree";
import BroadcastDeviceViewTable from "./BroadcastDeviceViewTable";

import { getRegionTree } from "@/api/subsystem/public-broadcasting/index";

export default {
  components: {
    SubsystemTree,
    BroadcastDeviceViewTable,
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
      getRegionTree({ regionId: 0, subSystemCode: "sub-broadcast" }).then(
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

<style lang='scss' scoped>
</style>