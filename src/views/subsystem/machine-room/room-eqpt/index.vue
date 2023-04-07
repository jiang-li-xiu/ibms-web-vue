<template>
  <div class="app-container assembly-container">
    <!-- 设备列表 -->
    <div class="list">
      <el-row :gutter="20">
        <el-col :span="8" v-for="item in tableData" :key="item.id">
          <div class="item">
            <el-tooltip
              class="item"
              effect="dark"
              content="详情"
              placement="right"
            >
              <div class="icon" @click="deviceInfoDetail(item)">
                <img :src="getIconByName(item.equipmentName)" alt="">
              </div>
            </el-tooltip>
            <div class="name">{{ item.equipmentName }}</div>
            <!-- <div class="info">{{ item.info }}</div> -->
          </div>
        </el-col>
      </el-row>
      <!-- 
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :xl="5">
          <div class="item">
            <div class="icon">
              <em class="el-icon-lock"></em>
            </div>
            <div class="name">供配电</div>
            <div class="info">正常</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :xl="4">
          <div class="item">
            <div class="icon">
              <em class="el-icon-lock"></em>
            </div>
            <div class="name">精密空调</div>
            <div class="info abnormal-color">空调模块断线</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :xl="5">
          <div class="item">
            <div class="icon">
              <em class="el-icon-lock"></em>
            </div>
            <div class="name">视频</div>
            <div class="info">视频正常</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :xl="5">
          <div class="item">
            <div class="icon">
              <em class="el-icon-lock"></em>
            </div>
            <div class="name">门禁</div>
            <div class="info">门禁正常</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :xl="5">
          <div class="item">
            <div class="icon">
              <em class="el-icon-lock"></em>
            </div>
            <div class="name">漏水</div>
            <div class="info">漏水正常</div>
          </div>
        </el-col>
      </el-row> -->
    </div>
    <el-dialog
      title="设备属性详情"
      :visible.sync="dialogTableVisible"
      width="30%"
    >
      <div class="title-value-box" v-if="Object.keys(detailData).length != 0">
        <div
          class="title-value-item"
          v-for="(value, key) in detailData"
          :key="key"
        >
          <div class="title-box">{{ key }}</div>
          <div class="value-box">{{ value }}</div>
        </div>
      </div>
      <el-empty v-else :image-size="50" description="无设备属性"></el-empty>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceInfoList } from "@/api/subsystem/machine-room";
export default {
  components: {},
  data() {
    return {
      dialogTableVisible: false,
      //table数据
      tableData: [],
      detailData: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //table数据请求
    getList() {
      getDeviceInfoList().then((response) => {
        this.tableData = response.data;
        console.log(this.tableData);
      });
    },
    deviceInfoDetail(item) {
      console.log(item.attr);
      this.dialogTableVisible = true;
      this.detailData = item.attr;
    },

    // 获取对应图标
    getIconByName(name) {
      const [target] = [
        "温湿度",
        "列头柜",
        "配电柜",
        "空调",
        "UPS",
        "环境采集器",
      ].filter((item) => name.indexOf(item) != -1);
      switch (target) {
        case "温湿度":
          return require("@/assets/images/machineRoom/humiture.png");
        case "列头柜":
          return require("@/assets/images/machineRoom/tank.png");
        case "配电柜":
          return require("@/assets/images/machineRoom/power.png");
        case "空调":
          return require("@/assets/images/machineRoom/air_conditioner.png");
        case "UPS":
          return require("@/assets/images/machineRoom/UPS.png");
        case "环境采集器":
          return require("@/assets/images/machineRoom/environmental_collector.png");
        default:
          return ''
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.assembly-container {
  background-color: #eee;
  height: calc(100vh - 84px);
}

.list {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.item {
  height: 200px;
  background-color: #fff;
  font-size: 15px;
  padding: 25px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  align-items: center;

  //
  .icon {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 1px solid #949494;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    color: #1296db;
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  .name {
    font-weight: 600;
    font-size: 18px;
  }

  .info {
    color: #70b603;
  }
}

.abnormal-color {
  color: #a30014 !important;
}

.title-value-item {
  display: flex;
}

.title-value-item:first-child {
  border-top: 1px solid #777;
}

.title-value-item > div {
  padding: 0.3em 0;
  border-bottom: 1px solid #777;
  border-left: 1px solid #777;
}

.title-box {
  background-color: #eee;
  text-align: center;
  flex: 1;
}

.value-box {
  text-align: center;
  flex: 2;
  border-right: 1px solid #777;
}
</style>
