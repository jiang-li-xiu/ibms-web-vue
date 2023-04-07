<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-04-15 14:34:04
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-15 15:55:39
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="30%"
    :loading="spinning"
    append-to-body
  >
    <el-form :model="formData" :rules="rules" ref="refForm" label-width="100px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确认</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getAccount,
  postSaveOrUpdate,
} from "@/api/subsystem/visual-intercom/visitorsEqpt";
export default {
  name: "HelloWorld",
  props: {},
  data() {
    return {
      // 弹窗标题
      title: "批量录入",
      // 控制弹窗显隐
      visible: false,
      // 表单参数
      formData: {},
      // 表单验证
      rules: {
        username: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur",
          },
          {
            min: 5,
            max: 30,
            message: "长度在5到30个字符",
            trigger: "change",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 5,
            max: 30,
            message: "长度在5到30个字符",
            trigger: "change",
          },
        ],
      },
      //   弹窗数据加载动画
      spinning: false,
    };
  },
  methods: {
    //   批量录入
    add(deviceCodes) {
      this.refresh()
      this.formData.deviceCode = deviceCodes;
      this.visible = true;
      // console.log(this.formData);
    },
    //   重置表单
    refresh() {
      this.formData = {
        username: undefined,
        password: undefined,
      };
    },
    // 编辑账号密码
    edit(record) {
      this.spinning = true;
      getAccount({ deviceCode: record.deviceCode }).then((response) => {
        console.log(response);
        this.formData = { ...response.data };
        this.spinning = false;
      });
      this.visible = true;
    },
    // 提交
    handleSubmit() {
      let that = this;
      that.$refs["refForm"].validate((valid) => {
        if (valid) {
          let { deviceCode, username, password } = that.formData;
          let data = new FormData();
          data.append("deviceCodes", deviceCode);
          data.append("username", username);
          data.append("password", password);
          postSaveOrUpdate(data).then((response) => {
            that.msgSuccess(response.message);
            that.visible = false;
            that.$emit("ok");
          });
        }
      });
    },
  },
};
</script>
<style scoped lang='scss' >
</style>