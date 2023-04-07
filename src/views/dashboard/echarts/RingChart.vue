<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-08-12 14:50:17
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-02 16:50:06
-->
<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
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
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
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
        backgroundColor: "#fff",
        title: {
          text: ((data.online / data.total) * 100).toFixed(1) + "%",
          textStyle: {
            color: "#207bff",
            fontSize: 24,
          },
          subtext: "Online",
          subtextStyle: {
            color: "#72a2ff",
            fontSize: 18,
          },
          itemGap: 10,
          left: "center",
          top: "40%",
        },
        angleAxis: {
          max: data.total,
          show: false,
        },
        tooltip: {
          trigger: "item",
          formatter: "{c}",
        },

        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        polar: {
          radius: ["60%", "75%"],
          center: ["50%", "50%"],
        },
        series: [
          {
            type: "bar",
            roundCap: true,
            barWidth: 35,
            showBackground: true,
            backgroundStyle: {
              color: "#e8f1fe",
            },
            itemStyle: {
              normal: {
                opacity: 1,
                color: "#2d82ff",
              },
            },
            data: [
              {
                value: data.online,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      offset: 0,
                      color: "#79adf8",
                    },
                    {
                      offset: 1,
                      color: "#217bff",
                    },
                  ]),
                  shadowBlur: 10, //浅蓝色阴影
                  shadowColor: "rgba(0, 103, 255, 0.2)",
                  shadowOffsetX: -5,
                  shadowOffsetY: 5,
                },
              },
            ],
            coordinateSystem: "polar",
            name: "A",
            label: {
              show: false,
            },
          },
        ],
      });
    },
  },
};
</script>
