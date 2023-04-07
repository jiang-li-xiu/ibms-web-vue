<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-09-18 14:44:28
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-29 11:40:01
-->
<template>
  <div class="basic-information">
    <div class="step-title">设备类型基础信息</div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm flex align-center"
      :style="{ height: tableHeight + 'px' }"
    >
      <div class="flex-1 flex-column-cc" style="height: 300px">
        <!-- 图标选择 -->
        <el-form-item label="类型图标" prop="icon" class="flex-1">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <icon-select ref="iconSelect" @selected="selected"></icon-select>
            <el-input
              slot="reference"
              style="width: 250px"
              v-model="ruleForm.iconFilepath"
              placeholder="点击选择图标"
              readonly
            >
              <svg-icon
                v-if="ruleForm.iconFilepath"
                slot="prefix"
                :icon-class="ruleForm.iconFilepath"
                class="el-input__icon"
                style="height: 32px; width: 16px"
              />
              <em v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>

        <!-- 类型名称 -->
        <el-form-item label="类型名称" prop="deviceTypeName" class="flex-1">
          <el-input
            style="width: 250px"
            v-model="ruleForm.deviceTypeName"
          ></el-input>
        </el-form-item>

        <!-- 类型标识 -->
        <!-- <el-form-item label="类型标识" prop="deviceTypeCode" class="flex-1">
          <el-input style="width: 250px" v-model="ruleForm.deviceTypeCode"></el-input>
        </el-form-item> -->

        <!-- 3d模型类型 -->
        <el-form-item label="3d模型类型" class="flex-1">
          <el-select
            style="width: 250px"
            v-model="ruleForm.unityType"
            placeholder="请选择3d模型类型"
          >
            <el-option
              v-for="dict in unityTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <!-- 上传图片 -->
        <el-form-item>
          <div class="upload-title">上传图片</div>

          <div>
            <el-upload
              :headers="headers"
              :action="uploadFileUrl"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-error="handleUploadError"
              :on-success="handleUploadSuccess"
            >
              <em class="el-icon-plus"></em>
            </el-upload>

            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </div>
        </el-form-item>
      </div>

      <div class="flex-1 flex-column flex" style="height: 300px">
        <!-- 子系统 -->
        <el-form-item label="子系统" prop="systemId" class="flex-1">
          <el-select
            style="width: 250px"
            v-model="ruleForm.systemId"
            placeholder="请选择子系统"
            @change="selectSystem"
          >
            <el-option
              v-for="item in systemOptionData"
              :key="item.id"
              :label="item.title"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 子插件 -->
        <el-form-item label="子插件" prop="plugId" class="flex-1">
          <el-select
            style="width: 250px"
            v-model="ruleForm.plugId"
            placeholder="请选择子插件"
            @change="selectPlugin"
            :disabled="ruleForm.systemId ? false : true"
          >
            <el-option
              v-for="item in plugOptionData"
              :key="item.id"
              :label="item.title"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 物模型 -->
        <el-form-item label="物模型" prop="modelId" class="flex-1">
          <el-select
            style="width: 250px"
            v-model="ruleForm.modelId"
            placeholder="请选择物模型"
            @change="selectThingModel"
            :disabled="ruleForm.plugId ? false : true"
          >
            <el-option
              v-for="item in modelOptionData"
              :key="item.id"
              :label="item.name"
              :value="item.modelId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="flex-1"></div>
      </div>
    </el-form>

    <div class="step-button">
      <el-button type="primary" @click="nextStep('ruleForm')">
        下一步
      </el-button>
    </div>
  </div>
</template>

<script>
import bus from "@/utils/bus.js";

import {
  getSystemData,
  getPlugData,
  getModelData,
} from "@/api/subsystem/system";
import { getToken } from "@/utils/auth";

// 用于图标选择
import IconSelect from "@/components/IconSelect";

