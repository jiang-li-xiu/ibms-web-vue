<!--
 * @Author: RobertFan
 * @Date: 2022-05-05 16:59:39
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-05-10 10:35:26
 * @Description: 
-->
<template>
  <div class="container_details_box">
    <el-tabs v-model="indexTab">
      <el-tab-pane label="事件记录" name="0">
        <event-record></event-record>
      </el-tab-pane>

      <el-tab-pane label="告警记录" name="1">
        <alarm-record></alarm-record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/** 告警记录API */
import AlarmRecord from "./record/AlarmRecord";
import EventRecord from "./record/EventRecord";
/** 事件记录API*/
export default {
  name: "EventAlarmRecord",
  components: {
    AlarmRecord,
    EventRecord,
  },
  data() {
    return {
      indexTab: "0",
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.container_details_box {
  background-color: #fff;
  box-sizing: border-box;
}
</style>
