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
    <!-- 新风机开关 -->
    <div class="flex-row-csb mb-10" v-if="controlMsg['C_开关']">
      <div>设备开关</div>
      <el-switch
        v-model="controlMsg['C_开关']"
        active-value="1"
        inactive-value="0"
        active-color="#13ce66"
        @change="handelControl('C', controlMsg['C_开关'])"
      >
      </el-switch>
    </div>
    <!-- 冷热水阀开关 -->
    <div class="flex-row-csb mb-10" v-if="controlMsg['VLV-C_冷/热水阀开关']">
      <div>冷热水阀开关</div>
      <el-switch
        v-model="controlMsg['VLV-C_冷/热水阀开关']"
        active-value="1"
        inactive-value="0"
        active-color="#13ce66"
        :disabled="disabled"
        @change="handelControl('VLV-C', controlMsg['VLV-C_冷/热水阀开关'])"
      >
      </el-switch>
    </div>
    <!-- 回风风阀调整 -->
    <div class="flex-row-csb mb-10" v-if="controlMsg['RAD-C_回风风阀调整']">
      <div>回风风阀调整</div>
      <el-input-number
        v-model="controlMsg['RAD-C_回风风阀调整']"
        :step="10"
        :disabled="disabled"
        step-strictly
        @change="handelControl('RAD-C', controlMsg['RAD-C_回风风阀调整'])"
      ></el-input-number>
    </div>
    <!-- 室外/新风风阀调整 -->
    <div class="flex-row-csb mb-10" v-if="controlMsg['OAD-C_室外/新风阀调整']">
      <div>室外/新风风阀调整</div>
      <el-input-number
        v-model="controlMsg['OAD-C_室外/新风阀调整']"
        :step="10"
        :disabled="disabled"
        step-strictly
        @change="handelControl('OAD-C', controlMsg['OAD-C_室外/新风阀调整'])"
      ></el-input-number>
    </div>
    <!-- 送风机开关 -->
    <div class="flex-row-csb mb-10" v-if="controlMsg['SF-C_送风机开关']">
      <div>送风机开关</div>
      <el-switch
        v-model="controlMsg['SF-C_送风机开关']"
        active-value="1"
        inactive-value="0"
        active-color="#13ce66"
        :disabled="disabled"
        @change="handelControl('SF-C', controlMsg['SF-C_送风机开关'])"
      >
      </el-switch>
    </div>
  </el-dialog>
</template>

<script>
import {
  getLisDetail,
  postControl,
} from "@/api/subsystem/construction-equipment/new-fan/new-fan-equipment";

export default {
  name: "NewFanDetail",
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
      this.getLisDetail(id);
    },
    getLisDetail(id) {
      this.deviceCodeId = id
      this.spinning = true;
      getLisDetail({ deviceCode: id }).then((response) => {
        this.controlMsg = response.data.controlMsg;
        if (this.controlMsg["C_开关"] == 0) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
        if (JSON.stringify(this.controlMsg) == "{}") {
          this.$message("暂无控制开关");
        } else {
          this.visible = true;
        }
        this.spinning = false;
      });
    },
    // 控制设备
    handelControl(controlType, value) {
      let data = {
        deviceCode: this.deviceCodeId,
        controlType: controlType,
        value: value,
      };
      postControl(data)
        .then((response) => {
          this.controlMsg["C_开关"] = response.data;
          this.$emit('ok')
          this.getLisDetail(this.deviceCodeId);
        })
        .catch((err) => {
          this.getLisDetail(this.deviceCodeId);
        });
    },
  },
};
</script>
<style scoped lang='scss' >
</style>