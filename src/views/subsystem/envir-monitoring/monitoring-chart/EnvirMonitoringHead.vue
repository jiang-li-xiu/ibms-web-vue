<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-09 09:39:36
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-19 10:31:38
-->
<template>
  <div class="assembly-head-container">
    <h4>{{ title }}</h4>
    <div class="assembly-head-content">
      <div class="assembly-head-box">
        <h1 class="head-color-green">{{ datas.temp || "7.68" }}</h1>
        <div><b>温度 </b> ℃</div>
      </div>
      <div class="assembly-head-box">
        <h1 class="head-color-orange">{{ datas.humi || "427.35" }}</h1>
        <div><b>湿度 </b> %</div>
      </div>
      <div class="assembly-head-box">
        <h1 class="head-color-green">{{ datas.pmOneFourth || "暂无数据" }}</h1>
        <div><b>PM2.5 </b> μg/m³</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getCurrentData } from "@/api/subsystem/envir-monitoring/envir-monitoring.js";

export default {
  props: {
    treeNode: Object,
  },
  data() {
    return {
      title: "全部", //标题
      datas: {},
      queryParams: {
        regionId: 0, //区域id
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getCurrentData(this.queryParams).then((response) => {
        console.log(response);
        this.datas = response;
      });
    },
  },
  // watch: {
  //   treeNode: {
  //     handler(newVal) {
  //       this.queryParams.regionId = newVal.regionId;
  //       this.title = newVal.label;
  //       this.getData();
  //     },
  //   },
  // },
};
</script>
<style scoped lang="scss">
.assembly-head-container {
  padding: 10px;
  // 标题
  h4 {
    margin: 5px;
    font-size: 18px;
    letter-spacing: 2px;
    span {
      margin-left: 5px;
    }
  }
  //车位
  .assembly-head-content {
    display: flex;
    justify-content: space-around;
    text-align: center;
    h1 {
      margin: 10px 0;
      font-size: 32px;
    }
    div {
      font-size: 14px;
    }
  }
}
.head-color-green {
  color: #70b603;
}
.head-color-orange {
  color: #f59a23;
}
</style>
