<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-10 14:12:21
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-01 16:24:03
-->
<template>
  <div class="flex flex-column">
    <div class="assembly-head">
      <span class="font-600">报警类型统计</span>

      <el-radio-group v-model="timeType" size="mini" @change="radioGroup">
        <el-radio-button label="toWeek">本周</el-radio-button>
        <el-radio-button label="toMonth">本月</el-radio-button>
      </el-radio-group>
    </div>

    <legendhollow-pie
      class="flex-1 p-15"
      ref="reference"
      :chartsData="classificationData"
      :className="className"
      :width="width"
      :height="height"
    ></legendhollow-pie>
  </div>
</template>

<script>
import LegendhollowPie from "@/components/Echarts/LegendHollowPie.vue";

import { getUseClassification } from "@/api/subsystem/alarm-eqpt/index.js";

export default {
  components: { LegendhollowPie },
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
      default: "300px",
    },
  },
  data() {
    return {
      timeType: "",
      // 报警类型统计
      classificationData: {
        // color: [
        //   "#0CD2E6",
        //   "#3751E6",
        //   "#FFC722",
        //   "#886EFF",
        //   "#008DEC",
        //   "#114C90",
        //   "#00BFA5",
        // ],

        legend: [],
        seriesData: [],
        name: "报警类型统计",
      },
    };
  },
  mounted() {
    this.getAlarmType();
  },

  methods: {
    // 获取数据
    getAlarmType() {
      getUseClassification({ timeType: this.timeType }).then((response) => {
        //重置图表数据
        this.classificationData.legend = [];
        this.classificationData.seriesData = [];

        response.data.forEach((item) => {
          this.classificationData.legend.push(item.name);
          this.classificationData.seriesData.push({
            name: item.name,
            value: item.countNum,
          });
        });
      });
    },

    // 周/月切换
    radioGroup() {
      this.getAlarmType();
    },

    ownloadEcharts() {
      this.$refs.reference.download(0);
    },
  },
};
</script>

<style scoped lang="scss">
.assembly-head {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 2px solid #eee;
}
</style>
