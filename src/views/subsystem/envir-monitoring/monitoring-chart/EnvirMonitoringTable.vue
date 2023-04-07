<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-16 09:04:01
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-19 10:14:15
-->
<template>
  <div class="back-ee">
    <div class="title-form-box">
      <div class="title">环境数据变化折线图</div>

      <div class="assembly-head">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
          <el-form-item label="监测因子：" prop="queryType" class="assembly-margin-10">
            <!--  -->
            <el-select v-model="queryParams.queryType" placeholder="请选择">
              <el-option v-for="item in options" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="时间范围：" prop="dateTime" class="assembly-margin-10">
            <el-date-picker v-model="queryParams.dateTime" type="datetimerange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" :change="change()" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>

          <el-form-item class="assembly-margin-10">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <hr class="assembly-hr" />

    <echarts-line-chart :chartsData="airConditionerData"></echarts-line-chart>
  </div>
</template>

<script>
import { TableListMixin } from "@/mixins/TableListMixin";
import {
  lineChart,
} from "@/api/subsystem/envir-monitoring/envir-monitoring.js";
import EchartsLineChart from "@/components/Echarts/EchartsLineChart";

export default {
  mixins: [TableListMixin],
  components: { EchartsLineChart },
  // props: {
  //   treeNode: Object,
  // },
  data() {
    return {
      options: [],
      airConditionerData: {
        xAxis: [],
        series: [],
        company: "",
      },
      queryParams: {
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        queryType: "pm_one_fourth",
        dateTime: [],
      },
    };
  },
  created() {
    // this.getList();
    // this.airConditionerData.company = "μg/m³";
    this.getDicts("sys_environment_attr").then((response) => {
      console.log(response.data);
      this.options = response.data;
      // this.statusOptions = response.data;
    });
  },
  methods: {
    change() {
      if (this.queryParams.dateTime) {
        this.queryParams.startTime = this.queryParams.dateTime[0];
        this.queryParams.endTime = this.queryParams.dateTime[1];
      }
    },
    resetQuery() {
      this.queryParams = {
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        queryType: "pm_one_fourth",
        dateTime: [],
      }
      this.getList()
    },
    /** 查询按钮操作 */
    handleQuery() {
      this.getList()
    },
    getList() {
      let data = {
        startTime: this.queryParams.startTime,
        endTime: this.queryParams.endTime,
        queryType: this.queryParams.queryType,
      };
      lineChart(data).then((response) => {
        this.airConditionerData.xAxis = response.data.xAxis;
        this.airConditionerData.series = response.data.series;
        this.airConditionerData.company = "";
      })
    }
  },
  // watch: {
  //   treeNode: {
  //     handler(newVal) {
  //       this.queryParams.regionId = newVal.regionId;
  //       this.resetQuery();
  //       this.getList();
  //     },
  //   },
  // },
};
</script>
<style scoped lang="scss">
.back-ee {
  background-color: #fff;
}

.title-form-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin-left: 10px;
  color: "#000";
  font-size: 18px;
  font-weight: 600;
}

.assembly-hr {
  margin: 0;
  background-color: rgb(0, 0, 0);
  border: none;
  height: 1px;
  opacity: 0.2;
}

.assembly-head {
  display: flex;
  flex-direction: row-reverse;
}

.assembly-margin-10 {
  margin: 10px;
}
</style>
