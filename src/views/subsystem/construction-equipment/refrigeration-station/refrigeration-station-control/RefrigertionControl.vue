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
    :title="title"
    width="600px"
    :loading="spinning"
    append-to-body
  >
    <!-- 开关 -->
    <div class="flex-row-csb mb-10" v-if="controlMsg['C_开关'] != undefined">
      <div>设备开关</div>
      <el-switch
        v-model="controlMsg['C_开关']"
        active-value="1"
        inactive-value="0"
        active-color="#13ce66"
        @change="handelControl($event,'C')"
      >
      </el-switch>
    </div>
    <!-- 室外/新风风阀调整 -->
    <div class="flex-row-csb mb-10" v-else-if="controlMsg['VSD-C_变频调节'] != undefined">
      <div>室外/新风风阀调整</div>
      <el-input-number
        v-model="controlMsg['VSD-C_变频调节']"
        :step="1"
        :disabled="controlMsg['C_开关'] == 0"
        step-strictly
        @change="handelControl($event,'VSD-C')"
      ></el-input-number>
    </div>
    <el-empty description="无操作项" v-else></el-empty>
  </el-dialog>
</template>

<script>
import {
  getEquipmentDetails,
  postControl,
} from "@/api/subsystem/construction-equipment/refrigeration-station/RefrigerationStation";

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
    open(id) {
      this.deviceCodeId = id
      this.getEquipmentDetails(id);
      this.visible = true;
    },
    getEquipmentDetails(id) {
      this.spinning = true;
      getEquipmentDetails({ deviceCode: id }).then((response) => {
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
          this.getEquipmentDetails(this.deviceCodeId);
          this.$message.success('操作成功')
        })
    },
  },
};
</script>
<style scoped lang='scss' >
</style>