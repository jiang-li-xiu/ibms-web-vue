<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-27 16:18:55
 * @LastEditors: MJ
 * @LastEditTime: 2021-09-13 11:58:10
-->
<template>
  <div class="running-state">
    <el-card class="box-card" shadow="always">
      <div class="name">设备状态</div>
      <div
        class="is-state"
        :class="deviceState.isStatus == 0 ? 'state' : 'unstate'"
      >
        {{ deviceState.isStatus == 0 ? "在线" : "离线" }}
      </div>
      <div class="online-time">状态监测时间：{{ deviceState.updateTime }}</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "RunningState",
  props: {
    deviceState: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped lang='scss' >
.running-state {
  margin: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  row-gap: 20px;
  column-gap: 20px;
  .name {
    font-size: 14px;
    color: #adadad;
    margin-bottom: 20px;
  }
  .is-state {
    position: relative;
    padding-left: 20px;
    font-size: 20px;
    margin-bottom: 20px;
  }
  .is-state::before {
    content: "";
    position: absolute;
    top: 30%;
    left: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #95f204;
  }
  .state::before {
    background-color: #95f204;
  }
  .unstate::before {
    background-color: #d9001b;
  }
  .online-time {
    font-size: 14px;
    color: #adadad;
  }
}
</style>