<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-08-13 09:15:37
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-08-13 16:38:27
-->
<template>
  <div>
    <div class="flex-row-csb head">
      <div class="title">设备在线情况</div>
      <!-- 刷新按钮 -->
      <!-- <div class="el-icon-refresh-left"></div> -->
    </div>
    <div class="flex-row-cc">
      <ring-chart
        :chartData="dataObj"
        :height="'230px'"
        :width="'70%'"
      ></ring-chart>
      <div class="flex-1">
        <div class="flex align-enter online">
          <div class="pr-10">在线</div>
          <div class="font-600">{{ dataObj.online }}</div>
        </div>
        <div class="flex align-enter unline">
          <div class="pr-10">离线</div>
          <div class="font-600">{{ dataObj.unline }}</div>
        </div>
      </div>
    </div>
    <div class="flex-row-csb footer">
      <div class="text">
        <span class="text">设备总数：</span>
        <span class="number">{{ dataObj.total }}</span>
      </div>
      <div class="text">
        <span class="text">未激活设备数：</span>
        <span class="number">{{ dataObj.unline }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import RingChart from "./echarts/RingChart";

export default {
  name: "EquipmentOnline",
  components: {
    RingChart,
  },
  props: {
    dataObj: {
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
.head {
  height: 21px;
  .title {
    font-size: 16px;
    color: #666666;
    font-weight: 600;
  }
}

.el-icon-refresh-left {
  cursor: pointer;
  color: #d9d9d9;
  font-size: 18px;
  font-weight: 600;
  transition: 1s;
}
.el-icon-refresh-left:hover {
  color: #207bff;
  transform: rotate(-360deg) scale(1.3);
}
.online,
.unline {
  height: 50px;
  line-height: 50px;
  position: relative;
  padding-left: 20px;
}
.online::before,
.unline::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
}
.online::before {
  background-color: #207bff;
}
.unline::before {
  background-color: #e8f1fe;
}
.footer {
  height: 49px;
  box-sizing: border-box;
  border-top: 1px solid #f1f2f6;
  .text {
    font-size: 14px;
    span:nth-child(1) {
      color: #b6b6b6;
    }
  }
}
</style>