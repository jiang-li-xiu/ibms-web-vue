<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-10 14:31:24
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-02 16:51:47
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
        // backgroundColor: '#0e2147',
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            label: {
              formatter: " {value}月",
            },
          },
        },
        yAxis: [
          {
            type: "value",
            name: "（次）",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            nameTextStyle: {
              color: "#000",
            },
            axisLabel: {
              textStyle: {
                color: "#556677",
              },
            },
          },
        ],
        xAxis: [
          {
            type: "category",
            name: "（月）",
            nameTextStyle: {
              color: "#000",
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            axisLabel: {
              inside: false,
              textStyle: {
                color: "#000", // x轴颜色
                fontWeight: "normal",
                fontSize: "14",
                lineHeight: 22,
              },
            },
            data: data.XName,
          },
        ],
        series: [
          {
            symbolSize: 5,
            name: "次数",
            type: "line",
            data: data.data1,
            itemStyle: {
              normal: {
                borderWidth: 5,
                color: "#0696f9",
              },
            },
          },
        ],
      });
    },
  },
};
</script>
