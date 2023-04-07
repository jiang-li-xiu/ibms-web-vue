<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 15:00:14
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-15 15:20:55
-->
<template>
  <el-dialog :title="title" :visible.sync="open" @close="close" width="800px">
    <el-form
      :model="modelForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
    >
      <el-row>
        <el-col :span="20">
          <el-form-item label="网关地址" prop="address">
            <el-input
              v-model="modelForm.address"
              placeholder="请输入网关地址"
              size="small"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="网关码" prop="code">
            <el-input
              v-model="modelForm.code"
              placeholder="请输入网关码"
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
</template>

<script>
export default {
  data() {
    return {
      // 标题
      title: "设置",
      // 显示弹窗
      open: false,
      loading: false,
      // 表单
      modelForm: {
        address: "",
        code: "",
      },
      rules: {},
    };
  },
  methods: {
    // 关闭弹窗
    close() {
      this.open = false;
    },

    // 打开弹窗
    openSet(row) {
      this.open = true;
    },

    // 提交
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          // 发起请求
          // addVehicle(this.modelForm).then((res) => {
          //   if (res.code == 200) {
          //     this.$message.success(res.msg);
          //     this.$emit("refresh");
          //     this.close();
          //   } else {
          //     this.$message.error(res.msg);
          //   }
          // });
        }
      });
    },
  },
};
</script>

<style></style>
