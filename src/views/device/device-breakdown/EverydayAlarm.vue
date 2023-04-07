<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-06-09 08:57:06
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-06-14 14:36:18
-->
<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
const echarts = require("echarts/lib/echarts");
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize";
import { getEveryDayAlarm } from "@/api/device/deviceBreakdown.js";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chartLine",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "35vh",
    },
  },
  data() {
    return {
      chartLine: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  created() {},
  beforeDestroy() {
    if (!this.chartLine) {
      return;
    }
    this.chartLine.dispose();
    this.chartLine = null;
  },
  methods: {
    initChart() {
      this.chartLine = echarts.init(this.$el, "macarons");
      getEveryDayAlarm().then((res) => {
        let everyData = res.data;
        let nameList = [];
        let valueList = [];
        everyData.forEach((item) => {
          nameList.push(item.alarmTime.slice(5, 10));
          valueList.push(item.num);
        });
        console.log("nameList", nameList);
        this.chartLine.setOption({
          tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(255,255,255,0.8)", //设置背景图片 rgba格式
            color: "black",
            borderWidth: "1", //边框宽度设置1
            borderColor: "gray", //设置边框颜色
            textStyle: {
              color: "black", //设置文字颜色
            },
            axisPointer: {
              type: "line",
              axis: "auto",
              snap: true,
              lineStyle: {
                color: "#000",
              },
            },
            showContent: true,
          },
          color: ["#000"],
          xAxis: {
            name: "(日期)",
            splitArea: {
              // show: true,
              color: "#000",
              lineStyle: {
                color: "#f00",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: "#000",
              fontSize: "70%",
            },
            axisLine: {
              lineStyle: {
                color: "#000",
              },
            },
            splitLine: {
              show: false,
            },
            type: "category",
            boundaryGap: false,
            data: nameList,
          },
          yAxis: {
            type: "value",
            name: "(次)",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000",
              },
            },
            axisTick: {
              show: false,
            },
            splitArea: {
              show: false,
            },
            splitLine: { show: false },
          },
          series: [
            {
              data: valueList,
              type: "line",
              smooth: false,
              symbol: "none",
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 1.5,
                  },
                },
              },
            },
          ],
        });
      });

      window.onresize = () => {
        this.chartLine.resize();
      };
    },
  },
};
</script>
