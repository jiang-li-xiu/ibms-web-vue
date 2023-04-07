<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-09-13 18:35:39
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 16:24:09
-->

<template>
  <div class="main-box">
    <el-row :gutter="20">
      <el-col :span="4">
        <!-- 树形 -->
        <subsystem-tree
          title="监控区域列表"
          placeholder="输入监控点名称"
          :treeData="treeData"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>
      <el-col :span="20">
        <!-- 右侧tabel数据 -->
        <alarm-table :treeNode="treeNode"></alarm-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// api接口
import { getAreaTree } from "@/api/subsystem/intrusion-alarm";
import SubsystemTree from "@/components/SubsystemTree";
import AlarmTable from "./AlarmTable.vue";
export default {
  components: {
    SubsystemTree,
    AlarmTable,
  },
  data() {
    return {
      // 区域树结构数据
      treeData: [],
      treeNode: {},
    };
  },
  created() {
    this.getAreaListTree();
  },
  methods: {
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
<style scoped lang='scss' >
</style>
