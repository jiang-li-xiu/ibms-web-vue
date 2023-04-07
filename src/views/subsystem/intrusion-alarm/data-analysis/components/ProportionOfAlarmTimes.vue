<!--
 * @Descripttion: 
 * @version: 
 * @Author: CenMingGuang
 * @LastEditors: CenMingGuang
 * @Date: 2021-09-13 18:23:41
 * @LastEditTime: 2021-09-18 09:26:54
-->

<template>
  <div>
    <el-row :gutter="20" class="assembly-head">
      <el-col :span="8">
        <span class="assembly-head-title">报警次数占比</span>
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
      <legend-hollow-pie
        ref="pie"
        :data="areaAlarmData"
        :className="className"
        :width="width"
        :height="height"
      ></legend-hollow-pie>
    </div>
  </div>
</template>

<script>
import LegendHollowPie from './LegendHollowPie.vue'
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
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
      default: '300px',
    },
  },
  data() {
    return {
      radio: '本周',
      areaAlarmData: this.data,
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
  components: { LegendHollowPie },
  watch: {
    data: {
      handler(newValue) {
        this.areaAlarmData = newValue
        this.$refs.pie.initChart()
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
  margin-left: 10px;
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
