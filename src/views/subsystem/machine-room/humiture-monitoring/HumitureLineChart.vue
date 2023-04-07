<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
// import echarts from 'echarts'
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
      default: "500px",
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (parms) {
            var str =
              "当前时间：" +
              parms[0].axisValue +
              "时" +
              "</br>" +
              "当前值：" +
              parms[0].value;
            return str;
          },
        },
        toolbox: {
          top: "2%",
          right: "2%",
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
          type: "category",
          name: "时间（h）",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#B5B5B5",
            },
          },
          axisLabel: {
            margin: 20, //刻度标签与轴线之间的距离。
            textStyle: {
              fontFamily: "Microsoft YaHei",
              color: "#000",
            },
          },
          data: data.legend,
          boundaryGap: false,
        },
        grid: {
          containLabel: true,
          left: "10%",
          top: "15%",
          bottom: "10%",
          right: "10%",
        },
        yAxis: {
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
            margin: 20, //刻度标签与轴线之间的距离。
            textStyle: {
              fontFamily: "Microsoft YaHei",
              color: "#000",
              fontSize: 12,
            },
          },
          data: [0, 20, 40, 60, 80, 100],
        },
        series: [
          {
            type: "line",
            data: data.seriesData,
            lineStyle: {
              color: "#5470C6",
            },
          },
        ],
      });
    },
  },
};
</script>
