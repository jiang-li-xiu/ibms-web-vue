<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-10 14:31:24
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-01 16:52:59
-->
<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
// import echarts from "echarts";
const echarts = require("echarts/lib/echarts");
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize.js";
var app = {
  currentIndex: -1,
};
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
      default: "45vh",
    },
  },
  data() {
    return {
      chart: null,
      timer: null,
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.initChart();
      this.getTime();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    clearInterval(this.timer);
    this.chart.dispose();
    this.chart = null;
  },

  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      let data = this.chartsData;
      this.chart.setOption({
        // backgroundColor: "#030446",
        toolbox: {
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
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },

          formatter: function (parms) {
            var str =
              "楼栋：" +
              parms[0].axisValue +
              "</br>" +
              parms[1].marker +
              data.marker +
              parms[1].value;
            return str;
          },
        },
        textStyle: {
          color: "#000",
        },
        color: ["#7BA9FA", "#7BA9FA", "#DE9FB1", "#DE9FB1"],
        grid: {
          containLabel: true,
          left: "5%",
          top: "20%",
          bottom: "5%",
          right: "5%",
        },
        xAxis: {
          type: "category",
          data: data.xData,
          axisLine: {
            lineStyle: {
              color: "#B5B5B5",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 20,
            margin: 20, //刻度标签与轴线之间的距离。
            textStyle: {
              fontFamily: "Microsoft YaHei",
              color: "#000",
            },
          },
        },
        yAxis: {
          type: "value",
          name: data.yAxis.name || "kwh",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#B5B5B5",
            },
          },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: ["#B5B5B5"],
              type: "dashed",
              opacity: 0.5,
            },
          },
          axisLabel: {},
        },
        series: [
          {
            data: data.data1,
            stack: "zs",
            type: "bar",
            barMaxWidth: "auto",
            barWidth: 30,
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
          {
            data: data.data1,
            type: "pictorialBar",
            barMaxWidth: "20",
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [0, "-50%"],
            symbolSize: [30, 12],
            zlevel: 2,
          },
          {
            data: data.data1,
            type: "pictorialBar",
            barMaxWidth: "20",
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [0, "-50%"],
            symbolSize: [30, 12],
            zlevel: 2,
          },
        ],
      });
    },
    getTime() {
      this.chart = echarts.init(this.$el, "macarons");
      this.timer = setInterval(() => {
        var dataLen = this.chartsData.data1.length;
        // 取消之前高亮的图形
        this.chart.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: app.currentIndex,
        });
        app.currentIndex = (app.currentIndex + 1) % dataLen; // 高亮当前图形
        this.chart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: app.currentIndex,
        });
        // 显示 tooltip
        this.chart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: app.currentIndex,
        });
      }, 4000);
    },
  },
  watch: {
    chartsData: {
      handler(newVal) {
        app = {
          currentIndex: -1,
        };
        clearInterval(this.timer);
        this.chart.dispose();
        this.chart = null;
        this.$nextTick(() => {
          this.initChart();
          this.getTime();
        });
      },
      deep: true,
    },
  },
};
</script>
