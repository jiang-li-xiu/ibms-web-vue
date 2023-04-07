<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-22 10:17:05
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-23 10:44:09
-->

<template>
  <div class="record-content">
    <div class="tree">
      <organize-tree
        title="区域列表"
        :treeData="treeData"
        :defaultProps="defaultProps"
        placeholder="请输入区域名称"
        searchKey="regionName"
        @getTreeNode="getTreeNode"
        @getData="getOrganizationTrees"
      ></organize-tree>
    </div>
    <!-- 列表 -->
    <div class="detail">
      <personnals-list :treeNode="treeNode"></personnals-list>
    </div>
  </div>
</template>

<script>
// API
import { getOrganizationTree } from "@/api/subsystem/personnel-information-management/personnelManagement.js";
// 组件
import OrganizeTree from "@/components/OrganizeTree";
import PersonnalsList from "./PersonnalsList";
export default {
  components: { OrganizeTree, PersonnalsList },
  data() {
    return {
      //树形数据
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      treeNode: {},
    };
  },
  created() {
    this.getOrganizationTrees();
  },
  methods: {
    // 获取树形数据
    getOrganizationTrees() {
      getOrganizationTree().then((response) => {
        this.treeData = response;
        console.log(this.treeData);
      });
    },
    getTreeNode(data) {
      console.log(data);
      this.treeNode = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.record-content {
  padding: 20px;
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  & > div {
    background-color: #fff;
  }
  .tree {
    width: 400px;
    min-width: 400px;
    margin-right: 20px;
  }
  .detail {
    width: calc(100% - 400px);
  }
}
</style>
