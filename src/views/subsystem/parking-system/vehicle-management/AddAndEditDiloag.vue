<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-08 08:46:20
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-09 16:28:20
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
            <el-form-item label="车牌号码" prop="plateNo">
              <el-input
                v-model="modelForm.plateNo"
                placeholder="请输入车牌号码"
                size="small"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车牌类型" prop="plateType">
              <el-select
                v-model="modelForm.plateType"
                placeholder="请选择车牌类型"
                clearable
                style="width: 630px"
                :disabled="disableSubmit"
              >
                <el-option
                  v-for="item in plaotTypeList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="人员ID" prop="personId">
              <el-input
                v-model="modelForm.personId"
                placeholder="请输入人员ID"
                size="small"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="人员姓名" prop="personName">
              <el-input
                v-model="modelForm.personName"
                placeholder="请输入人员姓名"
                size="small"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否关联人员" prop="isBandPerson">
              <el-select
                v-model="modelForm.isBandPerson"
                placeholder="请选择是否关联人员"
                clearable
                style="width: 630px"
                :disabled="disableSubmit"
              >
                <el-option label="不关联" :value="0"></el-option>
                <el-option label="关联" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车牌颜色" prop="plateColor">
              <el-select
                v-model="modelForm.plateColor"
                placeholder="请选择车牌颜色"
                clearable
                style="width: 630px"
                :disabled="disableSubmit"
              >
                <el-option
                  v-for="item in plateColorList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车辆类型" prop="vehicleType">
              <el-select
                v-model="modelForm.vehicleType"
                placeholder="请选择车辆类型"
                clearable
                style="width: 630px"
                :disabled="disableSubmit"
              >
                <el-option
                  v-for="item in vehicleTypeList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车辆颜色" prop="vehicleColor">
              <el-select
                v-model="modelForm.vehicleColor"
                placeholder="请选择车辆颜色"
                clearable
                style="width: 630px"
                :disabled="disableSubmit"
              >
                <el-option
                  v-for="item in vehicleColorList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车辆描述" prop="description">
              <el-input
                type="textarea"
                v-model="modelForm.description"
                placeholder="请输入车辆描述"
                :rows="3"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属区域" prop="regionIndexCode">
              <el-input
                v-model="modelForm.regionIndexCode"
                placeholder="请输入所属区域"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属区域名" prop="regionName">
              <el-input
                v-model="modelForm.regionName"
                placeholder="请输入所属区域名"
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
// API
import {
  addVehicle,
  editVehicle,
  getDetail,
} from "@/api/subsystem/parking-system/vehicle-management.js";
export default {
  data() {
    return {
      // 显示弹窗
      open: false,
      loading: false,
      //控制可编辑
      disableSubmit: false,
      // 类型 0添加，1编辑  2详情
      type: 0,
      // 标题
      title: "新增",
      // 表单数据
      modelForm: {
        clientId: "", //调用方指定Id
        personId: "7b542facce7a4cc9b3a0131473bc6da9", //人员ID
        plateNo: "", //车牌号码
        isBandPerson: "", //是否关联人员
        personName: "", //人员姓名
        plateType: "", //车牌类型
        plateColor: "", //车牌颜色
        vehicleType: "", //车辆类型
        vehicleColor: "", //车辆颜色
        description: "", //车辆描述
        regionIndexCode: "", //所属区域
        regionName: "", //所属区域名
      },
      // 表单校验
      rules: {
        plateNo: [
          { required: true, message: "请输入车牌号码" },
          {
            pattern:
              /^$|^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/, // 正则
            message: "请输入正确的车牌号",
          },
          ,
        ],
        plateType: [
          { required: true, message: "请选择车牌类型", trigger: "blur" },
        ],
        vehicleType: [
          { required: true, message: "请选择车辆类型", trigger: "blur" },
        ],
      },
      // 车牌类型
      plaotTypeList: [],
      plaotTypeListOptions: [],
      // 车辆类型列表
      vehicleTypeList: [],
      // 车牌颜色列表
      plateColorList: [],
      // 车辆颜色列表
      vehicleColorList: [],
    };
  },
  created() {
    // 获取车牌类型字典
    this.getDicts("license_plate_type").then((res) => {
      console.log(res.data);
      this.plaotTypeList = res.data;
    });
    // 获取车辆类型列表
    this.getDicts("vehicle_type").then((res) => {
      this.vehicleTypeList = res.data;
    });
    // 获取车牌颜色列表
    this.getDicts("license_plate_color").then((res) => {
      this.plateColorList = res.data;
    });
    // 获取车辆颜色列表
    this.getDicts("vehicle_color").then((res) => {
      this.vehicleColorList = res.data;
    });
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

    // 添加
    add() {
      this.open = true;
      this.type = 0;
    },

    // 编辑
    edit(record) {
      console.log(record);
      this.open = true;
      this.type = 1;
      // 获取详情
      this.getDetail(record.vehicleId);
    },

    // 获取详情
    getDetail(vehicleId) {
      getDetail(vehicleId).then(({ data }) => {
        console.log(data);
        data.plateType= data.plateType.toString()
        data.vehicleType= data.plateType.toString()
        data.plateColor= data.plateType.toString()
        data.vehicleColor= data.plateType.toString()
        // 赋值
        this.modelForm = data;
        console.log(this.modelForm);

        // this.modelForm.plateType = this.selectDictLabel(
        //   this.plaotTypeList,
        //   data.plateType
        // );
        // this.modelForm.vehicleType = this.selectDictLabel(
        //   this.vehicleTypeList,
        //   data.vehicleType
        // );
        // this.modelForm.plateColor = this.selectDictLabel(
        //   this.plateColorList,
        //   data.plateColor
        // );
        // this.modelForm.vehicleColor = this.selectDictLabel(
        //   this.vehicleColorList,
        //   data.vehicleColor
        // );
      });
    },

    // 提交
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          console.log(this.modelForm);
          // 当前为添加
          if (this.type === 0) {
            addVehicle(this.modelForm).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg);
                this.$emit("refresh");
                this.close();
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            editVehicle(this.modelForm).then((res) => {
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

    // 翻译车牌类型 字典
    plateTypeFormat(row, column) {
      return this.selectDictLabel(this.plaotTypeList, row.plateType);
    },
    // 翻译车辆类型 字典
    vehicleTypeFormat(row, column) {
      return this.selectDictLabel(this.vehicleTypeList, row.vehicleType);
    },
    // 翻译车牌颜色 字典
    plateColorFormat(row, column) {
      return this.selectDictLabel(this.plateColorList, row.plateColor);
    },
    // 翻译车辆颜色 字典
    vehicleColorFormat(row, column) {
      return this.selectDictLabel(this.vehicleColorList, row.vehicleColor);
    },
  },
};
</script>

<style></style>
