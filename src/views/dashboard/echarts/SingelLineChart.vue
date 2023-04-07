<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-08-13 14:20:12
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-02 16:52:37
-->
<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
// import echarts from "echarts";
const echarts = require("echarts/lib/echarts");
require("echarts/theme/macarons"); // echarts theme
import resize from "../mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
    chartData: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions(data) {
      this.chart.setOption({
        backgroundColor: "#ffffff",
        grid: {
          top: 30,
          right: 20,
          bottom: 0,
          left: 20,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#fff",
            },
          },
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            data: data.label,
          },
        ],
        yAxis: [
          {
            boundaryGap: false,
            type: "value",
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "设备告警量",
            type: "line",
            symbol: "circle",
            symbolSize: 3,
            zlevel: 3,
            smooth: true,
            itemStyle: {
              color: "rgba(32,123,255,0.8051 )",
              borderColor: "#fff",
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(32,123,255,0.8)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(32,123,255,0)",
                    },
                  ],
                  false
                ),
              },
            },
            data: data.value,
          },
        ],
      });
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
  },
};
</script>
