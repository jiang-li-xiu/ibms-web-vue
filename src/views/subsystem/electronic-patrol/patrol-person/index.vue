<!--
 * @Author: RobertFan
 * @Date: 2022-05-05 16:59:40
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-05-31 17:26:37
 * @Description: 
-->
<template>
  <div class="app-container assembly-container">
    <div class="card-container">
      <!-- 部门列表 -->
      <div class="department">
        <!-- 树形 -->
        <patrol-person-tree
          title="巡更部门列表"
          :treeData="treeData"
          :searchKey="'sectorName'"
          :defaultProps="defaultProps"
          placeholder="输入巡更部门名称"
          @busMethod="handleTreeClick"
        ></patrol-person-tree>
      </div>
      <!-- 列表数据 -->
      <div class="department-list">
        <patrol-person-table ref="table"></patrol-person-table>
      </div>
    </div>
  </div>
</template>

<script>
import PatrolPersonTree from "./PatrolPersonTree";
import PatrolPersonTable from "./PatrolPersonTable.vue";

import { getDeptDeptTree } from "@/api/subsystem/electronic-patrol/patrol-person/index.js";

export default {
  components: { PatrolPersonTree, PatrolPersonTable },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "childrens",
        label: "sectorName",
      },
    };
  },
  created() {
    this.getTreeList();
  },

  methods: {
    // 获取属性列表
    getTreeList() {
      getDeptDeptTree(0).then(({ code, rows }) => {
        if (code == 200) {
          this.treeData = rows;
        }
      });
    },

    // 获取树形组件传过来的参数
    handleTreeClick(data){
      this.$refs.table.getTreeData(data)
    }
  },
};
</script>

<style lang="scss" scoped>
.assembly-container {
  height: calc(100vh - 84px);
  background-color: #eee;
}
.card-container {
  height: calc(100vh - 124px);
  display: flex;
  justify-content: space-between;
}
.department {
  width: 20%;
}
.department-list {
  width: 79%;
  background-color: #fff;
}
</style>