<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 11:25:32
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-16 17:13:01
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
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="modelForm.name"
                placeholder="请输入姓名"
                size="small"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="门禁卡号" prop="cardNo">
              <el-input
                v-model="modelForm.cardNo"
                placeholder="请输入门禁卡号"
                size="small"
                :disabled="disableSubmit"
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
import {
  addPersonnlInfo,
  editPersonnlInfo,
} from "@/api/subsystem/door-lock-management-system/personnelInformationManagement.js";
export default {
  data() {
    return {
      // 显示弹窗
      open: false,
      loading: false,
      //控制可编辑
      disableSubmit: false,
      // 标题
      title: "新增人员",
      // 当前模式 0新增 1编辑
      type: 0,
      // 表单
      modelForm: {
        name: "",
        cardNo: "",
        // phone: "",
        // company: "",
      },
      // 校验
      rules: {
        name: [{ required: true, message: "请输入姓名" }],
        sex: [{ required: true, message: "请选择性别" }],
        phone: [
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/, // 正则
            message: "请输入正确的手机号码",
          },
          { required: true, message: "请输入手机号码" },
        ],
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

    // 新增
    add() {
      this.open = true;
      this.type = 0;
    },

    // 编辑
    edit(record) {
      this.open = true;
      this.type = 1;
      this.modelForm = { ...record };
    },

    // 提交
    submitForm() {
      console.log(this.modelForm);
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            addPersonnlInfo(this.modelForm).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg);
                this.$emit("refresh");
                this.close();
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            editPersonnlInfo(this.modelForm).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg);
                this.$emit("refresh");
              } else {
                this.$message.error(res.msg);
              }
              this.close();
            });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style></style>
