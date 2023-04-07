<!--
 * @Author: MJ
 * @Date: 2021-11-03 15:11:32
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-03 17:20:38
 * @Description: 
-->
<template>
  <div :id="sector.id" :style="{ height: sector.height, width: sector.width }" />
</template>

<script>
// import echarts from "echarts";
const echarts = require("echarts/lib/echarts");
require("echarts/lib/component/grid");
require("echarts/lib/chart/line");
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize.js";

export default {
  mixins: [resize],
  props: {
    sector: {
      type: Object,
      default() {
        return {
          data: [
            { value: 1048, name: "0-25" },
            { value: 735, name: "26-50" },
            { value: 580, name: "51-150" },
            { value: 484, name: "151-300" },
            { value: 300, name: "300以上" },
          ],
          width: "33%",
          height: "27em",
          title: "CO浓度",
          id: "MonitorSectorSector",
        };
      },
    },
    // className: {
    //   type: String,
    //   default: "echarts-line-chart",
    // },
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
    sector: {
      handler(newVal) {
        console.log(newVal);
        // this.chart.dispose();
        // this.chart = null;
        // this.$nextTick(() => {
        //   this.initChart();
        // });
      },
      deep: true,
      immediate: true, // 立即执行
    },
  },

  methods: {
    initChart() {
      const colors = ["#81d3f8", "#8080ff"];

      this.chart = echarts.init(document.getElementById(`${this.sector.id}`));

      this.chart.setOption({
        title: {
          text: this.sector.title,
          //   subtext: "Fake Data",
          left: "center",
          top: 10,
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "horizontal",
          bottom: 10,
          left: "center",
          icon: "circle",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            label: {
              normal: {
                show: true,
                position: "outside",
                textStyle: {
                  fontWeight: 600,
                  fontSize: 17,
                  color: "#000",
                },
                formatter: "{d}%",
              },
            },
            data: this.sector.data,
          },
        ],
      });
    },
  },
};
</script>
