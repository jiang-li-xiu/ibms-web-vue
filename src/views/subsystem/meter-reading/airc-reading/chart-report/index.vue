<!--
 * @Author       : Humility
 * @Date         : 2022-06-11 14:54:00
 * @LastEditTime : 2022-06-11 17:50:14
 * @LastEditors  : Humility
 * @FilePath     : \ibms-web-vue\src\views\subsystem\meter-reading\airc-reading\chart-report\index.vue
 * @Description  : 
-->
<template>
  <div class="assembly-container">
    <!-- 楼栋空调流量排行 -->
    <water-ranking
      title="楼栋空调流量排行"
      :meterTypes="meterTypes"
      v-if="loading"
      ref="mychild"
      class="assembly-container-col maging-content"
    ></water-ranking>
    <!-- 空调流量统计 -->
    <water-statistics
      title="空调流量统计"
      :meterTypes="meterTypes"
      v-if="loading"
      ref="mychild2"
      class="assembly-container-col maging-content"
    ></water-statistics>
  </div>
</template>

<script>
import WaterRanking from "../../components/TrafficRanking.vue";
import WaterStatistics from "../../components/WaterStatistics.vue";
export default {
  name: "ChartReport",
  components: { WaterRanking, WaterStatistics },
  data() {
    return {
      meterTypes: "远程抄表系统-空调表",
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