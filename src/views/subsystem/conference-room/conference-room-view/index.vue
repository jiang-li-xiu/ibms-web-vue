<!--
 * @Author: MJ
 * @Date: 2021-10-22 15:13:51
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-25 09:14:13
 * @Description: 
-->
<template>
  <div class="app-container conference-room-view-box">
    <el-row :gutter="20">
      <el-col :span="4">
        <!-- 树形 -->
        <subsystem-tree :treeData="treeData" title="区域列表" @getTreeNode="getTreeNode"></subsystem-tree>
      </el-col>
      <el-col :span="20">
        <conference-room-view-table :treeNode="treeNode"></conference-room-view-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SubsystemTree from "@/components/SubsystemTree";
import ConferenceRoomViewTable from "./ConferenceRoomViewTable";

import { getAreaTree } from "@/api/subsystem/intrusion-alarm";

export default {
  components: {
    SubsystemTree,
    ConferenceRoomViewTable,
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
      getAreaTree({ regionId: 0 }).then((res) => {
        this.treeData = res.data;
      });
    },
    getTreeNode(data) {
      this.treeNode = data;
    },
  },
};
</script>

<style scoped lang="scss">
.conference-room-view-box {
  background-color: #eee;
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
</style>
