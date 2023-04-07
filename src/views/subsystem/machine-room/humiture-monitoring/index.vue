<template>
  <div class="app-container assembly-container">
    <!-- 温度 -->
    <div class="temperature">
      <el-row :gutter="20" class="assembly-head">
        <el-col :span="6">
          <span class="assembly-head-title">机房温度实时监测</span>
        </el-col>
        <el-col :span="8" class="info">
          当前温度：
          <span>{{currentTemperature.temperature}}℃ {{currentTemperature.status}}</span>
        </el-col>
        <el-col :span="8" class="info">
          告警温度：
          <span class="alarm-temperature">{{temperaturelarmParamData.alarmTemperature}}℃</span>
        </el-col>
        <el-col :span="2">
          <div class="assembly-info">
            <el-button
              type="primary"
              size="mini"
              @click="dialogVisible = true"
              icon="el-icon-setting"
            >设置</el-button>
          </div>
        </el-col>
      </el-row>
      <hr class="assembly-hr" />
      <!-- 折线图 -->
      <humiture-line-chart :data="temperatureData"></humiture-line-chart>
    </div>
    <!-- 湿度 -->
    <div class="humidity">
      <el-row :gutter="20" class="assembly-head">
        <el-col :span="6">
          <span class="assembly-head-title">机房湿度实时监测</span>
        </el-col>
        <el-col :span="8" class="info">
          当前湿度：
          <span>{{currentHumidity.humidity}}% {{currentHumidity.status}}</span>
        </el-col>
        <el-col :span="8" class="info">
          告警湿度：
          <span class="alarm-temperature">{{humidityAlarmParamData.alarmHumidity}}%</span>
        </el-col>
        <el-col :span="2">
          <div class="assembly-info">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-setting"
              @click="humidityDialogVisible = true"
            >设置</el-button>
          </div>
        </el-col>
      </el-row>
      <hr class="assembly-hr" />
      <!-- 折线图 -->
      <humiture-line-chart :data="humidityData"></humiture-line-chart>
    </div>

    <!--  温度告警设置弹窗-->
    <el-dialog :visible="dialogVisible" title="设置" width="30%">
      <div class="dialog-container">
        <!-- 告警温度 -->
        <div class="alarmTemperature">
          <div class="title">告警温度设置：</div>
          <div class="form">
            <el-form :model="temperaturelarmParamData">
              <el-form-item prop="alarmTemperature" label="告警温度">
                <el-input-number
                  class="input-number"
                  v-model="temperaturelarmParamData.alarmTemperature"
                  controls-position="right"
                  placeholder="请输入数值"
                ></el-input-number>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- 告警预案 -->
        <div class="alarmPlan">
          <div class="title">
            告警预案设置：
            <span>（参数达到设定值后发生报警，显示预案）</span>
          </div>
          <div class="list">
            <div
              class="item"
              v-for="(item, index) in temperaturelarmParamData.alarmPlan"
              :key="index"
            >
              <div class="index">{{index}}：</div>
              <div class="input">
                <el-input
                  size="mini"
                  v-model="temperaturelarmParamData.alarmPlan[index]"
                  placeholder="请输入内容"
                ></el-input>
              </div>
            </div>

            <!-- 添加 -->
            <el-button
              @click="temperaturelarmParamData.alarmPlan.push('')"
              type="primary"
              size="mini"
              icon="el-icon-plus"
            >添加</el-button>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
      </template>
    </el-dialog>

    <!--  湿度告警设置弹窗-->
    <el-dialog :visible="humidityDialogVisible" title="设置" width="30%">
      <div class="dialog-container">
        <!-- 告警湿度 -->
        <div class="alarmTemperature">
          <div class="title">告警湿度设置：</div>
          <div class="form">
            <el-form :model="humidityAlarmParamData">
              <el-form-item prop="alarmHumidity" label="告警湿度">
                <el-input-number
                  class="input-number"
                  v-model="humidityAlarmParamData.alarmHumidity"
                  controls-position="right"
                  placeholder="请输入数值"
                ></el-input-number>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- 告警预案 -->
        <div class="alarmPlan">
          <div class="title">
            告警预案设置：
            <span>（参数达到设定值后发生报警，显示预案）</span>
          </div>
          <div class="list">
            <div
              class="item"
              v-for="(item, index) in humidityAlarmParamData.alarmPlan"
              :key="index"
            >
              <div class="index">{{index}}：</div>
              <div class="input">
                <el-input
                  size="mini"
                  v-model="humidityAlarmParamData.alarmPlan[index]"
                  placeholder="请输入内容"
                ></el-input>
              </div>
            </div>

            <!-- 添加 -->
            <el-button
              @click="humidityAlarmParamData.alarmPlan.push('')"
              type="primary"
              size="mini"
              icon="el-icon-plus"
            >添加</el-button>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="humidityDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="humidityDialogVisible = false" size="mini">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import HumitureLineChart from './HumitureLineChart.vue'
