<!--
 * @Descripttion: 
 * @version: 
 * @Author: CenMingGuang
 * @LastEditors: CenMingGuang
 * @Date: 2021-09-13 18:23:41
 * @LastEditTime: 2021-09-18 09:26:44
-->
/*
 * @Author: CenMingGuang 
 * @Date: 2021-09-Tu 02:23:21 
 * @Last Modified by:   CenMingGuang 
 * @Last Modified time: 2021-09-Tu 02:23:21 
 */

<template>
  <div>
    <el-row :gutter="20" class="assembly-head">
      <el-col :span="8">
        <span class="assembly-head-title">报警 TOP 10</span>
      </el-col>
      <el-col :span="16">
        <div class="assembly-info">
          <el-radio-group v-model="radio" size="mini" @change="handleRadioChange">
            <el-radio-button label="本周"></el-radio-button>
            <el-radio-button label="本月"></el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>
    <hr class="assembly-hr" />
    <div class="pie-chart">
      <bar-chart
        ref="barChart"
        :data="areaAlarmData"
        :className="className"
        :width="width"
        :height="height"
      ></bar-chart>
    </div>
  </div>
</template>

<script>
// 柱形图
import BarChart from './TopTenAlarmsBarChart.vue'
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
  },
  data() {
    return {
      radio: '本周',
      areaAlarmData: {},
    }
  },
  methods: {
    handleRadioChange(value) {
      let typeName = ''
      switch (value) {
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
  components: { BarChart },
  watch: {
    data: {
      handler(val) {
        const data = [...val.seriesData]
        const seriesData = data.sort((a, b) => b.value - a.value)
        const legend = seriesData.map((item) => item.name)
        this.areaAlarmData = {
          seriesData,
          legend,
        }
      },
      deep: true,
    },
  },
}
</script>
<style scoped lang='scss' >
.assembly-head {
  height: 50px;
  line-height: 50px;
}
.assembly-head-title {
  margin: 0 10px;
  font-weight: 600;
}
.assembly-hr {
  margin: 0;
  background-color: rgb(0, 0, 0);
  border: none;
  height: 1px;
  opacity: 0.2;
}
.assembly-info {
  float: right;
  padding-right: 10px;
  button {
    margin-left: 20px;
    margin-right: 20px;
  }
}
.pie-chart {
  height: calc(100% - 50px);
  flex: 1;
  display: flex;
  align-items: center;
}
</style>
