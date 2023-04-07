<!--
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-08-05 14:32:13
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-06 11:35:55
-->
<template>
  <div>
    <!-- 添加或修改通知配置对话框 -->
    <el-drawer
      :title="!form.id ? '新增通知配置' : '修改通知配置'"
      :before-close="handleBeforeClose"
      @closed="closedDrawer"
      :visible.sync="dialogOpen"
      :wrapperClosable="true"
      append-to-body
      size="55%"
      ref="drawer"
    >
      <div class="drawer_content">
        <el-skeleton :rows="24" :loading="skeletonLoading" animated>
          <el-form
            ref="templateForm"
            :model="form"
            :rules="rules"
            label-width="100px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="配置名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入配置名称" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="配置类型" prop="type">
                  <el-select
                    v-model="form.type"
                    style="width: 100%"
                    placeholder="请选择"
                    @change="typeChange"
                  >
                    <el-option
                      v-for="dict in typeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="服务提供商" prop="serviceProvider">
                  <el-select
                    v-model="form.serviceProvider"
                    style="width: 100%"
                    placeholder="请选择"
                    @change="serviceProviderChange"
                  >
                    <el-option
                      v-for="dict in serviceOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <template v-if="configMetadata.length > 0">
                <el-col :span="24" class="alert_content">
                  <el-alert
                    title="使用动态变量需注意以下内容"
                    type="warning"
                    description="正文内容可以采用动态变量，命名规则为 {变量名} ，变量名尽量不要使用中文，否则有可能会发生意外的错误； 标题不支持使用动态变量，需注意！！！"
                    effect="light"
                    show-icon
                    :closable="false"
                  >
                  </el-alert>
                </el-col>
                <el-col
                  v-for="(config, i) in configMetadata"
                  :key="i"
                  :span="24"
                >
                  <el-form-item
                    :label="config.label ? config.label : config.key"
                    :prop="'template.' + config.key"
                    :rules="config.rules"
                  >
                    <el-input
                      v-if="config.type === 'string'"
                      v-model.trim="form.template[config.key]"
                      :placeholder="config.placeholder"
                    />
                    <el-input
                      v-else-if="config.type === 'number'"
                      v-model.number="form.template[config.key]"
                      :placeholder="config.placeholder"
                    />
                    <el-input
                      v-else-if="config.type === 'textarea'"
                      type="textarea"
                      :autosize="config.autoSize"
                      v-model.trim="form.template[config.key]"
                      :placeholder="config.placeholder"
                    />
                    <el-select
                      v-else-if="config.type === 'options'"
                      v-model="form.template[config.key]"
                      style="width: 100%"
                      :placeholder="config.placeholder"
                    >
                      <el-option
                        v-for="opt in config.options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                      ></el-option>
                    </el-select>
                    <el-radio-group
                      v-else-if="config.type === 'boolean'"
                      v-model="form.template[config.key]"
                      size="small"
                    >
                      <el-radio :label="true" border>是</el-radio>
                      <el-radio :label="false" border>否</el-radio>
                    </el-radio-group>
                    <mavon-editor
                      v-else-if="config.type === 'markdown'"
                      v-model="form.template[config.key]"
                      style="min-height: 30vh"
                    />
                    <editor
                      v-else-if="config.type === 'editor'"
                      v-model="form.template[config.key]"
                      :isClear="true"
                    />
                    <file-upload
                      v-else-if="config.type === 'file'"
                      ref="fileUpload"
                      v-model="form.template[config.key]"
                      :limit="config.limit"
                      :fileSize="config.fileSize"
                      :fileType="config.fileTypes"
                    />
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-form>
          <div class="drawer_footer">
            <el-button type="primary" @click="submitForm" :loading="loading">{{
              loading ? "提交中 ..." : "确 定"
            }}</el-button>
            <el-button @click="cancelForm">取 消</el-button>
          </div>
        </el-skeleton>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  findOne,
  saveNoticeTemplate,
  editNoticeTemplate,
  getFormMetadata,
} from "@/api/system/template";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import Editor from "@/components/WangEditor";
import FileUpload from "@/components/FileUpload";

export default {
  name: "addOrEdit",
  components: {
    mavonEditor,
    Editor,
    FileUpload,
  },
  created() {
    this.getDicts("notice_type").then((res) => {
      this.typeOptions = res.data;
      this.typeOptions.splice(0, 1);
    });
    this.getDicts("service_provider").then((res) => {
      this.serviceProviderOptions = res.data;
    });
  },
  data() {
    return {
      title: "通知配置",
      loading: false,
      skeletonLoading: false,
      dialogOpen: false,
      type: "",
      serviceProviderOptions: [],
      serviceOptions: [],
      configMetadata: [],
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      form: {
        id: undefined,
        name: undefined,
        type: undefined,
        serviceProvider: undefined,
        template: {},
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "配置名称不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "配置类型不能为空", trigger: "change" },
        ],
        serviceProvider: [
          { required: true, message: "服务提供商不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 配置类型下拉框值变化回调
    typeChange(value) {
      this.type = value;
      this.configMetadata = [];
      this.form.serviceProvider = undefined;

      this.serviceOptions = this.serviceProviderOptions
        .filter((item) => item.dictValue.split("-")[0] === value)
        .map((item) => {
          let data = { dictLabel: undefined, dictValue: undefined };
          data.dictLabel = item.dictLabel;
          data.dictValue = item.dictValue.split("-")[1];

          return data;
        });
    },
    // 服务提供商下拉框值变化回调
    serviceProviderChange(value) {
      getFormMetadata(this.type, value).then((res) => {
        this.configMetadata = res.data;
        this.setForm(this.configMetadata);
      });
    },
    setForm(list) {
      let conf = {};
      for (const iterator of list) {
        this.$set(conf, iterator.key, iterator.defValue);
      }
      Object.assign(this.form, { template: conf });
    },
    init(id) {
      this.form.id = id || undefined;
      this.dialogOpen = true;

      this.$nextTick(() => {
        this.skeletonLoading = true;
        this.$refs["templateForm"].resetFields();

        if (this.form.id) {
          findOne(this.form.id).then((response) => {
            const { type, serviceProvider } = response.data;
            this.typeChange(type);
            this.serviceProviderChange(serviceProvider);
            setTimeout(() => {
              this.form = response.data;
            }, 500);
          });
        }
        this.skeletonLoading = false;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["templateForm"].validate((valid) => {
        if (valid) {
          this.loading = true;

          if (this.form.id) {
            editNoticeTemplate(this.form)
              .then((response) => {
                this.loading = false;
                this.msgSuccess("修改成功");
                this.getList();
              })
              .catch(() => {
                this.loading = false;
              });
            return;
          }

          saveNoticeTemplate(this.form)
            .then((response) => {
              this.loading = false;
              this.msgSuccess("新增成功");
              this.getList();
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    // 添加或者修改成功后，刷新table
    getList() {
      this.$emit("refreshList");
      this.dialogOpen = false;
      // this.$refs.drawer.closeDrawer()
    },
    closedDrawer() {
      this.configMetadata = [];
      this.serviceOptions = [];
    },
    // 关闭抽屉前调用
    handleBeforeClose(done) {
      done();
    },
    // 取消按钮
    cancelForm() {
      this.loading = false;
      this.dialogOpen = false;
    },
  },
};
</script>

<style scoped>
.drawer_content {
  margin: 20px;
}
.alert_content {
  margin-left: 5px;
  margin-right: 50px;
  margin-bottom: 20px;
}
.drawer_footer {
  text-align: center;
}
</style>
