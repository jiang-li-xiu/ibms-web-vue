:
<!--
 * @Descripttion:
 * @Author: PengXuanwei
 * @Date: 2021-07-26 11:05:00
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-06 14:52:14
-->
<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12" :xl="12">
        <div class="chart-wrapper">
          <!-- 设备在线情况 -->
          <equipment-online :dataObj="onlineData"></equipment-online>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="12" :xl="12">
        <div class="chart-wrapper">
          <!-- 当月设备告警量 -->
          <alarm-number
            :dataObj="alarmData"
            @alarmNumber="alarmNumbers"
          ></alarm-number>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="24" :xl="24">
        <!-- 子系统便捷导航 -->
        <shortcut-button :systemLoading="loading" :routerList="routerList"></shortcut-button>
      </el-col>
    </el-row>
    <!-- 联动控制台 -->
    <!-- 联动记录 -->
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="16" :xl="16">
        <linkagec-console :dataList="dataListManuls"></linkagec-console>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8" :xl="8">
        <linkage-record></linkage-record>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getDeviceDeviceinfoListCount,
  getLinkConfigV1GetManuals,
  getDeviceAlarmHistoryCount,
  getSubsystemConvenientNavigation,
} from "@/api/index";

import EquipmentOnline from "./dashboard/EquipmentOnline";
import AlarmNumber from "./dashboard/AlarmNumber";
import ShortcutButton from "./dashboard/ShortcutButton";
import LinkagecConsole from "./dashboard/LinkagecConsole";
import LinkageRecord from "./dashboard/LinkageRecord";
export default {
  name: "Index",
  components: {
    EquipmentOnline,
    AlarmNumber,
    ShortcutButton,
    LinkagecConsole,
    LinkageRecord,
  },
  data() {
    return {
      loading: false,
      onlineData: {
        online: 1,
        unline: 1,
        total: 2,
        percent: 50,
      },
      alarmData: {
        total: 0,
        value: [],
        label: [],
      },

      queryManuls: {
        pageNum: 1,
        pageSize: 500,
      },
      totalPageManuls: 0,
      dataListManuls: [],
      routerList: [],
    };
  },

  created() {
    // 设备在线情况
    this.getDeviceDeviceinfoListCounts();
    // 联动控制台
    this.getLinkConfigV1GetManualsS(0);
    // 当月设备告警量
    this.alarmNumbers({ dateMoth: this.parseTime(new Date(), "{y}-{m}") });
    // this.alarmNumbers({ dateMoth: "2021-09" });
    this.msg = "刷新";
    // 子系统便捷导航
    this.getConvenientNavigation();
  },

  methods: {
    // 获取子系统便捷导航数据
    getConvenientNavigation() {
      this.loading = true;

      getSubsystemConvenientNavigation()
        .then((response) => {
          console.log(response);
          this.routerList = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 获取 联动控制台 数据
    getLinkConfigV1GetManualsS(type) {
      getLinkConfigV1GetManuals(this.queryManuls).then((response) => {
        let { total, rows } = response;
        if (type == 0) {
          this.totalPageManuls = Math.ceil(total / this.queryManuls.pageSize);

          for (let i = 0; i < this.totalPageManuls; i++) {
            this.queryManuls.pageNum = i + 1;
            this.getLinkConfigV1GetManualsS(1);
          }
        } else {
          this.dataListManuls = this.dataListManuls.concat(rows);
        }
      });
    },

    // 获取 设备在线情况 的数据
    getDeviceDeviceinfoListCounts() {
      getDeviceDeviceinfoListCount().then((response) => {
        let { allCount, noOnlineCount, onlineCount } = response.data;
        if (allCount == 0) return false;
        this.onlineData = {
          online: onlineCount,
          unline: noOnlineCount,
          total: allCount,
          percent: onlineCount / allCount,
        };
      });
    },

    // 获取 当月设备告警量
    alarmNumbers({ dateMoth }) {
      getDeviceAlarmHistoryCount(dateMoth).then((response) => {
        let { data } = response;
        // console.log("当月设备告警量:", data);
        // console.log("当月设备告警量:", response);
        this.alarmData = {
          total: 0,
          value: [],
          label: [],
        };
        data.forEach((item) => {
          this.alarmData.total = this.alarmData.total + item.value;
          this.alarmData.value.push(item.value);
          this.alarmData.label.push(item.dates);
        });
        console.log("alarmData:", this.alarmData);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  min-height: calc(100vh - 84px);
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
