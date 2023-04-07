<!--
 * @Author       : Humility
 * @Date         : 2022-06-11 14:54:00
 * @LastEditTime : 2022-06-11 17:50:35
 * @LastEditors  : Humility
 * @FilePath     : \ibms-web-vue\src\views\subsystem\meter-reading\water-reading\chart-report\index.vue
 * @Description  : 
-->
<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-10 11:49:54
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-10-11 14:18:40
-->
<template>
  <div class="assembly-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12">
        <!-- 用水分类统计 -->
        <use-classification
          title="用水分类统计"
          v-if="loading"
          ref="mychild3"
          :meterTypes="meterTypes"
          class="assembly-container-col maging-content"
        ></use-classification>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <!-- 楼栋用水排行 -->
        <water-ranking
          title="楼栋用水排行"
          :meterTypes="meterTypes"
          v-if="loading"
          ref="mychild"
          class="assembly-container-col maging-content"
        ></water-ranking>
      </el-col>
    </el-row>
    <!-- 用水统计 -->
    <water-statistics
      title="生活用水统计"
      :meterTypes="meterTypes"
      v-if="loading"
      ref="mychild2"
      class="assembly-container-col maging-content"
    ></water-statistics>
  </div>
</template>

<script>
import UseClassification from "../../components/WaterUseClassification.vue";
import WaterRanking from "../../components/WaterRanking.vue";
import WaterStatistics from "../../components/WaterStatistics.vue";
export default {
  name: "ChartReport",
  components: { UseClassification, WaterRanking, WaterStatistics },
  data() {
    return {
      meterTypes: "远程抄表系统-水表",
      loading: false,
    };
  },
  created() {
    this.onSeve();
  },
  methods: {
    onSeve() {
      this.loading = true;
      setTimeout(() => {
        this.$refs.mychild.getList(this.meterTypes);
        this.$refs.mychild2.getList(this.meterTypes);
        this.$refs.mychild3.getList(this.meterTypes);
      }, 5);
    },
  },
};
</script>
<style scoped lang='scss' >
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