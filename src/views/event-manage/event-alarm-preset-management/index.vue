<!--
 * @Author: your name
 * @Date: 2021-09-08 18:06:43
 * @LastEditTime: 2022-05-24 16:38:44
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
          title="子系统列表"
          placeholder="请输入子系统名称"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>
      <el-col :span="20">
        <!-- 右侧tabel数据 -->
        <event-plan :treeNode="treeNode"></event-plan>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getListTree } from "@/api/common-config/event-manage/plan";
import SubsystemTree from "@/components/SubsystemTree";
import EventPlan from "./EventPlan";

export default {
  name: "ParkingOverview",
  components: {
    SubsystemTree,
    EventPlan,
  },
  data() {
    return {
      treeData: [], //树形数据
      treeNode: {},
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    // 获取树形数据
    getTree() {
      getListTree().then((response) => {
        this.treeData = response;
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
