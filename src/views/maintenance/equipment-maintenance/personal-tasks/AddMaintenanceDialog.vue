<!--
 * @Author: RobertFan
 * @Date: 2022-06-07 11:05:39
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-06-20 13:50:14
 * @Description: 
-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="500px"
      append-to-body
      @close="closeDialog"
    >
      <el-form
        ref="configForm"
        label-width="90px"
        :model="modelForm"
        :rules="rules"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item label="维保日期:" prop="maintenanceTime">
              <!-- <el-input v-model="modelForm.date" placeholder="请输入维保日期" /> -->
              <el-date-picker
                v-model="modelForm.maintenanceTime"
                type="date"
                placeholder="请选择维保日期"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="维保结果:" prop="maintenanceResult">
              <el-input
                v-model="modelForm.maintenanceResult"
                placeholder="请输入维保结果"
              />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="主键id:" prop="taskId" v-show="false">
              <el-input v-model="modelForm.taskId" placeholder="主键id" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注:" prop="remark">
              <el-input
                type="textarea"
                :rows="4"
                v-model="modelForm.remark"
                placeholder="备注内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="submitForm">
          保存
        </el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addMaintenanceList } from "@/api/maintenance/personalTasks";
export default {
  data() {
    return {
      // 标题
      title: "维保任务",
      // 对话框显示
      visible: false,
      // 是否加载
      loading: false,
      // 列表數據
      modelForm: {
        taskId: "",
        maintenanceResult: "",
        maintenanceTime: "",
        remark: "",
      },
      rules: {
        maintenanceTime: [
          { required: true, message: "维保日期不能为空", trigger: "blur" },
        ],
        maintenanceResult: [
          { required: true, message: "维保结果不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /** 点击新增触发 */
    add(id) {
      this.modelForm.taskId = id;
      this.visible = true;
    },

    /**  確定按鈕 */
    submitForm() {
      this.$refs["configForm"].validate((valid) => {
        // console.log(valid);
        if (valid) {
          addMaintenanceList(this.modelForm)
            .then((response) => {
              if (response.code == 200) {
                console.log(response);
                this.$message.success("维保状态已改变");
                this.$emit("ok");
                this.visible = false;
              }else{
                this.$message.error("维保状态没有发生变化");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    /**  取消按鈕 */
    cancel() {
      this.$refs.configForm.resetFields();
      this.visible = false;
    },
    /**  點擊空白處取消對話框 */
    closeDialog() {
      this.$refs.configForm.resetFields();
    },
  },
};
</script>

<style></style>
