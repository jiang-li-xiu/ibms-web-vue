<!--
 * @Author: MJ
 * @Date: 2021-09-08 17:12:29
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 09:45:06
 * @Description: 
-->
<template>
  <div>
    <div class="main-box">
      <!-- 搜索行 -->
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
          <control-record-table :treeNode="treeNode"></control-record-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import SubsystemTree from "@/components/SubsystemTree";
import ControlRecordTable from "./ControlRecordTable";
import { getRegionTree } from "@/api/subsystem/access-control-system/accessControlEquipment";

export default {
  name: "AccessControlRecord",

  components: { SubsystemTree, ControlRecordTable },
  data() {
    return {
      //树形数据
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
      getRegionTree({ regionId: 0, subSystemCode: "sub-entranceguard" }).then(
        (response) => {
          // console.log("tree:", response);
          this.treeData = response.data;
        }
      );
    },
    getTreeNode(data) {
      console.log(data);
      this.treeNode = data;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
