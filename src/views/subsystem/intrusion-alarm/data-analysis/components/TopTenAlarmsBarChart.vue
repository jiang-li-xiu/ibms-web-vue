/* * @Author: CenMingGuang * @Date: 2021-09-Tu 02:22:57 * @Last Modified by: CenMingGuang
* @Last Modified time: 2021-09-Tu 02:22:57 */
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
      default: "600px",
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
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (parms) {
            var str =
              "所在区域：" + parms[0].axisValue + "</br>" + "报警次数：" + parms[0].value;
            return str;
          },
        },
        toolbox: {
          top: "0%",
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
          left: "5%",
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
            barWidth: 20,
          },
        ],
      });
    },
  },
  watch: {
    data(val) {
      this.initChart();
    },
  },
};
</script>
