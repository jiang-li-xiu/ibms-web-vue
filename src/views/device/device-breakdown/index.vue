<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-06-09 08:51:03
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-06-14 14:01:51
-->
<template>
  <div class="assembly-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12">
        <div class="assembly-container-col" style="height: 42vh;">
          <div class="title_top">本月故障告警次数统计</div>
          <month-breakdown></month-breakdown>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <div class="assembly-container-col" style="height: 42vh;">
          <div class="title_top">每日告警次数统计</div>
          <everyday-alarm></everyday-alarm>
        </div>
      </el-col>
    </el-row>
    <alarm-table class="assembly-container-col"></alarm-table>
  </div>
</template>
<script>
import MonthBreakdown from "./MonthBreakdown";
import EverydayAlarm from "./EverydayAlarm";
import AlarmTable from "./AlarmTable";
export default {
  name: "",
  components: {
    MonthBreakdown,
    EverydayAlarm,
    AlarmTable,
  },
  props: {},
  data() {
    return {
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
.assembly-container {
  min-height: calc(100vh - 84px);
  padding: 0 20px 20px;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  .assembly-container-col {
    background-color: #fff;
    margin-top: 20px;
  }
}

@media (max-width: 1024px) {
  .assembly-container-col {
    padding: 8px;
  }
}

.title_top {
  padding: 1vh;
  font-weight: 700;
}
</style>
