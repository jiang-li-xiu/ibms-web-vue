<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-29 09:47:36
 * @LastEditors: MJ
 * @LastEditTime: 2021-08-23 16:00:48
-->
<template>
  <div>
    <el-table :data="eventData" border>
      <el-table-column label="事件Id" align="center" prop="identifier" />

      <el-table-column label="事件名称" align="center" prop="eventName" />
      <!-- <el-table-column label="报警级别" align="center" prop="eventType" /> -->
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
  name: "EventDefinition",
  props: {
    eventData: {
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