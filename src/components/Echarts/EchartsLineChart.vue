<!--
 * @Author: MJ
 * @Date: 2021-11-02 15:41:37
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-12-28 16:54:58
 * @Description: 
-->
<template>
  <div
    id="echartsLineChart"
    :class="className"
    :style="{ height: height, width: width }"
  />
</template>

<script>
// import echarts from "echarts";
const echarts = require("echarts/lib/echarts");
require("echarts/lib/component/grid");
require("echarts/lib/chart/line");
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize.js";

export default {
  mixins: [resize],
  props: {
    chartsData: {
      type: Object,
      default() {
        return {
          xAxis: [
            "2021-12-23 10:00",
            "2021-12-23 11:00",
            "2021-12-23 12:00",
            "2021-12-23 13:00",
            "2021-12-23 14:00",
            "2021-12-23 15:00",
            "2021-12-23 16:00",
            "2021-12-23 17:00",
            "2021-12-23 18:00",
            "2021-12-23 18:00",
            "2021-12-23 20:00",
            "2021-12-23 21:00",
            "2021-12-23 22:00",
            "2021-12-23 23:00",
            "2021-12-23 00:00",
          ],
          series: [27, 30, 60, 23, 80, 34, 20, 30, 42, 20, 33, 56, 50, 63, 18],
        };
      },
    },
    className: {
      type: String,
      default: "echarts-line-chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      // default: "35vh",
      default: "27em",
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
  watch: {
    chartsData: {
      handler(newVal) {
        this.chart.dispose();
        this.chart = null;
        this.$nextTick(() => {
          this.initChart();
        });
      },
      deep: true,
    },
  },

  methods: {
    initChart() {
      //
      // this.chart = echarts.init(this.$el);
      this.chart = echarts.init(document.getElementById("echartsLineChart"));
      this.chart.setOption({
        title: {
          text: "均值变化情况",
          textStyle: {
            color: "#000",
          },
          x: "center",
          top: "5%",
        },
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          formatter: "value：{c}<br/>时间：{b}",
        },
        // 保存图片
        toolbox: {
          top: "5%",
          right: "5%",
          iconStyle: {
            borderColor: "#1890ff",
          },
          feature: {
            saveAsImage: {
              type: "png",
              name: "均值变化情况",
            },
          },
        },
        xAxis: {
          type: "category",
          data: this.chartsData.xAxis,
        },
        yAxis: {
          type: "value",
          boundaryGap: false,
          // name: "ug/m³",
          name: this.chartsData.company,
          splitLine: {
            show: false,
          },
          // y轴不能设置值
          // data: [0, 30, 60, 90],
        },
        series: [
          {
            data: this.chartsData.series,
            type: "line",
          },
        ],
      });
    },
  },
};
</script>
