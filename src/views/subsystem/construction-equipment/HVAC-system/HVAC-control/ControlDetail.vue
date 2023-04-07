<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-04-11 16:58:12
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-12 10:10:27
-->
<template>
  <el-dialog
    :visible.sync="visible"
    title="控制面板"
    width="600px"
    :loading="spinning"
    append-to-body
  >
    <!-- 新风机开关 -->
    <div class="flex-row-csb mb-20" v-if="controlMsg['开关']">
      <div>设备开关</div>
      <el-switch
        v-model="controlMsg['开关']"
        active-value="1"
        inactive-value="0"
        active-color="#13ce66"
        @change="handelControl($event,'OnOff-C')"
      >
      </el-switch>
    </div>
    <!-- 温度设定 -->
    <div class="flex-row-csb mb-20" v-if="controlMsg['温度设定']" >
      <div>温度设定</div>
      <el-input-number
        v-model="controlMsg['温度设定']"
        :step="1"
        :disabled="controlMsg['开关'] == 0"
        step-strictly
        :min="18"
        :max="30"
        @change="handelControl($event,'TSP-C')"
      ></el-input-number>
    </div>
    <!-- 工作模式 -->
    <div class="flex-row-csb mb-20" v-if="controlMsg['工作模式']">
      <div>工作模式</div>
      <el-radio-group v-model="controlMsg['工作模式']" @change="handelControl($event,'WorkMode-C')" :disabled="controlMsg['开关'] == 0">
        <el-radio label="1.0">制冷</el-radio>
        <el-radio label="2.0">送风</el-radio>
        <el-radio label="3.0">制热</el-radio>
      </el-radio-group>
    </div>
    <!-- 风速命令 -->
    <div class="flex-row-csb mb-20" v-if="controlMsg['风速命令']">
      <div>风速命令</div>
      <el-radio-group v-model="controlMsg['风速命令']" @change="handelControl($event,'Speed-C')" :disabled="controlMsg['开关'] == 0">
        <el-radio label="1.0">低速</el-radio>
        <el-radio label="2.0">中速</el-radio>
        <el-radio label="3.0">高速</el-radio>
        <el-radio label="4.0">自动</el-radio>
      </el-radio-group>
    </div>
  </el-dialog>
</template>

<script>
import {
  getDetail,
  postControl
} from "@/api/subsystem/construction-equipment/HVAC-system/HVACControl.js";

export default {
  name: "RefrigertionControl",
  props: {},
  data() {
    return {
      // 控制弹窗显隐
      visible: false,
      //   弹窗标题
      title: "设备控制",
      //   详情加载动画
      spinning: false,
      //   详情数据
      controlMsg: {},
      //   禁用控制
      disabled: false,
      deviceCodeId: "",
    };
  },
  methods: {
    //   打开弹窗获取详情
    edit(row) {
      this.getDetail(row.deviceCode);
      this.deviceCodeId = row.deviceCode
      this.visible = true;
    },
    getDetail(deviceCode) {
      this.spinning = true;
      getDetail({ deviceCode: deviceCode }).then((response) => {
        this.controlMsg = response.data.controlMsg;
        this.spinning = false;
      });
    },
    // 控制设备
    handelControl(value, controlType) {
      let data = {
        deviceCode: this.deviceCodeId,
        controlType: controlType,
        value: Number(value),
      };
      postControl(data)
        .then((response) => {   
          this.getDetail(this.deviceCodeId);
          this.$message.success('操作成功')
        })
    },
  },
};
</script>
<style scoped lang='scss' >
</style>