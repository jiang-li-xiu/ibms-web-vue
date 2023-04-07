<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-09 09:39:36
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-10-19 14:21:54
-->
<template>
  <div class="assembly-head-container">
    <div class="assembly-head-content">
      <el-row :gutter="25">
        <!-- 变电所概述 -->
        <el-col :xs="24" :sm="24" :md="16">
          <div class="assembly-head-main">
            <h4>变电所概述</h4>
            <hr class="assembly-hr" />
            <el-row :gutter="15">
              <el-col :span="6"
                ><el-card shadow="hover" class="assembly-head-box">
                  <h1 class="head-color-orange">{{ datas.wd || 0 }}&nbsp;℃</h1>
                  <b>环境温度</b>
                </el-card></el-col
              >
              <el-col :span="6"
                ><el-card shadow="hover" class="assembly-head-box">
                  <h1 class="head-color-green">{{ datas.sd || 0 }}&nbsp;%</h1>
                  <b>环境湿度</b>
                </el-card></el-col
              >
              <el-col :span="6"
                ><el-card shadow="hover" class="assembly-head-box">
                  <h1 class="head-color-blue">{{ datas.zs }}&nbsp;KV</h1>
                  <b>电压等级</b>
                </el-card></el-col
              >
              <el-col :span="6"
                ><el-card shadow="hover" class="assembly-head-box">
                  <h1 class="head-color-blue">{{ datas.sd }}</h1>
                  <b>变压器台数</b>
                </el-card></el-col
              >
            </el-row>
            <el-row :gutter="15" class="assembly-body-box">
              <el-col :span="6"
                ><el-card shadow="hover" class="assembly-head-box">
                  <h1>{{ datas.zs || 0 }}&nbsp;KVA</h1>
                  <b>装机容量</b>
                </el-card></el-col
              >
              <el-col :span="6"
                ><el-card shadow="hover" class="assembly-head-box">
                  <h1>{{ datas.fl || 0 }}&nbsp;KVA</h1>
                  <b>运行容量</b>
                </el-card></el-col
              >
              <el-col :span="6"
                ><el-card shadow="hover" class="assembly-head-box">
                  <h1>{{ datas.qy }}</h1>
                  <b>测控装置数</b>
                </el-card></el-col
              >
            </el-row>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <div class="assembly-head-main" style="margin-right: -10px">
            <h4>用电概况</h4>
            <hr class="assembly-hr" />
            <div class="assembly-head-right">
              <el-card shadow="hover" class="assembly-head-right-box">
                <b>当日用电：</b><span>{{ datas.wd || 0 }}&nbsp;KWH</span>
              </el-card>
              <el-card shadow="hover" class="assembly-head-right-box">
                <b>昨日同期：</b><span>{{ datas.wd || 0 }}&nbsp;KWH</span>
              </el-card>
              <el-card shadow="hover" class="assembly-head-right-box">
                <b>最大用电时间：</b> <span>{{ datas.wd || 0 }}</span>
              </el-card>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getCurrentData } from "@/api/subsystem/envir-monitoring/envir-monitoring.js";
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
  methods: {
    getData() {
      getCurrentData(this.queryParams).then((response) => {
        this.datas = response;
      });
    },
  },
};
</script>
<style scoped lang='scss' >
.assembly-head-container {
  padding: 0 10px;
  // 标题
  h4 {
    margin: 0;
    font-size: 18px;
    letter-spacing: 2px;
    background-color: #fff;
    padding: 10px;
  }

  //内容
  .assembly-head-content {
    .assembly-head-main {
      background-color: #fff;
      padding-bottom: 20px;
      padding-left: 20px;
      padding-right: 20px;
      margin-left: -10px;
      .assembly-hr {
        margin: 0;
        background-color: rgb(0, 0, 0);
        border: none;
        height: 1px;
        opacity: 0.2;
      }
    }
    .assembly-head-right {
      .assembly-head-right-box {
        font-size: 24px;
        display: flex;
        align-items: center;
        margin-top: 20px;
        height: calc(13vh - 22px);
        cursor: pointer;
        span {
          margin-left: 10px;
        }
      }
    }
    .assembly-head-box {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      margin-top: 15px;
      height: calc(20vh - 22px);
      cursor: pointer;
      text-align: center;
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