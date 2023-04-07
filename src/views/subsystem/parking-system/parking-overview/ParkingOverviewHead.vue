<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-09 09:39:36
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-06 08:32:06
-->
<template>
  <div class="assembly-head-container">
    <h4>{{ title }}
      <span>车库</span>
      <div class="el-icon-refresh-left" @click.stop="refresh"></div>
    </h4>
    <div v-if="info.total >= 1" class="assembly-head-content">
      <div class="assembly-head-box">
        <h1>{{ info.total }}</h1>
        <div>总车位</div>
      </div>
      <div class="assembly-head-box">
        <h1>{{ info.fixed }}</h1>
        <div>专用车位</div>
      </div>
      <div class="assembly-head-box">
        <h1>{{ info.appointment }}</h1>
        <div>预约车位</div>
      </div>
      <div class="assembly-head-box">
        <h1>{{ info.use }}</h1>
        <div>已停车位</div>
      </div>
      <div class="assembly-head-box">
        <h1 class="assembly-head-color">{{ info.surplus }}</h1>
        <div>剩余车位</div>
      </div>
    </div>
    <el-empty v-else description="暂无数据"></el-empty>
  </div>
</template>
<script>
import { getParkinglotInfo } from "@/api/subsystem/parking-system/parking-system.js";

import bus from "@/utils/bus.js";

export default {
  data() {
    return {
      title: "全部", //标题
      regionCode: "1",
      info: {},
    };
  },
  created() {
    
  },
  mounted() {
    this.getParkInfo();
    // 获取树形组件回传的数据、子组件互相传值
    bus.$on("busMethod", (data) => {
      this.regionCode = data.regionName;
    });
  },
  beforeDestroy() {
    bus.$off("busMethod"); // 组件销毁时关闭监听
  },
  methods: {
    getParkInfo() {
      getParkinglotInfo(this.regionCode).then((response) => {
        this.info = response.data;
      });
    },
    // 刷新
    refresh() {
      if (this.info.total >= 1) {
        this.info = {};
        this.getParkInfo();
      } else {
        this.info = {};
      }
    },
  },
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
    margin-top: 30px;
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
  .el-icon-refresh-left {
    float: right;
    cursor: pointer;
    color: #d9d9d9;
    font-size: 25px;
    font-weight: 600;
    transition: 1s;
  }
  .el-icon-refresh-left:hover {
    color: #207bff;
    transform: rotate(-360deg) scale(1.3);
  }
}
</style>
