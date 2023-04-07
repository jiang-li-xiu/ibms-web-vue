<!--
 * @Author: MJ
 * @Date: 2021-09-08 10:22:42
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 15:59:20
 * @Description: 
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
        <video-equipment-table
          :treeNode="treeNode"
        ></video-equipment-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SubsystemTree from "@/components/SubsystemTree";
import VideoEquipmentTable from "./VideoEquipmentTable";

import { getRegionTree } from "@/api/subsystem/access-control-system/accessControlEquipment";

export default {
  name: "AccessControlEquipment",
  components: {
    SubsystemTree,
    VideoEquipmentTable,
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

  mounted() {},

  methods: {
    // 获取树形数据
    getRegionTrees() {
      getRegionTree({ regionId: 0, subSystemCode: "sub-videomanager" }).then(
        (response) => {
          // console.log("tree:", response);
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

<style lang="scss" scoped>
</style>
