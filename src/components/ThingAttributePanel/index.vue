<!--
 * @Author: MJ
 * @Date: 2021-08-13 14:09:09
 * @LastEditors: MJ
 * @LastEditTime: 2021-08-13 15:09:33
 * @Description: 
-->
<template>
  <div>
    <el-table
      :data="properties"
      stripe
      style="width: 100%"
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column prop="field" label="属性ID"></el-table-column>
      <el-table-column prop="name" label="属性名称"></el-table-column>

      <el-table-column prop="dataType.type" label="数据类型"></el-table-column>

      <el-table-column prop="isRW" label="是否只读"></el-table-column>
      <!-- <el-table-column prop="address" label="备注"></el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            style="cursor: pointer; color: #0000ff"
            @click="openAttribute(0, scope.row)"
            >查看详情</span
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    properties: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      dialogTableVisible: false,
    };
  },

  methods: {
    openAttribute(i, row) {
      this.$emit("openAttribute", i, row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
