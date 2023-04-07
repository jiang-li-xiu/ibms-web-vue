<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-27 10:32:02
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-24 08:45:47
-->
<template>
  <div class="devicedetail">
    <!-- 顶部详情 -->
    <el-header class="header">
      <el-row class="flex align-center w-100">
        <el-col :span="4"
          ><el-page-header @back="goBack"></el-page-header
        ></el-col>

        <el-col :span="4">设备名称：{{ deviceInfo.deviceName }}</el-col>
        <el-col :span="4">设备编码：{{ deviceInfo.deviceCode }}</el-col>
        <el-col :span="4">设备类型：{{ deviceInfo.deviceTypeName }}</el-col>

        <el-col :span="4" class="flex-row-cc">
          <div
            class="is-state"
            :class="deviceInfo.isStatus == 0 ? 'state' : 'unstate'"
          >
            {{ deviceInfo.isStatus == 0 ? "在线" : "离线" }}
          </div>
        </el-col>

        <el-col :span="4"
          ><div class="el-icon-refresh" @click="resetAll" title="更新全部"></div
        ></el-col>
      </el-row>
    </el-header>

    <!-- 主体部分 -->
    <div class="detail-container flex-1">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="设备信息" name="first">
          <device-massage
            :deviceDataLoading="deviceDataLoading"
            :deviceInfo="deviceInfo"
            :configurationList="deviceConfiguration"
            @getBasis="getBasis"
          ></device-massage>
        </el-tab-pane>

        <el-tab-pane label="运行状态" name="second">
          <running-state :deviceState="deviceState"></running-state>
        </el-tab-pane>
        <el-tab-pane label="物模型" name="third">
          <physical-model :modelData="modelData"></physical-model>
        </el-tab-pane>
        <el-tab-pane label="日志管理" name="fourth">
          <log-management :deviceId="deviceId"></log-management>
        </el-tab-pane>
        <!-- <el-tab-pane label="告警管理" name="fiveth">告警管理</el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import DeviceMassage from "./DeviceMassage.vue";
import RunningState from "./RunningState.vue";
import PhysicalModel from "./physical-model";
import LogManagement from "./LogManagement.vue";
import {
  getDeviceDetail,
  getDeviceDetailBasis,
  getDeviceThingModel,
} from "@/api/device/deviceInfo";

export default {
  name: "DeviceDetail",
  components: {
    DeviceMassage,
    RunningState,
    PhysicalModel,
    LogManagement,
  },
  data() {
    return {
      path: "",
      // 设备id
      deviceId: null,
      // tab默认展示第一个
      activeName: "first",
      // 设备信息-遮罩层
      deviceDataLoading: true,
      // 设备信息-对象
      deviceInfo: {},
      // 设备信息-其他数据
      deviceConfiguration: [],
      // 运行状态-设备状态
      deviceState: {},
      // 物模型-数据
      modelData: {},
      // 子系统字典
      managerLevel: [],
    };
  },

  activated() {
    this.getDictionaries("managerLevel", "manager_level");
    if (this.$route.params.deviceData !== undefined) {
      this.path = this.$route.params.deviceData.path;
      // 保存设备id
      this.deviceId = this.$route.params.deviceData.deviceId;
      // 头部数据展示
      this.topData = this.$route.params.deviceData;
    } else return;
    // 获取设备详情
    this.getDetail();
  },

  methods: {
    // 获取字典数据
    getDictionaries(key, value) {
      this.getDicts(value).then((response) => {
        let { code, data } = response;
        if (code == 200) {
          this[key] = data;
        }
      });
    },

    // 获取 物模型 数据
    getDeviceThingModel() {
      getDeviceThingModel(this.deviceId).then((response) => {
        console.log("物模型:", response);
        // response.data.events = response.data.events.forEach((item) => {
        //   console.log(item);
        //   console.log(
        //     "systemId:",
        //     this.selectDictLabel(this.managerLevel, item.eventType)
        //   );
        //   return item;
        // });
        this.modelData = response.data;
        // eventType
        // 设备配置
        this.deviceConfiguration = response.data.properties;
      });
    },

    getDetail() {
      this.deviceDataLoading = true;
      getDeviceDetail(this.deviceId).then((response) => {
        let data = response.data;
        console.log("设备基础信息:", data);
        // 设备基础信息
        this.deviceInfo = {
          deviceId: data.deviceId,
          deviceCode: data.deviceCode,
          deviceName: data.deviceName,
          deviceTypeName: data.deviceTypeName,
          deviceFactory: data.deviceFactory,
          deviceBrand: data.deviceBrand,
          updateTime: data.updateTime,
          registrationTime: data.registrationTime,
          lastOnlineTime: data.lastOnlineTime,
          ipAddress: data.ipAddress,
          connectionAgreement: data.connectionAgreement,
          remarks: data.remarks,
          // onlyIdentity: data.onlyIdentity,
          isStatus: data.isStatus,
        };
        this.getDeviceThingModel();
        // 运行状态
        this.deviceState = {
          isStatus: data.isStatus,
          updateTime: data.updateTime,
        };
        this.deviceDataLoading = false;
      });
    },

    goBack() {
      console.log(this.path);
      this.$router.push({ path: this.path });
    },

    handleClick(tab, event) {
      // console.log(tab, event);
    },

    resetAll() {
      this.activeName = "first";
      this.getDetail();
    },

    getBasis() {
      getDeviceDetailBasis(this.deviceId).then((response) => {
        console.log("getBasis", response);
        let data = response.data;
        this.deviceInfo = {
          deviceId: data.deviceId, //设备id
          deviceCode: data.deviceCode, //设备编码
          deviceName: data.deviceName, //设备名称
          deviceTypeName: data.deviceTypeName, //设备类型
          deviceFactory: data.deviceFactory, //设备厂家
          deviceBrand: data.deviceBrand, //设备品牌
          registrationTime: data.registrationTime, //注册时间
          lastOnlineTime: data.lastOnlineTime, //最后上线时间
          ipAddress: data.ipAddress, //ip地址
          connectionAgreement: data.connectionAgreement, //连接协议
          remarks: data.remarks, //备注
          // onlyIdentity: data.onlyIdentity, //设备编码
        };
      });
    },
  },
};
</script>
<style scoped lang="scss">
.devicedetail {
  height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    background-color: #fff;
    .el-icon-refresh {
      font-size: 24px;
      cursor: pointer;
      transition: 2s;
      float: right;
    }
    .el-icon-refresh:hover {
      transform: rotate(-360deg);
      color: #268bc8;
    }
  }

  .is-state {
    position: relative;
    padding-left: 20px;
  }
  .is-state::before {
    content: "";
    position: absolute;
    top: 30%;
    left: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #95f204;
  }
  .state::before {
    background-color: #95f204;
  }
  .unstate::before {
    background-color: #d9001b;
  }

  .detail-container {
    margin: 20px;
    padding: 20px;
    background-color: #fff;
  }
}
</style>
