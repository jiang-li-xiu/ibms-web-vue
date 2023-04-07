<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 11:25:32
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-21 09:23:26
-->
<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" @close="close" width="800px">
      <el-form
        :model="modelForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="新密码" prop="pwd">
              <el-input
                v-model="modelForm.pwd"
                placeholder="请输入新密码"
                size="small"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="submitForm">
          {{ loading ? "提交中..." : "确 定" }}
        </el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { changePassword } from "@/api/subsystem/door-lock-management-system/personnelInformationManagement.js";
export default {
  data() {
    return {
      // 显示弹窗
      open: false,
      loading: false,
      // 标题
      title: "修改密码",
      // 表单
      modelForm: {
        pwd: "", //密码
        deviceCode: "",
      },
      // 校验
      rules: {
        pwd: [{ required: true, message: "请输入密码" }],
        // phone: [
        //   {
        //     pattern: /^[1][3,4,5,7,8][0-9]{9}$/, // 正则
        //     message: "请输入正确的手机号码",
        //   },
        //   { required: true, message: "请输入手机号码" },
        // ],
      },
    };
  },
  methods: {
    // 关闭弹窗
    close() {
      this.open = false;
      // 清空表单
      this.modelForm = {};
      // 清空表单校验
      this.$refs["ruleForm"].resetFields();
    },

    // 打开
    edit(row) {
      this.open = true;
      this.modelForm.deviceCode = row.deviceCode
    },

    // 提交
    submitForm() {
      console.log(this.modelForm);
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          changePassword(this.modelForm).then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.$emit("refresh");
              this.close();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style></style>
