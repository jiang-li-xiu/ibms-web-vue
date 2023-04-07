<!--
 * @Author: RobertFan
 * @Date: 2022-06-06 15:17:35
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-06-22 16:05:58
 * @Description: 
-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="650px"
      append-to-body
      @close="closeDialog"
    >
      <el-form ref="configForm" :model="modelForm" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查项目" prop="inspectProject">
              <el-input
                v-model="modelForm.inspectProject"
                placeholder="请输入检查项目名称"
                :disabled="disableSubmit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="步骤指导" prop="stepGuidance">
              <el-input
                type="textarea"
                :rows="4"
                v-model="modelForm.stepGuidance"
                placeholder="请输入步骤指导"
                :disabled="disableSubmit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                :rows="4"
                v-model="modelForm.remark"
                placeholder="请写下备注"
                :disabled="disableSubmit"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!disableSubmit">
        <el-button type="primary" :loading="loading" @click="submitForm">
          保存
        </el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addList,
  editList,
  getDetails,
} from "@/api/maintenance/maintenanceItems";
export default {
  data() {
    return {
      // 弹出层标题
      title: "添加维保项目",
      // 是否显示弹出层
      visible: false,
      // 弹窗是否加载
      loading: false,
      // 表单数据
      modelForm: {
        maintenanceId: "",
        inspectProject: "",
        stepGuidance: "",
        remark: "",
      },
      // 表单效验
      rules: {
        inspectProject: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        stepGuidance: [
          { required: true, message: "步骤指导不能为空", trigger: "blur" },
        ],
      },
      disableSubmit: false,
    };
  },
  methods: {
    /** 点击新增触发 */
    add() {
      this.refresh();
      this.visible = true;
    },

    /** 触发编辑功能 */
    edit(record) {
      // console.log(record);
      this.loading = true;
      getDetails(record.maintenanceId).then((response) => {
        this.modelForm = { ...response.data };
        this.loading = false;
      });
      this.visible = true;
    },

    /** 重置表单 */
    refresh() {
      this.modelForm = {
        inspectProject: "",
        stepGuidance: "",
        remark: "",
      };
    },

    // 取消按钮
    // cancel() {
    //   this.$refs.configForm.resetFields();
    //   this.visible = false;
    // },

    // 确定提交按钮
    submitForm() {
      // let that = this;
      this.$refs["configForm"].validate((valid) => {
        console.log(valid);
        if (valid) {
          let func, msg;
          if (this.modelForm.maintenanceId) {
            func = editList(this.modelForm);
            msg = "编辑成功";
          } else {
            func = addList(this.modelForm);
            msg = "添加成功";
          }
          func.then((response) => {
            console.log(response);
            this.msgSuccess(msg);
            this.$emit("ok");
            this.visible = false;
          });
        }
      });
      // this.visible = false
    },

    closeDialog() {
      this.$refs.configForm.resetFields();
    },
  },
};
</script>

<style></style>
