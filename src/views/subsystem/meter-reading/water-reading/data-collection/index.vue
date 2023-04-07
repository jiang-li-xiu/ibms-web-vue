<!--
 * @Author: your name
 * @Date: 2021-09-08 18:06:43
 * @LastEditTime: 2022-05-17 16:25:26
 * @LastEditors: PengXuanwei
 * @Description: In User Settings Edit
 * @FilePath: \ibms-web-vue\src\views\subsystem\parking-system\parking-equipment\index.vue
-->
<template>
  <div class="app-container assembly-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <!-- 树形 -->
        <subsystem-tree
          placeholder="请输入区域名称"
          :treeData="treeData"
          title="区域列表"
          @getTreeNode="getTreeNode"
        ></subsystem-tree>
      </el-col>

      <el-col :span="20">
        <!-- 右侧tabel数据 -->
        <datacollection-table
          class="assembly-container-col"
          :treeNode="treeNode"
        ></datacollection-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SubsystemTree from "@/components/SubsystemTree";
import DatacollectionTable from "./DataCollectionTable";
import { getAreaTree } from "@/api/device/districtManagement";
export default {
  name: "data-collection",
  components: {
    SubsystemTree,
    DatacollectionTable,
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
      getAreaTree({ regionId: 0, subSystemCode: "sub-meterread" }).then(
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
.assembly-container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
.assembly-container-col {
  min-height: calc(100vh - 124px);
  background-color: #fff;
}
</style>
