<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-29 09:46:49
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-08-06 17:07:51
-->
<template>
  <div>
    <el-table :data="functionData" border>
      <el-table-column label="功能Id" align="center" prop="identifier" />
      <el-table-column label="功能名称" align="center" prop="name" />
      <el-table-column label="是否必需" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.required ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleCheck(scope.row)"
            >查看详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-link"
            @click="handleDebug(scope.row)"
            >调试</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: "FunctionDefinition",
  props: {
    functionData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    handleCheck(row) {},
    handleDebug(row) {},
  },
};
</script>
<style scoped lang='scss' >
</style>