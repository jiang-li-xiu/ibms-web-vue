<!--
 * @Author: MJ
 * @Date: 2021-11-03 15:02:53
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-19 10:27:11
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

    <div>
      <div class="sector-box">
        <monitor-sector-sector :sector="sectors"></monitor-sector-sector>
        <monitor-sector-sector :sector="sectors1"></monitor-sector-sector>
        <monitor-sector-sector :sector="sectors2"></monitor-sector-sector>
      </div>

      <div class="sector-box">
        <monitor-sector-sector :sector="sectors3"></monitor-sector-sector>
        <monitor-sector-sector :sector="sectors4"></monitor-sector-sector>
      </div>
    </div>
  </div>
</template>

<script>
import { TableListMixin } from "@/mixins/TableListMixin";
import { getMonitorData } from "@/api/subsystem/envir-monitoring/envir-monitoring.js";
import MonitorSectorSector from "@/components/Echarts/MonitorSectorSector";

export default {
  mixins: [TableListMixin],
  components: { MonitorSectorSector },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      sectors: {
        data: [
          { value: 47, name: "0-25" },
          { value: 33, name: "26-50" },
          { value: 11, name: "51-150" },
          { value: 5, name: "151-300" },
          { value: 4, name: "301以上" },
        ],
        width: "33%",
        height: "27em",
        title: "CO浓度",
        id: "MonitorSectorSector",
      },
      sectors1: {
        data: [
          { value: 41, name: "0-350" },
          { value: 35, name: "351-450" },
          { value: 10, name: "451-1000" },
          { value: 5, name: "1001-2000" },
          { value: 3, name: "2001-5000" },
          { value: 1, name: "5001以上" },
        ],
        width: "33%",
        height: "27em",
        title: "CO2浓度",
        id: "MonitorSectorSector1",
      },
      sectors2: {
        data: [
          { value: 35, name: "0-50" },
          { value: 34, name: "51-100" },
          { value: 20, name: "101-150" },
          { value: 8, name: "151-200" },
          { value: 20, name: "201-300" },
          { value: 16, name: "301以上" },
        ],
        width: "33%",
        height: "27em",
        title: "PM2.5浓度",
        id: "MonitorSectorSector2",
      },
      sectors3: {
        data: [
          { value: 22, name: "0℃以下" },
          { value: 19, name: "0-10" },
          { value: 28, name: "11-20" },
          { value: 31, name: "21-30" },
          { value: 1, name: "31-40" },
          { value: 20, name: "41℃以上" },
        ],
        width: "33%",
        height: "27em",
        title: "温度",
        id: "MonitorSectorSector3",
      },
      sectors4: {
        data: [
          { value: 30, name: "0-20%" },
          { value: 24, name: "21%-30%" },
          { value: 33, name: "31%-50%" },
          { value: 15, name: "51%-70%" },
          { value: 11, name: "71%-100%" },
        ],
        width: "33%",
        height: "27em",
        title: "湿度",
        id: "MonitorSectorSector4",
      },

      queryParams: {
        regionId: 0, // 区域id
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        // monitoringFactor: "",
        dateTime: [],
      },
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    // 获取数据
    // getList() {
    //   console.log("queryParams:", this.queryParams);
    // },
  },
  watch: {
    treeNode: {
      handler(newVal) {
        this.queryParams.regionId = newVal.regionId;
        // this.getList();
      },
    },
  },
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

.sector-box {
  display: flex;
  //   justify-content: space-between;
  align-items: center;
}
</style>
