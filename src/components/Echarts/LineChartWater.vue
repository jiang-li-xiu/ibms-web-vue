<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-13 09:50:58
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-02 16:57:17
-->
<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
// import echarts from "echarts/lib/echarts";
const echarts = require("echarts/lib/echarts");
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize.js";

export default {
  mixins: [resize],
  props: {
    chartsData: {
      type: Object,
      default: Object,
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

  methods: {
    getSeries() {
      let list = [];
      let data = this.chartsData;
      for (let i in data.nameList) {
        list.push({
          name: data.nameList[i],
          type: "line",
          data: data.series[i],
          symbolSize: 1,
          symbol: "circle",
          // smooth: true,//折线或平滑
          yAxisIndex: 0,
          showSymbol: false,
          lineStyle: {
            width: 5,
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: data.colorList[i],
              },
              {
                offset: 1,
                color: data.colorList[i],
              },
            ]),
            shadowColor: "rgba(158,135,255, 0.3)",
            shadowBlur: 10,
            shadowOffsetY: 20,
          },
          itemStyle: {
            normal: {
              color: data.colorList[i],
              borderColor: data.colorList[i],
            },
          },
        });
      }
      return list;
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      let data = this.chartsData;
      this.chart.setOption({
        title: {
          text: data.title || "",
          textStyle: {
            color: "#000",
          },
          x: "center",
          top: "5%",
        },
        backgroundColor: "#fff",
        toolbox: {
          top: "5%",
          right: "5%",
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
        legend: {
          orient: "vertical", //垂直布局
          top: "center",
          right: 50,
          itemWidth: 6,
          itemGap: 20,
          textStyle: {
            color: "#556677",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            label: {
              show: true,
              backgroundColor: "#fff",
              color: "#556677",
              borderColor: "rgba(0,0,0,0)",
              shadowColor: "rgba(0,0,0,0)",
              shadowOffsetY: 0,
            },
            lineStyle: {
              width: 0,
            },
          },
          backgroundColor: "#fff",
          textStyle: {
            color: "#5c6c7c",
          },
          padding: [10, 10],
          extraCssText: "box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)",
        },
        grid: {
          containLabel: true,
          left: "3%",
          top: "20%",
          bottom: "5%",
          right: "150",
        },
        xAxis: [
          {
            type: "category",
            data: data.xLabel,
            axisLine: {
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              rotate: 20,
              argin: 20, //刻度标签与轴线之间的距离。
              textStyle: {
                color: "#556677",
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15,
            },
            axisPointer: {
              label: {
                // padding: [11, 5, 7],
                padding: [0, 0, 10, 0],
                // 这里的margin和axisLabel的margin要一致!
                margin: 15,
                // 移入时的字体大小
                fontSize: 12,
                backgroundColor: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#fff", // 0% 处的颜色
                    },
                    {
                      // offset: 0.9,
                      offset: 0.86,
                      /* 0.86 = （文字 + 文字距下边线的距离）/（文字 + 文字距下边线的距离 + 下边线的宽度）*/
                      color: "#fff", // 0% 处的颜色
                    },
                    {
                      offset: 0.86,
                      color: "#33c0cd", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#33c0cd", // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            name: data.yAxisName,
            nameTextStyle: {
              color: "#000",
            },
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#556677",
              },
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            position: "right",
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#556677",
              },
              formatter: "{value}",
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: this.getSeries(),
      });
    },
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
};
</script>
