<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-08 17:49:27
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 16:04:32
-->
<template>
  <div class="main-box">
    <el-row :gutter="20">
      <!-- 树形 -->
      <el-col :span="4">
        <subsystem-tree
          placeholder="请输入停车场区域列表名称"
          :treeData="treeData"
          title="停车场区域列表"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>
      <!-- 右侧tabel数据 -->
      <el-col :span="20">
        <accessrecord-head class="assembly-head"></accessrecord-head>
        <accessrecord-table
          class="assembly-main"
          :treeNode="treeNode"
        ></accessrecord-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAreaTree } from "@/api/device/districtManagement";
import SubsystemTree from "@/components/SubsystemTree";
import AccessrecordTable from "./AccessRecordTable.vue";
import AccessrecordHead from "./AccessRecordHead.vue";
export default {
  name: "ParkingOverview",
  components: {
    SubsystemTree,
    AccessrecordTable,
    AccessrecordHead,
  },
  data() {
    return {
      treeData: null,
      treeNode: {},
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    // 获取树形数据
    getTree() {
      getAreaTree({ regionId: 0, subSystemCode: "sub-parkinglot" }).then(
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
.assembly-head {
  min-height: calc(20vh - 40px);
  background-color: #fff;
  margin-bottom: 20px;
}
.assembly-main {
  min-height: calc(80vh - 104px);
  background-color: #fff;
}
</style>
