<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-10 14:31:24
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-02 19:03:04
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
    data: {
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
      default: "300px",
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
      let data = this.data;
      this.chart.setOption({
        // backgroundColor: "#050e31",
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
        color: data.color,
        grid: {
          top: "5%",
          left: 0,
          right: "1%",
          bottom: 5,
          containLabel: true,
        },
        legend: {
          orient: "vertical", //垂直布局
          top: "center",
          right: 40,
          // itemGap: 20,
          textStyle: {
            align: "right",
            verticalAlign: "middle",
            rich: {
              name: {
                color: "#000",
                fontSize: 15,
              },
              value: {
                color: "#000",
                fontSize: 15,
              },
              rate: {
                color: "rgb(167, 167, 167)",
                fontSize: 15,
                padding: 5,
              },
            },
          },
          data: data.legend,
          // 显示右侧百分比值
          formatter: (name) => {
            if (data.seriesData.length) {
              const item = data.seriesData.filter((item) => item.name === name)[0];
              return `{name|${name}：}{value| ${item.value}} {rate| (${item.value}%)}`;
            }
          },
        },
        series: [
          {
            name: "需求类型占比",
            type: "pie",
            center: ["25%", "50%"],
            radius: ["25%", "40%"],
            label: {
              normal: {
                show: false,
                position: "center",
                formatter: "{value|{c}}\n{label|{b}}",
                rich: {
                  value: {
                    padding: 5,
                    align: "center",
                    verticalAlign: "middle",
                    fontSize: 32,
                  },
                  label: {
                    align: "center",
                    verticalAlign: "middle",
                    fontSize: 16,
                  },
                },
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "12",
                },
              },
            },
            labelLine: {
              show: false,
              length: 0,
              length2: 0,
            },
            data: data.seriesData,
          },
        ],
      });
    },
  },
};
</script>
