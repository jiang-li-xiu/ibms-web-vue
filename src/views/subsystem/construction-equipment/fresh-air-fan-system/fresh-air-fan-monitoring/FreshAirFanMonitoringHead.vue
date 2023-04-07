<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-09 09:39:36
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-26 16:57:31
-->
<template>
  <div class="assembly-head-container">
    <h4>{{ title }}</h4>
    <div class="assembly-head-content">
      <el-row :gutter="15">
        <el-col :span="8"
          ><div class="assembly-head-box">
            <h1 class="head-color-orange">{{ datas.wd || 0 }}&nbsp;℃</h1>
            <b>当前温度</b>
          </div></el-col
        >
        <el-col :span="8"
          ><div class="assembly-head-box">
            <h1 class="head-color-green">{{ datas.sd || 0 }}&nbsp;%</h1>
            <b>当前湿度</b>
          </div></el-col
        >
        <el-col :span="8"
          ><div class="assembly-head-box">
            <h1 class="head-color-blue">{{ datas.ms }}</h1>
            <b>模 式</b>
          </div></el-col
        >
      </el-row>
      <el-row :gutter="15" class="assembly-body-box">
        <el-col :span="8"
          ><div class="assembly-head-box">
            <h1>{{ datas.zs || 0 }}&nbsp;r/min</h1>
            <b>转 速</b>
          </div></el-col
        >
        <el-col :span="8"
          ><div class="assembly-head-box">
            <h1>{{ datas.fl || 0 }}&nbsp;m³/h</h1>
            <b>风 量</b>
          </div></el-col
        >
        <el-col :span="8"
          ><div class="assembly-head-box">
            <h1>{{ datas.qy }}&nbsp;Pa</h1>
            <b>全 压</b>
          </div></el-col
        >
      </el-row>
    </div>
  </div>
</template>
<script>
import { getCurrentData } from "@/api/subsystem/envir-monitoring/envir-monitoring.js";

import bus from "@/utils/bus.js";

export default {
  data() {
    return {
      title: "全部", //标题
      datas: {
        wd: 88,
        sd: 30,
        ms: "AUTO",
        zs: "1450",
        fl: "6670",
        qy: "676",
      },
      queryParams: {
        regionId: 0, //区域id
      },
    };
  },
  created() {
    /*  this.getData(); */
  },
  mounted() {
    // 获取树形组件回传的数据、子组件互相传值
    bus.$on("busMethod", (data) => {
      this.getTreeData(data);
    });
  },
  beforeDestroy() {
    bus.$off("busMethod"); // 组件销毁时关闭监听
  },
  methods: {
    //获取树形组件回传的数据
    getTreeData(data) {
      this.title = data.label;
      this.queryParams.regionId = data.regionId;
      this.getData();
    },
    getData() {
      getCurrentData(this.queryParams).then((response) => {
        this.datas = response;
      });
    },
  },
};
</script>
<style scoped lang="scss">
.assembly-head-container {
  // 标题
  h4 {
    margin: 0;
    font-size: 18px;
    letter-spacing: 2px;
    background-color: #fff;
    padding: 10px;
  }
  .assembly-head-content {
    .assembly-head-box {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      margin-top: 15px;
      height: calc(20vh - 10px);
      background-color: #fff;
    }
    b {
      letter-spacing: 2px;
    }
    h1 {
      margin: 10px 0;
      font-size: 32px;
    }
    div {
      font-size: 14px;
    }
  }
}
.assembly-body-box {
  h1 {
    font-weight: 400;
    font-size: 28px !important;
  }
}
.head-color-green {
  color: #70b603;
}
.head-color-orange {
  color: #f59a23;
}
.head-color-blue {
  color: #02a7f0;
}
</style>
