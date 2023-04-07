<!--
 * @Author: MJ
 * @Date: 2021-08-13 08:54:52
 * @LastEditors: MJ
 * @LastEditTime: 2021-09-03 15:59:28
 * @Description: 
-->
<template>
  <div>
    <div style="display: flex; align-items: center">
      <span style="font-weight: 600">设备类型信息</span>
      <span style="margin-left: 10px; cursor: pointer" @click="edits">
        <em
          class="el-icon-edit-outline"
          style="font-size: 14px; margin-right: 6px; color: #0000ff"
        ></em>
        <span style="color: #0000ff">编辑</span>
      </span>
    </div>

    <el-table
      :data="dataInforArr"
      stripe
      style="width: 100%; margin-top: 1vh"
      border
    >
      <el-table-column prop="deviceTypeId" label="设备类型ID"></el-table-column>
      <el-table-column
        prop="deviceTypeName"
        label="设备类型名称"
      ></el-table-column>
      <el-table-column prop="systemName" label="所属子系统"></el-table-column>
      <!-- <el-table-column prop="plugName" label="子插件"></el-table-column> -->
      <el-table-column prop="remarks" label="备注"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ThingDetailsTypeInformation",
  props: {
    inforDetails: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      dataInforArr: [],
    };
  },

  watch: {
    inforDetails: {
      handler() {
        this.dataInforArr = [];
        this.dataInforArr.push(this.inforDetails);
      },
    },
  },

  methods: {
    // 打开修改面板
    edits() {
      this.$emit("thingDetailsTypeInformation");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