export default {
  name: "BasicInformation",
  components: { IconSelect },
  props: {},
  data() {
    return {
      // 表格自适应高度
      tableHeight: 0,
      // 保存的表单
      ruleForm: {
        deviceTypeName: "", //设备类型名称 *必需
        // deviceTypeCode: "", //设备类型编码(表标识) *必需
        iconFilepath: "", //图标地址
        systemId: "", //子系统id *必需
        plugId: "", //子插件id *必需
        modelId: "", //物模型id *必需
        id: "",
        unityType: "", //3d模型类型
        imagesPath: "", //图片路径
      },
      // 表单验证规则
      rules: {
        // deviceTypeCode: [
        //   { required: true, message: "请输入设备类型标识", trigger: "blur" },
        // ],
        deviceTypeName: [
          { required: true, message: "请输入设备类型名称", trigger: "blur" },
        ],
        systemId: [
          { required: true, message: "请选择归属子系统", trigger: "change" },
        ],
        plugId: [
          { required: true, message: "请选择归属插件", trigger: "change" },
        ],
        modelId: [
          { required: true, message: "请选择归属物模型", trigger: "change" },
        ],
      },
      // 图标
      optionsImg: [],
      // 3d模型类型
      unityTypeOptions: [],
      // 子系统下拉数据
      systemOptionData: [],
      // 子插件下拉数据
      plugOptionData: [],
      // 物模型下拉数据
      modelOptionData: [],
      // 保存选中的子系统、子插件、物模型名称
      selectedData: {},

      dialogImageUrl: "",
      dialogVisible: false,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
    };
  },
  created() {
    // 获取高度
    this.getHeight();
    // 监听页面高度变化
    window.addEventListener("resize", this.getHeight);
    // 获取子系统数据
    this.getSystemData();
    // 获取3d模型数据字典用于下拉框选择数据
    this.getDicts("UNITY_TYPE").then((response) => {
      this.unityTypeOptions = response.data;
    });
  },
  beforeDestroy() {
    bus.$off("getSelectedData"); // 组件销毁时关闭监听
  },

  methods: {
    // 删除
    handleRemove(file) {
      this.fileList.splice(this.fileList.indexOf(file.response.data.url), 1);
      this.ruleForm.imagesPath = this.fileList.toString();
    },

    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 上传失败
    handleUploadError(err) {
      console.log("err:", err);
    },

    // 上传成功回调
    handleUploadSuccess(response) {
      this.fileList.push(response.data.url);
      this.ruleForm.imagesPath = this.fileList.toString();
    },

    // 选择图标
    selected(name) {
      this.ruleForm.iconFilepath = name;
    },
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 346;
    },
    // 获取所有子系统
    getSystemData() {
      getSystemData().then((response) => {
        console.log("获取所有子系统:", response.data);
        this.systemOptionData = response.data;
      });
    },
    // 选择子系统 && 获取子插件下拉数据
    selectSystem(code) {
      let data = this.systemOptionData.filter((item) => {
        return item.code == code;
      });
      this.selectedData.systemName = data[0].title;
      this.ruleForm.plugId = "";
      this.ruleForm.modelId = "";
      getPlugData(data[0].code).then((response) => {
        console.log("获取所有子插件:", response.data);
        this.plugOptionData = response.data;
      });
    },
    //选择子插件 && 获取物模型下拉数据
    selectPlugin(code) {
      let data = this.plugOptionData.filter((item) => {
        return item.code == code;
      });
      this.selectedData.plugName = data[0].title;
      this.ruleForm.modelId = "";
      getModelData(data[0].code).then((response) => {
        console.log("获取所有物模型:", response.data);
        this.modelOptionData = response.data;
      });
    },
    // 选择物模型
    selectThingModel(modelId) {
      let data = this.modelOptionData.filter((item) => {
        if (item.modelId == modelId) {
          this.ruleForm.id = item.id;
        }
      });
      this.selectedData.modelName = data.name;
    },
    nextStep(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$emit("nextStep", this.ruleForm);
          bus.$emit("getSelectedData", this.selectedData);
        } else {
          return false;
        }
      });
    },
  },
  destroyed() {
    // 销毁当前页面高度监听
    window.removeEventListener("resize", this.getHeight);
  },
};
</script>

<style scoped lang="scss">
.step-title {
  font-size: 24px;
  font-weight: 600;
  padding-left: 20px;
  margin-bottom: 20px;
}
.step-button {
  width: 100%;
  padding: 20px 50px 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.upload-title {
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 36px;
  font-weight: 700;
  width: 300px;
}
</style>
