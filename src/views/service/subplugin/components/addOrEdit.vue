<!--
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-08-02 17:58:09
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-19 16:28:07
-->
<template>
  <div>
    <!-- 添加或修改通知配置对话框 -->
    <el-dialog
      :title="!form.id ? '新增子插件服务' : '修改子插件服务'"
      :visible.sync="dialogOpen"
      width="780px"
      top="30vh"
      append-to-body
      @closed="closedDialog"
    >
      <el-form
        ref="subPluginForm"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="子系统" prop="relationSubSystem">
              <el-input v-model="form.relationSubSystem" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图标" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <icon-select
                  ref="iconSelect"
                  @selected="selected"
                ></icon-select>
                <el-input
                  slot="reference"
                  v-model="form.icon"
                  placeholder="点击选择图标"
                  readonly
                >
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px; width: 16px"
                  />
                  <em
                    v-else
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="名称" prop="title">
              <el-input v-model="form.title" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="服务名" prop="code">
              <el-input v-model="form.code" placeholder="请输入服务名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="服务实例ID" prop="instanceId">
              <el-input
                v-model="form.instanceId"
                placeholder="请输入服务实例ID"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="alert_content">
            <el-alert
              title="以下内容为 [ nacos ] 可在 [ nacos ] 控制台查看！"
              type="info"
              effect="dark"
              show-icon
              :closable="false"
            >
            </el-alert>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实例IP" prop="nacosMetadata.ip">
              <el-input
                v-model="form.nacosMetadata.ip"
                placeholder="请输入服务实例IP"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实例端口" prop="nacosMetadata.port">
              <el-input
                v-model="form.nacosMetadata.port"
                placeholder="请输入服务实例端口"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="命名空间ID" prop="nacosMetadata.namespaceId">
              <el-input
                v-model="form.nacosMetadatanamespaceId"
                placeholder="请输入命名空间ID"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分组名称" prop="nacosMetadata.groupName">
              <el-input
                v-model="form.nacosMetadata.groupName"
                placeholder="请输入分组名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="集群名称" prop="nacosMetadata.clusterName">
              <el-input
                v-model="form.nacosMetadata.clusterName"
                placeholder="请输入集群名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权重" prop="nacosMetadata.weight">
              <el-input
                v-model.number="form.nacosMetadata.weight"
                placeholder="请输入权重"
              />
            </el-form-item>
          </el-col>
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
import { save, edit, findOneByCode } from "@/api/service/subplugin";
import IconSelect from "@/components/IconSelect";

export default {
  name: "addOrEdit",
  components: { IconSelect },
  created() {},
  mounted() {},

  data() {
    const validateIPAddress = (rule, value, callback) => {
      let regexp =
        /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
      let valdata = value.split(",");
      let isCorrect = true;
      if (valdata.length) {
        for (let i = 0; i < valdata.length; i++) {
          if (regexp.test(valdata[i]) == false) {
            isCorrect = false;
          }
        }
      }

      if (value == "") {
        return callback(new Error("请输入iP地址"));
      } else if (!isCorrect) {
        callback(new Error("请输入正确对ip地址"));
      } else {
        callback();
      }
    };

    return {
      loading: false,
      dialogOpen: this.open,
      fromParams: {},
      dialogOpen: false,
      type: "",
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      form: {
        id: undefined,
        relationSubSystem: undefined,
        title: undefined,
        code: undefined,
        namespaceId: undefined,
        icon: undefined,
        nacosMetadata: {
          ip: undefined,
          port: undefined,
          namespaceId: undefined,
          groupName: undefined,
          clusterName: undefined,
          weight: undefined,
        },
      },
      // 表单校验
      rules: {
        title: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        code: [{ required: true, message: "服务名不能为空", trigger: "blur" }],
        "nacosMetadata.ip": [
          { required: true, message: "实例IP不能为空", trigger: "blur" },
          { validator: validateIPAddress, trigger: "blur" },
        ],
        "nacosMetadata.port": [
          { required: true, message: "实例端口不能为空", trigger: "blur" },
        ],
        "nacosMetadata.weight": [
          { type: "number", message: "实例端口必须为数字值", trigger: "blur" },
        ],
      },
    };
  },
  watch: {},
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    init(plugin) {
      this.form.id = plugin.id || undefined;
      this.form.relationSubSystem = plugin.parentCode;
      this.dialogOpen = true;

      this.$nextTick(() => {
        this.$refs["subPluginForm"].resetFields();
        // 上面的方法好像不能清空组件里的值，这里需要手动清空一下

        if (this.form.id) {
          findOneByCode(plugin.code).then((response) => {
            this.form = response.data;
          });
        }
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["subPluginForm"].validate((valid) => {
        if (valid) {
          this.loading = true;

          if (this.form.id) {
            edit(this.form)
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

          save(this.form)
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
.alert_content {
  margin-left: 5px;
  margin-right: 50px;
  margin-bottom: 20px;
}
</style>
