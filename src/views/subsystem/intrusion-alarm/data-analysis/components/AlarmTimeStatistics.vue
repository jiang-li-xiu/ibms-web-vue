/*
 * @Author: CenMingGuang 
 * @Date: 2021-09-Tu 02:23:15 
 * @Last Modified by:   CenMingGuang 
 * @Last Modified time: 2021-09-Tu 02:23:15 
 */

<template>
  <div class="alarm-time-statistics">
    <el-row :gutter="20" class="assembly-head">
      <el-col :span="6">
        <span class="assembly-head-title">报警时间段统计</span>
      </el-col>
      <el-col :span="6">
        报警高发时段：
        <span class="alarm-peak-time">{{alarmPeakTime}}</span>
      </el-col>
      <el-col :span="12">
        <div class="assembly-info">
          <el-radio-group v-model="radio" size="mini" @change="handleRadioChange">
            <el-radio-button label="当天"></el-radio-button>
            <el-radio-button label="本周"></el-radio-button>
            <el-radio-button label="本月"></el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>
    <hr class="assembly-hr" />
    <div class="bar-chart">
      <bar-chart :data="data" :type="type" :className="className" :width="width" :height="height"></bar-chart>
    </div>
  </div>
</template>

<script>
// 柱形图
import BarChart from './AlarmTimeBarChart.vue'
export default {
  props: {
    data: {
      type: Object,
      default: {},
    },
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    type: {
      type: String,
      default: 'toDay',
    },
  },
  data() {
    return {
      radio: '当天',
      alarmPeakTime: '',
    }
  },
  components: { BarChart },
  watch: {
    data: {
      handler(val) {
        const arr = [...val.seriesData]
        arr.sort((a, b) => b.value - a.value)
        this.alarmPeakTime = arr[0].name
      },
      deep: true,
    },
  },
  methods: {
    handleRadioChange(value) {
      let typeName = ''
      switch (value) {
        case '当天':
          typeName = 'toDay'
          break
        case '本周':
          typeName = 'toWeek'
          break
        case '本月':
          typeName = 'toMonth'
          break
      }
      this.$emit('handleRadioChange', typeName)
    },
  },
}
</script>
<style scoped lang='scss' >
.alarm-time-statistics {
  height: 100%;
}
.assembly-head {
  height: 50px;
  line-height: 50px;
}
.assembly-head-title {
  margin-left: 10px;
  font-weight: 600;
}
.alarm-peak-time {
  color: #53c7f8;
}
.assembly-hr {
  margin: 0;
  background-color: rgb(0, 0, 0);
  border: none;
  height: 1px;
  opacity: 0.2;
}
.assembly-info {
  padding-right: 10px;
  float: right;
  button {
    margin-left: 20px;
    margin-right: 20px;
  }
}
.bar-chart {
  height: 90%;
  flex: 1;
  display: flex;
  align-items: center;
}
</style>
