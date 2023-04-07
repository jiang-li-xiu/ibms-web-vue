<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-03-28 15:32:39
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-06-02 17:47:50
-->
<template>
  <div class="regional-management">
    <!-- 树状图区域 -->
    <div class="tree">
      <regional-list-tree
        :defaultProps="defaultProps"
        :treeData="treeData"
        title="区域列表"
        placeholder="请输入区域名称"
        searchKey="regionName"
        @getData="getRegionalListTree"
        @getTreeNode="getTreeNode"
      />
    </div>
    <!-- 详情区域 -->
    <div class="detail">
      <regional-management-detail
        :treeNode="treeNode"
      />
    </div>
  </div>
</template>

<script>
import { getAreaTree } from '@/api/system/regionalManagement.js'
import regionalListTree from './components/RegionalListTree'
import RegionalManagementDetail from './components/RegionalManagementDetail'
export default {
  components: { regionalListTree, RegionalManagementDetail },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "regionName",
      },
      treeNode: {},
    }
  },
  created() {
    // 获取树形数据
    this.getRegionalListTree()
  },
  methods: {
    //  获取树形数据
    async getRegionalListTree() {
      const { data } = await getAreaTree({ regionId: 0 })
      console.log(data)
      // 保存树形数据
      this.treeData = data
    },
    getTreeNode(data) {
      this.treeNode = data
    }
  },
}
</script>

<style lang="scss" scoped>
.regional-management {
  padding: 20px;
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  & > div {
    background-color: #fff;
  }
  .tree {
    width: 300px;
    min-width: 300px;
    margin-right: 20px;
  }
  .detail {
    width: calc(100% - 300px);
  }
}
</style>