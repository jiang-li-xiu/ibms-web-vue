<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-08 17:49:27
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-27 15:07:48
-->
<template>
  <div class="app-container assembly-container">
    <visitorsaccess-head class="assembly-head"></visitorsaccess-head>
    <visitorsaccess-table class="assembly-main"></visitorsaccess-table>
  </div>
</template>

<script>
import VisitorsaccessTable from "./VisitorsaccessTable.vue";
import VisitorsaccessHead from "./VisitorsaccessHead.vue";
export default {
  name: "VisitorsAccessRecode",
  components: {
    VisitorsaccessTable,
    VisitorsaccessHead,
  },
  data() {
    return {};
  },
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
  min-height: calc(17vh - 37px);
  background-color: #fff;
  margin-bottom: 14px;
}
.assembly-main {
  min-height: calc(80vh - 101px);
  background-color: #fff;
}
</style>