<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-29 09:17:58
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-09-29 10:50:14
-->
<template>
  <div>
    <el-steps :active="active" finish-status="success" :space="90" simple>
      <el-step title="触发条件"></el-step>
      <el-step title="消息通知"></el-step>
      <el-step title="告警预案"></el-step>
      <el-step title="完成配置"></el-step>
    </el-steps>
    <div class="dialog-content">
      <!-- <el-scrollbar> -->
      <el-form :inline="true" :model="templateData" label-width="68px">
        <el-form-item label="告警名称" prop="alarmName">
          <el-input
            v-model="templateData.alarmName"
            placeholder="请输入设备名称"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="告警等级" prop="alarmLevel">
          <el-select
            v-model="templateData.alarmLevel"
            placeholder="请选择告警等级"
            :rules="rules.alarmLevel"
            size="small"
          >
            <el-option
              v-for="items in managerLevel"
              :key="items.dictValue"
              :label="items.dictLabel"
              v-model="items.dictValue"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div v-show="active == 0">触发条件</div>
      <div v-show="active == 1">消息通知</div>
      <div v-show="active == 2">告警预案</div>
      <div v-show="active == 3">完成配置</div>
      <!-- </el-scrollbar> -->
    </div>
    <!-- 底部按钮 -->
    <div class="step-button">
      <el-button @click="backStep">上一步</el-button>
      <el-button type="primary" @click="nextStep">{{
        active == 3 ? "完成" : "下一步"
      }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      managerLevel: [], // 字典 告警等级
      templateData: {
        alarmName: "",
        alarmLevel: "", //
      }, //告警配置
      // 验证
      rules: {
        alarmName: [
          { required: true, message: "请输入告警名称", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        alarmLevel: [
          { required: true, message: "请选择告警等级", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getDictionaries("managerLevel", "manager_level");
  },
  methods: {
    // 获取字典数据
    getDictionaries(key, value) {
      this.getDicts(value).then((response) => {
        this[key] = response.data;
      });
    },
    //下一步
    nextStep() {
      if (this.active <= 2) {
        this.active++;
      }
    },
    //上一步
    backStep() {
      if (this.active >= 1) {
        this.active--;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
/* .dialog-conten::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}
.dialog-conten::-webkit-scrollbar-thumb {
  background-color: #409eff;
  border-radius: 10px;
} */
.dialog-content {
  height: 500px;
  padding-top: 10px;
}
/* 底部按钮 */
.step-button {
  display: flex;
  justify-content: flex-end;
}
.el-scrollbar {
  height: 100%;
}
.el-scrollbar__wrap {
  overflow: scroll;
  width: 110%;
  height: 120%;
}
</style>