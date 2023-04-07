<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-10 16:11:32
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-01 17:27:31
-->
<template>
  <div class="flex flex-column">
    <div class="assembly-head">
      <div>
        <span class="font-600">年度报警统计</span>

        <span class="assembly-head-span"
          >报警高发时段： <span>{{ month }}</span>
        </span>
      </div>

      <el-date-picker
        v-model="times"
        type="monthrange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        :picker-options="pickerOptions"
        @change="changeDatePicker"
      >
      </el-date-picker>
    </div>

    <linechart-water
      class="flex-1 p-15"
      v-if="isShow"
      ref="reference"
      :data="airConditionerData"
      :className="className"
      :width="width"
      :height="height"
    ></linechart-water>
  </div>
</template>

<script>
import LinechartWater from "@/components/Echarts/StatisticalLineChart";

import { getStatistics } from "@/api/subsystem/alarm-eqpt/index.js";

export default {
  components: { LinechartWater },
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
      times: null,
      month: "",
      isShow: false,
      // 年度报警统计
      airConditionerData: {
        XName: [],
        data1: [],
        name: "年度报警统计",
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "本月",
            onClick(picker) {
              picker.$emit("pick", [new Date(), new Date()]);
            },
          },
          {
            text: "今年至今",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近六个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.getDataList();
  },

  methods: {
    // 获取数据
    async getDataList() {
      let times = this.times;

      let { data } = await getStatistics({
        startDate: times ? this.parseTime(times[0], "{y}-{m}") : null,
        endDate: times ? this.parseTime(times[1], "{y}-{m}") : null,
      });

      let deepClone = function (data) {
        if (data === null || typeof data !== "object") return data;
        let cloneData = Array.isArray(data) ? [] : {};
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            cloneData[key] = deepClone(data[key]);
          }
        }
        return cloneData;
      };

      this.month = deepClone(data).sort((a, b) => {
        return b.countNum - a.countNum;
      })[0].name;

      data.forEach((item) => {
        this.airConditionerData.XName.push(item.name);
        this.airConditionerData.data1.push(item.countNum);
      });

      this.$nextTick(() => {
        this.isShow = true;
      });
    },

    // 选中月份确定后
    changeDatePicker() {
      this.airConditionerData = {
        XName: [],
        data1: [],
        name: "年度报警统计",
      };
      this.isShow = false;
      this.getDataList();
    },

    ownloadEcharts() {
      this.$refs.reference.download(3);
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
  .assembly-head-span {
    font-size: 15px;
    margin-left: 80px;
    span {
      color: #02a7f0;
    }
  }
}
</style>
