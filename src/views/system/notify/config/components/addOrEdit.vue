<!--
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-08-02 17:58:09
 * @LastEditors: Chen
 * @LastEditTime: 2021-08-20 17:54:43
-->
<template>
  <div>
    <!-- 添加或修改通知配置对话框 -->
    <el-dialog
      :title="!form.id ? '新增通知配置' : '修改通知配置'"
      :visible.sync="dialogOpen"
      width="780px"
      top="30vh"
      append-to-body
      @closed="closedDialog"
    >
      <el-form
        ref="configForm"
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
            <el-col v-for="(config, i) in configMetadata" :key="i" :span="24">
              <el-form-item
                :label="config.label ? config.label : config.key"
                :prop="'configuration.' + config.key"
                :rules="config.rules"
              >
                <el-input
                  v-if="config.type === 'string'"
                  v-model.trim="form.configuration[config.key]"
                  :placeholder="config.placeholder"
                />
                <el-input
                  v-else-if="config.type === 'textarea'"
                  type="textarea"
                  :autosize="config.autoSize"
                  v-model.trim="form.configuration[config.key]"
                  :placeholder="config.placeholder"
                />
                <el-input
                  v-else-if="config.type === 'number'"
                  v-model.number="form.configuration[config.key]"
                  :placeholder="config.placeholder"
                />
                <el-select
                  v-else-if="config.type === 'options'"
                  v-model="form.configuration[config.key]"
                  style="width: 100%"
                  filterable
                  allow-create
                  default-first-option
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
                  v-model="form.configuration[config.key]"
                  size="small"
                >
                  <el-radio :label="true" border>是</el-radio>
                  <el-radio :label="false" border>否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="submitForm">
          {{ loading ? "提交中..." : "确 定" }}
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findOne,
  saveNoticeConfig,
  editNoticeConfig,
  getFormMetadata,
} from "@/api/system/notify";

export default {
  name: "addOrEdit",
  components: {},
  created() {
    this.getDicts("notice_type").then((res) => {
      this.typeOptions = res.data;
      this.typeOptions.splice(0, 1);
    });
    this.getDicts("service_provider").then((res) => {
      this.serviceProviderOptions = res.data;
    });
  },
  mounted() {},
  data() {
    return {
      title: "通知配置",
      loading: false,
      dialogOpen: this.open,
      fromParams: {},
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
        configuration: {},
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
  watch: {},
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
      Object.assign(this.form, { configuration: conf });
    },
    init(id) {
      this.form.id = id || undefined;
      this.dialogOpen = true;

      this.$nextTick(() => {
        this.$refs["configForm"].resetFields();
        // 上面的方法好像不能清空组件里的值，这里需要手动清空一下

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
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      
      this.$refs["configForm"].validate((valid) => {
        if (valid) {
          this.loading = true;

          if (this.form.id) {
            editNoticeConfig(this.form)
              .then((response) => {
                this.loading = false
                this.msgSuccess("修改成功");
                this.getList();
              })
              .catch(() => {
                this.loading = false;
              });
            return;
          }

          saveNoticeConfig(this.form)
            .then((response) => {
              this.loading = false
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
    },
    // 取消按钮
    cancel() {
      this.dialogOpen = false;
    },
    closedDialog() {
      this.configMetadata = [];
      this.serviceOptions = [];
    },
  },
};
</script>

<style scoped>
.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
