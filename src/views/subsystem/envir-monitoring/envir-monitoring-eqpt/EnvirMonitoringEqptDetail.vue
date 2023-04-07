<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-15 15:46:25
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-25 15:43:07
-->
<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
    <div v-if="dialogTitle == '设备详情'">
      <div
        class="dialog-form"
        v-for="(item, index) in deviceDetailsData"
        :key="index"
      >
        <div class="dialog-form-left">{{ item.name }}</div>
        <div class="dialog-form-right">{{ item.value }}</div>
      </div>
    </div>
    <el-table
      v-else
      :data="monitorData"
      v-loading="loading"
      height="400"
      border
      style="width: 100%"
    >
      <el-table-column prop="deviceName" align="center" label="设备名称" />
      <el-table-column
        label="创建时间"
        align="center"
        width="180"
        fixed="left"
        prop="createTime"
      />
      <el-table-column label="CO浓度" align="center" prop="co" />
      <el-table-column label="PM2.5浓度" align="center" prop="co2" />
      <el-table-column label="温度" align="center" prop="temp" />
      <el-table-column label="湿度" align="center" prop="humi" />
      <el-table-column label="光照强度" align="center" prop="light" />
      <el-table-column label="负离子浓度" align="center" prop="ion" />
      <el-table-column label="噪音" align="center" prop="noise" />
      <el-table-column label="紫外线" align="center" prop="uv" />
      <el-table-column label="风向" align="center" prop="windDirection" />
      <el-table-column label="风速" align="center" prop="windSpeed" />
    </el-table>
  </el-dialog>
</template>
<script>
import { getEnvironmentData } from "@/api/subsystem/envir-monitoring/envir-monitoring.js";
export default {
  name: "EnvirMonitoringEqptDetail",
  components: {},
  props: {},
  data() {
    return {
      dialogVisible: false, // 弹框显示
      deviceDetailsData: [], // 设备详情数据
      dialogTitle: "设备详情", // 弹框标题
      loading: false,
      monitorData: [
        {
          name: "PM2.5采集器",
          num: "20ug/m³",
          time: "2021-09-15 20:06",
        },
        {
          name: "PM2.5采集器",
          num: "25ug/m³",
          time: "2021-09-15 20:06",
        },
      ], //监测数据
    };
  },
  created() {},
  methods: {
    equipment(row) {
      this.deviceDetailsData = [
        {
          name: "设备名称",
          value: row.deviceName,
        },
        {
          name: "设备类型ID",
          value: row.deviceTypeId,
        },
        {
          name: "连接协议",
          value: row.connectionAgreement,
        },
        {
          name: "设备状态",
          value: row.isStatus == 1 ? "在线" : "离线",
        },
        {
          name: "设备品牌",
          value: row.deviceBrand,
        },
        {
          name: "设备编码",
          value: row.deviceCode,
        },
        {
          name: "设备厂家",
          value: row.deviceFactory,
        },
      ];
      this.dialogVisible = true;
    },

    monitor(row) {
      this.loading = true;
      getEnvironmentData({ deviceCode: row.deviceCode }).then((response) => {
        this.monitorData = response.rows;
        this.loading = false;
      });
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
/* 弹框 */
.dialog-form {
  display: flex;
  div {
    flex: 1;
    border: 1px solid #bfbfbf;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-bottom: 0;
  }
  .dialog-form-left {
    background-color: #f2f2f2;
  }
}
.dialog-form:last-child {
  border-bottom: 1px solid #bfbfbf;
}
</style>
