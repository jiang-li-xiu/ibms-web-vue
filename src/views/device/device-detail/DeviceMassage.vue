<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-27 14:26:59
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-26 16:38:17
-->
<template>
  <div class="device-massage">
    <!-- 设备信息 -->
    <div class="massage mb-20">
      <div class="flex align-center mb-20">
        <div class="mr-40">基础设备信息</div>
        <!-- <div class="el-icon-edit-outline" @click="handleEditMessage">编辑</div> -->
      </div>
      <el-table :data="deviceData" border v-loading="deviceDataLoading">
        <el-table-column label="设备编码" align="center" prop="deviceCode" />
        <el-table-column label="设备名称" align="center" prop="deviceName" />
        <el-table-column
          label="设备类型"
          align="center"
          prop="deviceTypeName"
        />
        <el-table-column label="厂家" align="center" prop="deviceFactory" />
        <el-table-column label="品牌" align="center" prop="deviceBrand" />
        <el-table-column
          label="注册时间"
          align="center"
          prop="registrationTime"
        >
          <template slot-scope="scope">
            <span>{{
              parseTime(scope.row.registrationTime, "{y}-{m}-{d}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="最后上线时间"
          align="center"
          prop="updateTime"
        />

        <!-- <el-table-column label="ip地址" align="center" prop="ipAddress" /> -->

        <el-table-column
          label="连接协议"
          align="center"
          prop="connectionAgreement"
        />

        <el-table-column label="备注" align="center" prop="remarks" />

        <!-- <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEditMessage(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!-- 配置 -->
    <div class="configuration">
      <div class="flex align-center mb-20">
        <div class="mr-40">设备其他属性</div>
      </div>
      <el-table :data="configurationList" border v-loading="deviceDataLoading">
        <el-table-column
          label="属性ID"
          width="250"
          align="center"
          prop="field"
        />
        <el-table-column
          label="属性名称"
          width="250"
          align="center"
          prop="name"
        />
        <el-table-column label="属性值" align="center" prop="value" />
        <el-table-column
          label="数据类型"
          width="150"
          align="center"
          prop="dataType.type"
        />
        <el-table-column label="是否只读" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.accessMode == "r" ? "是" : "否" }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑设备信息 -->
    <el-dialog
      title="设备信息编辑"
      :visible.sync="open"
      width="800px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备编码" prop="deviceCode">
          <el-input v-model="form.deviceCode" placeholder="请输入设备编码" />
        </el-form-item>
        <el-form-item label="厂家" prop="deviceFactory">
          <el-input v-model="form.deviceFactory" placeholder="请输入厂家" />
        </el-form-item>
        <el-form-item label="品牌" prop="deviceBrand">
          <el-input v-model="form.deviceBrand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateDeviceinfo } from "@/api/device/deviceInfo";
export default {
  name: "DeviceMassage",
  props: {
    // 设备信息数据
    deviceInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 设备信息table遮罩层
    deviceDataLoading: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    // 其他属性信息
    configurationList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      // 设备基本信息
      deviceData: [],
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        deviceCode: [
          { required: true, message: "设备编码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 设备信息编辑弹窗
    handleEditMessage(row) {
      let data = JSON.parse(JSON.stringify(row));
      this.form = data;
      this.open = true;
    },
    // 弹窗取消按钮
    cancel() {
      this.open = false;
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          updateDeviceinfo(this.form).then((response) => {
            this.$emit("getBasis");
            this.open = false;
          });
        }
      });
    },
  },
  watch: {
    deviceInfo: {
      handler(newVal) {
        this.deviceData = [];
        this.deviceData.push(newVal);
      },
    },
  },
};
</script>
<style scoped lang='scss' >
.device-massage {
  .el-icon-edit-outline {
    cursor: pointer;
    color: #0dabf1;
  }
}
</style>