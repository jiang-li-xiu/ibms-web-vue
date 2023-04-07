<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-06-09 08:56:49
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-06-14 09:40:11
-->
<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
const echarts = require("echarts/lib/echarts");
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize";
import { getAlarmNum } from "@/api/device/deviceBreakdown.js";

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
      default: "35vh",
    },
  },
  data() {
    return {
      chart: null,
      dataList: [],
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
  created() {},
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      getAlarmNum().then((res) => {
        let alarmData = res.data;
        this.dataList = [
          { value: alarmData[0], name: "严重" },
          { value: alarmData[1], name: "警告" },
          { value: alarmData[2], name: "提醒" },
        ];
        this.chart.setOption({
          color: ["#E94D43", "#F59A23", "#3AB896"],
          tooltip: {
            trigger: "item",
            backgroundColor: "rgba(255,255,255,0.8)", //设置背景图片 rgba格式
            color: "black",
            borderWidth: "1", //边框宽度设置1
            borderColor: "gray", //设置边框颜色
            textStyle: {
              color: "black", //设置文字颜色
            },
          },
          title: {
            text: alarmData[0] + alarmData[1] + alarmData[2],
            subtext: "总数",
            itemGap: 5,
            textAlign: "center",
            textStyle: {
              fontSize: "15",
              color: "#000",
            },
            subtextStyle: {
              fontSize: "15",
              color: "#000",
            },
            x: "29.5%",
            y: "45%",
          },
          legend: {
            orient: "vertical",
            top: "center",
            right: "30%",
            formatter: (name) => {
              let data = this.dataList;
              let tarValue = 0;
              for (let i = 0; i < 3; i++) {
                if (data[i].name == name) {
                  tarValue = data[i].value;
                }
              }
              let arr = [name, " " + tarValue];
              return arr.join("");
            },
          },
          series: [
            {
              name: "告警统计",
              type: "pie",
              center: ["30%", "50%"],
              radius: ["30%", "50%"],
              avoidLabelOverlap: false,
              itemStyle: {
                //   borderRadius: 10,
                borderColor: "#fff",
                borderWidth: 2,
              },
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: "20",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: this.dataList,
            },
          ],
        });
      });
    },
  },
};
</script>

