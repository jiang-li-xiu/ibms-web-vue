<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-16 09:04:01
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-26 16:58:12
-->
<template>
  <div>
    <div class="assembly-head">实时风量情况</div>
    <hr class="assembly-hr" />
    <linechart-water
      :chartsData="airConditionerData"
      height="35vh"
    ></linechart-water>
  </div>
</template>

<script>
import { getMonitorData } from "@/api/subsystem/envir-monitoring/envir-monitoring.js";
import LinechartWater from "@/components/Echarts/LineChartWater";

import bus from "@/utils/bus.js";

export default {
  data() {
    return {
      airConditionerData: {
        xLabel: [
          "2021-3-25",
          "2021-3-26",
          "2021-3-27",
          "2021-3-28",
          "2021-3-29",
          "2021-3-30",
          "2021-3-31",
        ],
        series: [
          [10, 10, 30, 12, 15, 3, 7],
          [5, 12, 11, 400, 25, 16, 10],
          [150, 120, 170, 140, 500, 160, 110],
        ],
        nameList: ["CO", "CO2", "PM 2.5"],
        colorList: ["#9E87FF", "#73DDFF", "#fe9a8b", "#F56948", "#9E87FF"],
        name: "实时风量情况",
        title: "",
        yAxisName: "m³/h",
      },
      queryParams: {
        regionId: 0, //区域id
        startTime: "", //开始时间
        endTime: "", //结束时间
        dateTime: [],
      },
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    // 获取树形组件回传的数据、子组件互相传值
    bus.$on("busMethod", (data) => {
      this.getTreeData(data);
    });
  },
   beforeDestroy() {
    bus.$off("busMethod"); // 组件销毁时关闭监听
  },
  components: { LinechartWater },
  methods: {
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.startTime = "";
      this.queryParams.endTime = "";
      this.resetForm("queryForm");
    },
    /** 查询按钮操作 */
    handleQuery() {
      if (this.queryParams.dateTime) {
        this.queryParams.startTime = this.queryParams.dateTime[0];
        this.queryParams.endTime = this.queryParams.dateTime[1];
      } else {
        this.queryParams.startTime = "";
        this.queryParams.endTime = "";
      }
      this.getList();
    },
    //获取树形组件回传的数据
    getTreeData(data) {
      this.queryParams.regionId = data.regionId;
      this.resetQuery();
      this.getList();
    },
    getList() {
      getMonitorData(this.queryParams).then((response) => {
        this.airConditionerData.xLabel = response.xLabel;
        this.airConditionerData.series = response.series;
        this.airConditionerData.xLabel = response.xLabel;
      });
    },
  },
};
</script>
<style scoped lang='scss' >
.assembly-hr {
  margin: 0;
  background-color: rgb(0, 0, 0);
  border: none;
  height: 1px;
  opacity: 0.2;
}
.assembly-head {
  display: flex;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
}
.assembly-margin-10 {
  margin: 10px;
}
</style>
