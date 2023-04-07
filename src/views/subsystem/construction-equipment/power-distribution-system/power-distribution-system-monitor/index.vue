<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-08 17:49:27
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-10-19 11:48:07
-->
<template>
  <div class="app-container assembly-container">
    <overview-head class="assembly-head"></overview-head>
    <overview-table class="assembly-main"></overview-table>
  </div>
</template>

<script>
import OverviewTable from "./PowerDistributionSystemMonitorTable.vue";
import OverviewHead from "./PowerDistributionSystemMonitorHead.vue";
export default {
  name: "envir-monitoring-eqpt",
  components: {
    OverviewTable,
    OverviewHead,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style scoped lang='scss' >
.assembly-container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
.assembly-head {
  min-height: calc(50vh - 45px);
  margin-bottom: 14px;
}
.assembly-main {
  min-height: calc(50vh - 101px);
  background-color: #fff;
}
</style>