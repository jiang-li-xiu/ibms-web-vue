<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-14 09:05:35
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-05 14:36:04
-->
<template>
  <div class="assembly-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12">
        <!-- 报警类型统计 -->
        <use-classification
          class="assembly-container-col maging-content"
        ></use-classification>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12">
        <!-- 楼栋报警排行 -->
        <water-ranking class="assembly-container-col maging-content"></water-ranking>
      </el-col>
    </el-row>

    <!-- 年度报警统计 -->
    <water-statistics class="assembly-container-col maging-content"></water-statistics>
  </div>
</template>

<script>
import UseClassification from "./WaterUseClassification.vue";
import WaterRanking from "./WaterRanking.vue";
import WaterStatistics from "./WaterStatistics.vue";

export default {
  name: "AlarmAnalyse",
  components: { UseClassification, WaterRanking, WaterStatistics },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.assembly-container {
  min-height: calc(100vh - 84px);
  padding: 0 20px 20px;
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
.assembly-container-col {
  min-height: calc(50vh - 72px);
  background-color: #fff;
}
.maging-content {
  margin-top: 20px;
}
</style>
