<!--
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-08-06 17:07:04
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-29 11:36:17
-->
<template>
  <div>
    <el-dialog
      title="消息发送"
      :visible.sync="dialogOpen"
      width="780px"
      append-to-body
      @closed="closedDialog"
    >
      <el-form
        ref="notifyConfigForm"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="通知模板" prop="template">
              <el-select
                v-model="form.template"
                style="width: 100%"
                placeholder="请选择"
                @change="templateChange"
              >
                <el-option
                  v-for="(template, i) in templateOptions"
                  :key="i"
                  :label="template.name"
                  :value="template.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="fieldsMetadata.length > 0">
            <el-col v-for="(fields, i) in fieldsMetadata" :key="i" :span="24">
              <el-form-item :label="fields" :prop="'variableFields.' + fields">
                <el-input v-model.trim="form.variableFields[fields]" />
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          icon="el-icon-message"
          type="primary"
          :loading="loading"
          @click="submitForm"
        >
          {{ loading ? "发送中..." : "发 送" }}
        </el-button>
        <el-button @click="dialogOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findListByTypeAndService } from "@/api/system/template";
import { getVariableFields, send } from "@/api/system/notify";

export default {
  name: "notifierSend",
  created() {},
  data() {
    return {
      loading: false,
      dialogOpen: false,
      templateOptions: [],
      form: {
        configId: undefined,
        templateId: undefined,
        template: undefined,
        variableFields: {},
      },
      rules: {
        template: [
          { required: true, message: "配置模板不能为空", trigger: "change" },
        ],
      },
      fieldsMetadata: [],
    };
  },
  methods: {
    init(data) {
      this.dialogOpen = true;
      const { id, type, serviceProvider } = data;
      this.form.configId = id;

      this.$nextTick(() => {
        this.$refs["notifyConfigForm"].resetFields();

        findListByTypeAndService(type, serviceProvider).then((res) => {
          this.templateOptions = res.data;
        });
      });
    },
    templateChange(value) {
      this.form.templateId = value;

      getVariableFields(value).then((res) => {
        this.fieldsMetadata = res.data;
        this.setForm(this.fieldsMetadata);
      });
    },
    setForm(list) {
      let data = {};
      for (const iterator of list) {
        this.$set(data, iterator, undefined);
      }
      Object.assign(this.form, { variableFields: data });
    },
    submitForm() {
      this.loading = true;

      this.$refs["notifyConfigForm"].validate((valid) => {
        if (valid) {
          send(this.form)
            .then((res) => {
              const b = res.data;
              if (b) {
                this.msgSuccess("发送成功");
                setTimeout(() => {
                  this.dialogOpen = false;
                }, 1000);
              } else {
                this.msgError("发送失败");
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    closedDialog() {
      this.fieldsMetadata = [];
      this.templateOptions = [];
    },
  },
};
</script>
<style lang="scss" scoped>
</style>