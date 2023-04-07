<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-09 09:39:36
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-27 15:07:25
-->
<template>
  <div class="assembly-head-container">
    <h4>访客统计</h4>
    <div class="assembly-head-content">
      <div class="assembly-head-box">
        <h1>{{ datas.lastMonthTotal }}</h1>
        <div>上月</div>
      </div>
      <div class="assembly-head-box">
        <h1>{{ datas.currentMonthTotal }}</h1>
        <div>本月</div>
      </div>
      <div class="assembly-head-box">
        <h1>{{ datas.currentWeekTotal }}</h1>
        <div>本周</div>
      </div>
      <div class="assembly-head-box">
        <h1 class="assembly-head-color">{{ datas.todayTotal }}</h1>
        <div>当日</div>
      </div>
    </div>
  </div>
</template>
<script>
import { postIntercomEventTotal } from "@/api/subsystem/visual-intercom/visitorsAccessRecode";

export default {
  data() {
    return {
      datas: {},
    };
  },
  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      postIntercomEventTotal().then((response) => {
        this.datas = response.data;
      });
    },
  },
};
</script>
<style scoped lang='scss' >
.assembly-head-container {
  padding: 10px;
  // 标题
  h4 {
    margin: 5px;
    font-size: 18px;
    letter-spacing: 2px;
  }
  //车位
  .assembly-head-content {
    display: flex;
    justify-content: space-around;
    text-align: center;
    margin-top: 20px;
    h1 {
      margin: 10px 0;
      font-size: 32px;
    }
    .assembly-head-color {
      color: #70b603;
    }
    div {
      font-size: 14px;
    }
  }
}
</style>