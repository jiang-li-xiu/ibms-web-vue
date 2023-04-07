<!--
 * @Author: MJ
 * @Date: 2021-11-03 11:00:59
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-12-28 15:10:09
 * @Description: 
-->
<template>
  <div
    id="temperatureHumidityCylindrical"
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
            "2021-09-01",
            "2021-09-02",
            "2021-09-03",
            "2021-09-04",
            "2021-09-05",
            "2021-09-06",
            "2021-09-07",
            "2021-09-08",
            "2021-09-09",
            "2021-09-10",
            "2021-09-11",
            "2021-09-12",
            "2021-09-13",
            "2021-09-14",
            "2021-09-15",
          ],
          temperature: [6, 30, 60, 0, 80, 10, 20, 30, 0, 20, 2, 12, 50, 14, 15],
          humidity: [6, 30, 60, 0, 80, 10, 20, 30, 0, 20, 2, 12, 50, 14, 15],
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
      const colors = ["#81d3f8", "#8080ff"];
      this.chart = echarts.init(
        document.getElementById("temperatureHumidityCylindrical")
      );

      this.chart.setOption({
        color: colors,
        title: {
          //   text: "PM 2.5 均值浓度变化情况",
          textStyle: {
            color: "#000",
          },
          x: "center",
          top: "5%",
        },
        backgroundColor: "#fff",
        tooltip: {
          //   trigger: "axis",
          //   formatter: "value：{c}<br/>时间：{b}",
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
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
              name: "温湿度对比",
            },
          },
        },
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          data: this.chartsData.xAxis,
        },

        yAxis: [
          {
            type: "value",
            name: "温度（℃）",
            min: 0,
            max: 80,
            position: "left",
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[0],
              },
            },
          },
          {
            type: "value",
            name: "湿度（%RH）",
            min: 0,
            max: 100,
            position: "right",
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[1],
              },
            },
          },
        ],
        legend: {
          data: ["温度", "湿度"],
        },
        series: [
          {
            type: "bar",
            name: "温度",
            yAxisIndex: 0,
            data: this.chartsData.temperature,
            // data: [
            //   26, 5.9, 9, 26, 28, 7, 17, 18, 47, 18, 6, 23, 36.6, 36.5, 36.53,
            // ],
          },
          {
            type: "bar",
            name: "湿度",
            yAxisIndex: 1,
            data: this.chartsData.humidity,
            // data: [20, 49, 70, 32, 56, 56, 35, 62, 36, 20, 64, 33, 66, 15, 68],
          },
        ],
      });
    },
  },
};
</script>
