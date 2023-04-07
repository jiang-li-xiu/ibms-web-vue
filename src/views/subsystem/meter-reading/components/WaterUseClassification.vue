<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-10 14:12:21
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-09-27 11:15:28
-->
<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-10 16:11:32
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-09-27 10:56:03
-->
<template>
  <div>
    <div class="assembly-head">
      <span class="assembly-head-title">{{ title }}</span>
      <div>
        <el-date-picker
          size="mini"
          v-model="date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          @change="selectDateChange"
          class="assembly-header-time"
        >
        </el-date-picker>
        <el-radio-group
          size="mini"
          v-model="queryParams.queryMode"
          @change="dateChange"
        >
          <el-radio-button label="Week">周</el-radio-button>
          <el-radio-button label="Month">月</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <hr class="assembly-hr" />
    <legendhollow-pie
      :chartsData="dataList"
      :className="className"
      :width="width"
      :height="height"
    ></legendhollow-pie>
  </div>
</template>

<script>
import { getPieChartReport } from "@/api/subsystem/meter-reading/pricing-management.js";
import LegendhollowPie from "@/components/Echarts/LegendHollowPie.vue";
export default {
  props: {
    title: {
      type: String,
      default: "图表",
    },
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
      date: [], //时间数组
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      dataList: {
        name: "用水分类统计",
        color: [
          "#0CD2E6",
          "#3751E6",
          "#FFC722",
          "#886EFF",
          "#008DEC",
          "#114C90",
          "#00BFA5",
        ],
        legend: [],
        seriesData: [],
      }, //用水分类统计,
      queryParams: {
        beginTime: "", //开始时间
        endTime: "", //结束时间
        meterType: "", //仪表类型
        queryMode: "Month", //查询方式 (周=Week、月份=Month、季度=Quarter、年=Year)
      },
    };
  },
  components: { LegendhollowPie },
  methods: {
    //获取选择时间
    selectDateChange(e) {
      this.queryParams.queryMode = "";
      this.queryParams.beginTime = e[0];
      this.queryParams.endTime = e[1];
      this.getList();
    },
    //获取选项点击
    dateChange(e) {
      this.date = "";
      this.queryParams.beginTime = "";
      this.queryParams.endTime = "";
      this.getList();
    },
    //折线图
    getList(type) {
      if (type) {
        this.queryParams.meterType = type;
      }
      getPieChartReport(this.queryParams).then((response) => {
        this.dataList.legend = response.data.legend;
        this.dataList.seriesData = response.data.Date;
        this.dataList.name = this.title + "图表";
      });
    },
  },
};
</script>
<style scoped lang='scss' >
.assembly-head {
  height: 50px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 20px;
}
.assembly-hr {
  margin: 0;
  background-color: rgb(0, 0, 0);
  border: none;
  height: 1px;
  opacity: 0.2;
}
.assembly-head-title {
  font-weight: 600;
}
.assembly-header-time {
  margin-right: 20px;
  max-width: 300px;
}
</style>
