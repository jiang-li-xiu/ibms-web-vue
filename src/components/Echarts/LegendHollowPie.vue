<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-10 14:31:24
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-01 16:51:54
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
      let data = this.chartsData;
      this.chart.setOption({
        // backgroundColor: "#050e31",
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
        color: data.color,
        grid: {
          top: "15%",
          left: 0,
          right: "1%",
          bottom: 5,
          containLabel: true,
        },
        legend: {
          orient: "vertical", //垂直布局
          top: "center",
          right: 100,
          type: "scroll",
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
            let item = null;
            let count = 0;
            if (data.seriesData.length) {
              data.seriesData.filter((it) => {
                count += it.value;
                if (it.name === name) {
                  item = it;
                }
              });
              let value =
                item.value !== 0
                  ? parseFloat((item.value * 100) / count).toFixed(2)
                  : 0;

              return `{name|${name}：}{value| ${item.value}} {rate| (${value}%)}`;
            }
          },
        },
        series: [
          {
            name: "需求类型占比",
            type: "pie",
            center: ["25%", "50%"],
            radius: ["45%", "65%"],
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
