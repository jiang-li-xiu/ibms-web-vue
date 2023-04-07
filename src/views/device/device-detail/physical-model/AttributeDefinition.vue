<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-29 09:39:24
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-07-29 15:29:04
-->
<template>
  <div>
    <el-table :data="attributeDate" border>
      <el-table-column label="属性ID" align="center" prop="field" />
      <el-table-column label="属性名称" align="center" prop="name" />
      <el-table-column label="数据类型" align="center" prop="dataType.type" />
      <el-table-column label="是否只读" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accessMode == "r" ? "是" : "否" }}</span>
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
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: "AttributeDefinition",
  props: {
    attributeDate: {
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
  },
};
</script>
<style scoped lang='scss' >
</style>