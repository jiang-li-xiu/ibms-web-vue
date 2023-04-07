<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-08-13 15:03:26
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-10-23 15:36:37
-->
<template>
  <div>
    <div class="head" style="display: flex; justify-content: space-between">
      <div class="title">当月设备告警量</div>
      <div class="date_box">
        <el-date-picker
          v-model="monthVal"
          type="month"
          placeholder="选择月份"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="changeMoth"
        >
        </el-date-picker>
      </div>
    </div>

    <singel-line-chart
      v-if="dataObj.total"
      :chartData="dataObj"
      :height="'214px'"
    ></singel-line-chart>

    <div class="null-box" v-else>暂无告警数据</div>

    <div class="flex-row-csb footer">
      <div class="text">
        <span class="text">当月设备告警量：</span>
        <span class="number">{{ dataObj.total }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import SingelLineChart from "./echarts/SingelLineChart";

export default {
  name: "AlarmNumber",
  components: {
    SingelLineChart,
  },
  props: {
    dataObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      monthVal: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        },
      },

      dataf: {},
    };
  },
  watch: {
    dataObj: {
      deep: true,
      handler(val) {
        this.dataObj = val;
      },
    },
  },
  mounted() {
    this.monthVal = this.parseTime(new Date(), "{y}-{m}");
    // this.monthVal = "2021-09";
  },

  methods: {
    changeMoth(val) {
      this.$emit("alarmNumber", { dateMoth: this.parseTime(val, "{y}-{m}") });
    },
  },
};
</script>

<style scoped lang="scss">
.head {
  .title {
    font-size: 16px;
    color: #666666;
    font-weight: 600;
  }
}

.el-icon-refresh-left {
  cursor: pointer;
  color: #d9d9d9;
  font-size: 18px;
  font-weight: 600;
  transition: 1s;
}

.el-icon-refresh-left:hover {
  color: #207bff;
  transform: rotate(-360deg) scale(1.3);
}

.footer {
  height: 49px;
  border-top: 1px solid #f1f2f6;
  box-sizing: border-box;
  .text {
    font-size: 14px;
    span:nth-child(1) {
      color: #b6b6b6;
    }
  }
}

.null-box {
  height: 215px;
  line-height: 215px;
  text-align: center;
}
</style>
