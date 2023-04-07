<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-27 14:15:55
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-02 16:51:33
-->
<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
// import echarts from "echarts";
const echarts = require("echarts/lib/echarts");
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize.js";
export default {
  mixins: [resize],
  props: {
    chartsData: {
      type: Object,
      default: {
        legend: [
          "区域一",
          "区域二",
          "区域三",
          "区域四",
          "区域五",
          "区域六",
          "区域七",
          "区域十",
        ], //标题
        seriesData: [
          { name: "区域一", value: 60 },
          { name: "区域二", value: 50 },
          { name: "区域三", value: 70 },
          { name: "区域四", value: 40 },
          { name: "区域五", value: 30 },
          { name: "区域六", value: 22 },
          { name: "区域七", value: 21 },
        ], //数据
        axisTitle: "", //移入标题
        parmsTitle: "", //移入内容
        name: "", //导出图表名
      },
    },
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
      default: "35vh",
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
      this.chart = echarts.init(this.$el, "macarons");
      let data = this.chartData || this.chartsData;
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (parms) {
            var str =
              data.axisTitle +
              parms[0].axisValue +
              "</br>" +
              data.parmsTitle +
              parms[0].value;
            return str;
          },
        },
        toolbox: {
          top: "5%",
          right: "3%",
          iconStyle: {
            borderColor: "#1890ff",
          },
          feature: {
            saveAsImage: {
              type: "png",
              name: data.name || "图表",
            },
          },
        },
        xAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#B5B5B5",
            },
          },
          axisLabel: {
            margin: 10, //刻度标签与轴线之间的距离。
            textStyle: {
              fontFamily: "Microsoft YaHei",
              color: "#000",
            },
          },
        },
        grid: {
          containLabel: true,
          left: "8%",
          top: "10%",
          bottom: "5%",
          right: "8%",
        },
        yAxis: {
          type: "category",
          data: data.legend,
          inverse: true,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#B5B5B5",
            },
          },
          axisLabel: {
            margin: 10, //刻度标签与轴线之间的距离。
            textStyle: {
              fontFamily: "Microsoft YaHei",
              color: "#000",
              fontSize: 11,
            },
          },
        },
        series: [
          {
            type: "bar",
            data: data.seriesData,
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
            },
          },
        ],
      });
    },
  },
};
</script>