export default {
  components: { HumitureLineChart },
  data() {
    return {
      // 温度数据
      temperatureData: {
        legend: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '24',
        ],
        seriesData: [
          { name: '01时', value: 0 },
          { name: '02时', value: 5 },
          { name: '03时', value: 15 },
          { name: '04时', value: 14 },
          { name: '05时', value: 14 },
          { name: '06时', value: 12 },
          { name: '07时', value: 5 },
          { name: '08时', value: 20 },
          { name: '09时', value: 30 },
          { name: '10时', value: 40 },
          { name: '11时', value: 50 },
          { name: '12时', value: 20 },
        ],
      },

      // 温度告警设置参数数据
      temperaturelarmParamData: {
        // 告警温度
        alarmTemperature: 80,
        // 告警预案
        alarmPlan: [],
      },
      // 湿度数据
      humidityData: {
        legend: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '24',
        ],
        seriesData: [
          { name: '01', value: 20 },
          { name: '02时', value: 25 },
          { name: '03时', value: 15 },
          { name: '04时', value: 14 },
          { name: '05时', value: 14 },
          { name: '06时', value: 12 },
          { name: '07时', value: 5 },
          { name: '08时', value: 20 },
          { name: '09时', value: 30 },
          { name: '10时', value: 40 },
          { name: '11时', value: 50 },
          { name: '12时', value: 20 },
        ],
      },
      // 湿度告警设置参数数据
      humidityAlarmParamData: {
        // 告警湿度
        alarmHumidity: 80,
        // 告警预案
        alarmPlan: [],
      },
      // 告警设置弹窗开关
      dialogVisible: false,
      humidityDialogVisible: false,
    }
  },
  computed: {
    // 当前温度
    currentTemperature() {
      // 数据源
      const data = this.temperatureData.seriesData
      // 当前温度
      const temperature = data[data.length - 1].value
      // 判断温度是否达到告警值
      const flag = temperature < this.temperaturelarmParamData.alarmTemperature
      return {
        temperature,
        status: flag ? '正常' : '异常',
      }
    },
    // 当前湿度
    currentHumidity() {
      // 数据源
      const data = this.humidityData.seriesData
      // 当前温度
      const humidity = data[data.length - 1].value
      // 判断温度是否达到告警值
      const flag = humidity < this.humidityAlarmParamData.alarmHumidity
      return {
        humidity,
        status: flag ? '正常' : '异常',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.assembly-container {
  height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.temperature {
  height: 49%;
  background-color: #fff;
}
.humidity {
  height: 49%;

  background-color: #fff;
}
.assembly-head {
  height: 50px;
  line-height: 50px;
}
.assembly-head-title {
  margin-left: 10px;
  font-weight: 600;
}
.info {
  font-size: 14px;
  span {
    color: #53c7f8;
  }
  .abnormal-color {
    color: red;
  }
  .alarm-temperature {
    color: #f59a23;
  }
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
  button {
    margin-left: 20px;
    margin-right: 20px;
  }
}
.dialog-container {
  padding: 15px;
  font-size: 16px;
  color: #000;
}
.alarmTemperature {
  .title {
    margin-bottom: 15px;
  }
  .form {
    margin-left: 25px;
    .input-number {
      width: 120px;
    }
  }
}
.alarmPlan {
  margin-top: 20px;
  .title {
    margin-bottom: 15px;
    span {
      color: #999;
    }
  }
  .list {
    margin-left: 25px;
    .item {
      margin-bottom: 5px;
      height: 40px;
      display: flex;
      align-items: center;
    }
  }
}
</style>