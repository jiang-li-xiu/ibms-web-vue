<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 11:25:32
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-22 11:15:38
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
            <el-form-item label="卡号" prop="card">
              <el-input
                v-model="modelForm.card"
                placeholder="请输入卡号"
                size="small"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备id" prop="uid">
              <el-input
                v-model="modelForm.uid"
                placeholder="请选择"
                size="small"
                disabled
              >
                <el-button
                  @click="selectEquimentId(modelForm.uid)"
                  type="primary"
                  slot="append"
                  >请选择
                </el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="持卡人名字" prop="personName">
              <el-input
                v-model="modelForm.personName"
                placeholder="请输入持卡人名字"
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

    <!-- 选择uid -->
    <select-uid-dialog
      ref="selectEquimentUid"
      @setSelectUid="SelectUid"
      listUrl="/base/proprietor?isHik=1"
      modalTitle="选择设备"
    />
  </div>
</template>

<script>
import {
  addSmart,
  getEquimentList,
} from "@/api/subsystem/smart-card-management/smartCardApplication.js";
import SelectUidDialog from "./SelectUidDialog";
export default {
  components: { SelectUidDialog },
  data() {
    return {
      // 显示弹窗
      open: false,
      loading: false,
      //控制可编辑
      disableSubmit: false,
      // 标题
      title: "添加权限",
      // 当前模式 0新增 1编辑
      type: 0,
      // 表单
      modelForm: {
        card: "", //	卡号
        uid: "", // 设备的uid
        personName: "", //持有人名字
      },
      // 校验
      rules: {
        card: [{ required: true, message: "请输入卡号" }],
        // uid: [{ required: true, message: "请选择设备id" }],
        personName: [{ required: true, message: "请输入持卡人姓名" }],
      },
      // 设备id列表
      equipmentList: [],
      row: [],
      selected: [],
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
      // 清空选择的数据
      this.row = [];
      this.selected = [];
    },

    // 新增
    add() {
      this.open = true;
    },

    //打开选择uid弹窗
    selectEquimentId() {
      this.$refs.selectEquimentUid.open(this.selected, this.row);
      // console.log(this.selected, this.row);
    },

    // 接收传递过来选中的uid
    SelectUid(selected, row) {
      // console.log(selected, row);
      this.row = row;
      this.selected = selected;
      this.$set(
        this.modelForm,
        "uid",
        row.map((item) => item.deviceCode)
      );
      this.$refs.ruleForm.clearValidate("uid");
      this.modelForm.uid = row.map((item) => item.deviceCode);
    },

    // 提交
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.modelForm.uid = this.modelForm.uid.toString();
          addSmart(this.modelForm).then((res) => {
            if (res.code == 200) {
              this.$message.success("添加成功");
              this.$emit("refresh");
              this.close();
            } else {
              this.$message.error("添加失败");
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
