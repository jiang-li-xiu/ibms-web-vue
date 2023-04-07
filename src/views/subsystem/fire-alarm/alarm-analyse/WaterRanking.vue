<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-10 16:11:32
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-01 16:53:32
-->
<template>
  <div class="flex flex-column">
    <div class="assembly-head">
      <span class="font-600">易触发火警区域</span>

      <el-radio-group v-model="timeType" size="mini" @change="radioGroup">
        <el-radio-button label="toWeek">本周</el-radio-button>
        <el-radio-button label="toMonth">本月</el-radio-button>
      </el-radio-group>
    </div>

    <cuboid-bardiagram
      class="flex-1 p-15"
      ref="reference"
      :chartsData="rankingData"
      :className="className"
      :width="width"
      :height="height"
    ></cuboid-bardiagram>
  </div>
</template>

<script>
import CuboidBardiagram from "@/components/Echarts/CuboidBarDiagram.vue";

import { getCountBuilding } from "@/api/subsystem/alarm-eqpt/index.js";

export default {
  components: { CuboidBardiagram },
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
      timeType: "",
      // 易触发火警区域
      rankingData: {
        xData: [],
        data1: [],
        yAxis: { name: "次" },
        name: "易触发火警区域",
        marker: "报警次数：",
      },
    };
  },
  mounted() {
    this.getDataList();
  },

  methods: {
    // 获取数据
    async getDataList() {
      let { data,total } = await getCountBuilding({ timeType: this.timeType });
      data.forEach((item) => {
        this.rankingData.xData.push(item.name);
        this.rankingData.data1.push(item.countNum);
      });
    },

    // 周/月切换
    radioGroup() {
      this.rankingData = {
        xData: [],
        data1: [],
        yAxis: { name: "次" },
        name: "易触发火警区域",
        marker: "报警次数：",
      };
      this.getDataList();
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
