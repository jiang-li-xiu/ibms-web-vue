<template>
  <div class="app-container assembly-container">
    <div class="chart">
      <el-row class="row" :gutter="10">
        <el-col :xs="24" :sm="24" :md="12">
          <!-- 报警次数占比 -->
          <proportion-of-alarm-times
            :data="alarmProportionData"
            class="proportion assembly-container-col"
            style="margin-right: 8px"
            @handleRadioChange="handleProportionRadioChange"
            height="calc(50vh - 120px)"
          ></proportion-of-alarm-times>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12">
          <!-- 报警 TOP 10 -->
          <alarm-top-ten
            :data="alarmTopTenData"
            class="assembly-container-col"
            style="margin-left: 8px"
            @handleRadioChange="handleAlarmTopTenChange"
            height="calc(50vh - 120px)"
          ></alarm-top-ten>
        </el-col>

        <el-col :span="24" style="margin-top: 20px">
          <!-- 报警时间段统计 -->
          <alarm-time-statistics
            :data="alarmTimeStatisticsData"
            :type="alarmTimeStatisticsParams.type"
            class="assembly-container-col maging-content"
            @handleRadioChange="handleAlarmTimeRadioChange"
            height="calc(50vh - 120px)"
          ></alarm-time-statistics>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// api接口
import {
  getAreaAlarmAmount,
  getAreaRegionCountByTime,
} from "@/api/subsystem/intrusion-alarm";

// 报警次数占比
import ProportionOfAlarmTimes from "./components/ProportionOfAlarmTimes.vue";
//  报警 TOP 10
import AlarmTopTen from "./components/AlarmTopTen.vue";
// 报警时间段统计
import AlarmTimeStatistics from "./components/AlarmTimeStatistics.vue";
export default {
  components: { ProportionOfAlarmTimes, AlarmTopTen, AlarmTimeStatistics },
  data() {
    return {
      areaAlarmData: {
        legend: [],
        seriesData: [],
      },
      // 报警 TOP 10
      alarmData: {
        legend: [],
        seriesData: [],
      },
      // 报警区域参数
      areaAlarmParams: {
        type: "toWeek",
      },
      // 报警 TOP 10 参数
      AlarmTopTenParams: {
        type: "toWeek",
      },
      // 报警时间段统计
      alarmTimeStatisticsData: {
        legend: [],
        seriesData: [],
      },
      alarmTimeStatisticsParams: {
        type: "toDay",
        startTime: null,
        endTime: null,
      },
    };
  },
  mounted() {
    this.getAlarmAreaData();
    this.getAlarmAmount();
    this.getAreaRegionCountByTime();
  },
  methods: {
    // 获取报警区域数据
    getAlarmAreaData() {
      getAreaAlarmAmount(this.areaAlarmParams).then((res) => {
        const legend = [];
        let sum = 0;
        res.data.forEach((item) => {
          legend.push(item.regionName);
          sum += item.recordCount;
        });
        const seriesData = res.data.map((item) => ({
          name: item.regionName,
          value: sum === 0 ? 0 : (item.recordCount / sum) * 100,
        }));
        this.areaAlarmData.legend.splice(0);
        this.areaAlarmData.seriesData.splice(0);
        this.areaAlarmData.legend.push(...legend);
        this.areaAlarmData.seriesData.push(...seriesData);
      });
    },
    // 获取报警区域前十数据
    getAlarmAmount() {
      getAreaAlarmAmount(this.AlarmTopTenParams).then((res) => {
        const legend = [];
        const seriesData = [];
        res.data.forEach((item) => {
          legend.push(item.regionName);
          seriesData.push({
            name: item.regionName,
            value: item.recordCount,
          });
        });
        this.alarmData = {
          legend,
          seriesData,
        };
      });
    },
    // 获取按照时间统计告警数量
    getAreaRegionCountByTime() {
      getAreaRegionCountByTime(this.alarmTimeStatisticsParams).then((res) => {
        const legend = [];
        const seriesData = [];
        res.data.forEach((item) => {
          let time = "";
          switch (this.alarmTimeStatisticsParams.type) {
            case "toDay":
              time = new Date(item.time).getHours();
              break;
            case "toWeek":
              time = new Date(item.time).getDay();
              break;
            case "toMonth":
              time = new Date(item.time).getDate();
              break;
          }
          legend.push(time);
          const obj = {
            name: time,
            value: item.recordCount,
          };
          seriesData.push(obj);
        });
        this.alarmTimeStatisticsData = {
          legend,
          seriesData,
        };
      });
    },
    handleAlarmTimeRadioChange(type) {
      this.alarmTimeStatisticsParams.type = type;
      this.getAreaRegionCountByTime();
    },
    handleProportionRadioChange(type) {
      this.areaAlarmParams.type = type;
      this.getAlarmAreaData();
    },
    handleAlarmTopTenChange(type) {
      this.AlarmTopTenParams.type = type;
      this.getAlarmAmount();
    },
  },
  computed: {
    alarmProportionData() {
      return this.areaAlarmData;
    },
    alarmTopTenData() {
      return this.alarmData;
    },
  },
};
</script>
<style scoped lang='scss' >
.assembly-container {
  height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
.chart {
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 125px);
}
.assembly-container-col {
  background-color: #fff;
  // margin-bottom: 2%;
}
.proportion {
  // display: flex;
  // flex-direction: column;
}
.maging-content {
}
</style>
