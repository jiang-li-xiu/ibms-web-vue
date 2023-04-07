<!--
 * @Author: MJ
 * @Date: 2021-08-13 15:05:54
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-29 11:37:00
 * @Description: 
-->
<template>
  <div>
    <el-table
      :data="functions"
      stripe
      style="width: 100%"
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column prop="identifier" label="功能ID"></el-table-column>
      <el-table-column prop="name" label="功能名称"></el-table-column>
      <!-- <el-table-column prop="isRW" label="是否异步"></el-table-column> -->
      <!-- <el-table-column prop="address" label="备注"></el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            style="color: #0000ff; cursor: pointer"
            @click="openAttribute(1, scope.row, 0)"
          >
            查看详情
          </span>
          <span
            style="color: #0000ff; cursor: pointer; margin-left: 10px"
            @click="debuggings(0, null, 1)"
            >调试</span
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    functions: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  methods: {
    openAttribute(i, row) {
      this.$emit("openAttribute", i, row);
    },

    debuggings() {},
  },
};
</script>

<style lang="scss" scoped>
</style>
