<!--
 * @Author: MJ
 * @Date: 2021-11-03 10:56:36
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-19 10:42:37
 * @Description: 
-->
<template>
  <div class="back-ee">
    <div class="title-form-box">
      <div class="title">温湿度对比</div>

      <div class="assembly-head">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="100px"
        >
          <el-form-item
            label="时间范围："
            prop="dateTime"
            class="assembly-margin-10"
          >
            <el-date-picker
              v-model="queryParams.dateTime"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :change="change()"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item class="assembly-margin-10">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery"
              >查询</el-button
            >
            <el-button icon="el-icon-refresh" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>

    <hr class="assembly-hr" />

    <temperature-humidity-cylindrical
      :chartsData="airConditionerData"
    ></temperature-humidity-cylindrical>
  </div>
</template>

<script>
import {
  getMonitorData,
  columnChart,
} from "@/api/subsystem/envir-monitoring/envir-monitoring.js";
import TemperatureHumidityCylindrical from "@/components/Echarts/TemperatureHumidityCylindrical";

export default {
  components: { TemperatureHumidityCylindrical },
  // props: {
  //   treeNode: Object,
  // },
  data() {
    return {
      airConditionerData: {
        xAxis: [],
        temperature: [],
        humidity: [],
      },
      queryParams: {
        // regionId: 0, // 区域id
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        dateTime: [],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    change() {
      if (this.queryParams.dateTime) {
        this.queryParams.startTime = this.queryParams.dateTime[0];
        this.queryParams.endTime = this.queryParams.dateTime[1];
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        startTime: "", // 开始时间
        endTime: "", // 结束时间
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
      };
      columnChart(data).then((response) => {
          this.airConditionerData.xAxis = response.data.xAxis;
          this.airConditionerData.temperature = response.data.temperature;
          this.airConditionerData.humidity = response.data.humidity;
      });
    },
  },
  // watch: {
  //   treeNode: {
  //     handler(newVal) {
  //       this.queryParams.regionId = newVal.regionId;
  //       // this.resetQuery();
  //       // this.getList();
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
