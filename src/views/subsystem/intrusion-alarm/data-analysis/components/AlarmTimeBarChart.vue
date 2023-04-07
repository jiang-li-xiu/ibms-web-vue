/* * @Author: CenMingGuang * @Date: 2021-09-Tu 02:27:04 * @Last Modified by: CenMingGuang
* @Last Modified time: 2021-09-Tu 02:27:04 */

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
    type: {
      type: String,
      default: "toDay",
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
      let typeName = "";
      switch (this.type) {
        case "toDay":
          typeName = "时";
          break;
        case "toWeek":
          typeName = "星期";
          break;
        case "toMonth":
          typeName = "天";
          break;
      }
      this.chart.setOption({
        // 提示框
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: function (parms) {
            var str =
              "所在时间段：" +
              parms[0].axisValue +
              "</br>" +
              "报警次数：" +
              parms[0].value;
            return str;
          },
        },
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
        textStyle: {
          color: "#000",
        },
        grid: {
          containLabel: true,
          left: "10%",
          top: "20%",
          bottom: "10%",
          right: "10%",
        },
        xAxis: {
          type: "category",
          name: `( ${typeName} )`,
          data: data.legend,
          axisLine: {
            lineStyle: {
              color: "#B5B5B5",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            margin: 20, //刻度标签与轴线之间的距离。
            textStyle: {
              fontFamily: "Microsoft YaHei",
              color: "#000",
              fontSize: 12,
            },
            interval: 0,
          },
        },
        yAxis: {
          type: "value",
          name: "（次）",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#B5B5B5",
            },
          },
        },
        series: [
          {
            data: data.seriesData,
            stack: "zs",
            type: "bar",
            barMaxWidth: "auto",
            barWidth: 20,
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: "linear",
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: "#5EA1FF",
                  },
                  {
                    offset: 1,
                    color: "#90BEFF",
                  },
                ],
              },
            },
          },
        ],
      });
    },
  },
  watch: {
    data: {
      handler(val) {
        this.initChart();
      },
      deep: true,
    },
  },
};
</script>
