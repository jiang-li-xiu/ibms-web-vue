<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-05 09:09:01
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-05 15:11:12
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="700px"
    :loading="spinning"
    @close="close"
    append-to-body
  >
    <el-form
      ref="modelForm"
      :model="modelForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="事件名称" prop="eventName">
        <el-input
          v-model="modelForm.eventName"
          placeholder="请输入事件名称"
          :disabled="disableSubmit"
        />
      </el-form-item>
      <el-form-item label="类别" prop="eventType">
        <el-select
          v-model="modelForm.eventType"
          placeholder="请选择类别"
          clearable
          style="width: 530px"
          :disabled="disableSubmit"
        >
          <el-option
            v-for="item in eventTypeList"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区域" prop="location">
        <el-input
          v-model="modelForm.location"
          placeholder="请输入区域"
          :disabled="disableSubmit"
        />
      </el-form-item>
      <el-form-item label="原因" prop="reason">
        <el-input
          v-model="modelForm.reason"
          placeholder="请输入原因"
          :disabled="disableSubmit"
        />
      </el-form-item>
      <el-form-item label="处理结果" prop="result">
        <el-input
          v-model="modelForm.result"
          placeholder="请输入处理结果"
          :disabled="disableSubmit"
        />
      </el-form-item>
      <el-form-item label="小区名称" prop="village">
        <el-input
          v-model="modelForm.village"
          placeholder="请输入小区名称"
          :disabled="disableSubmit"
        />
      </el-form-item>
      <el-form-item label="事件发生时间" prop="eventTime">
        <el-date-picker
          v-model="modelForm.eventTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          align="right"
          style="width: 100%"
          :disabled="disableSubmit"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="modelForm.description"
          type="textarea"
          :rows="3"
          placeholder="请输入描述"
          :disabled="disableSubmit"
        />
      </el-form-item>
      <el-form-item label="图片" prop="images">
        <div>
          <el-upload
            ref="pictureFrom"
            :headers="headers"
            :action="uploadFileUrl"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-error="handleUploadError"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :limit="1"
            :file-list="images"
            :disabled="disableSubmit"
          >
            <em class="el-icon-plus"></em>
          </el-upload>

          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import {
  addImportEvents,
  editImportEvents,
  getDetail,
} from "@/api/common-config/event-manage/ImportantEvents.js";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      title: "新增",
      // 加载loading
      spinning: false,
      // 显示弹窗
      visible: false,
      disableSubmit: false,
      // 类型
      type: 0,
      modelForm: {
        eventName: "", //事件名称
        eventType: "", //类别
        location: "", //区域
        reason: "", //原因
        village: "", //小区名称
        eventTime: "", //事件发生时间
        images: "",
        description: "",
      },
      rules: {
        eventName: [{ required: true, message: "请输入事件名称" }],
        // eventType: [{ required: true, message: "请选择类别" }],
        // location: [{ required: true, message: "请输入区域" }],
        // reason: [{ required: true, message: "请输入原因" }],
        // description: [{ required: true, message: "请输入描述" }],
        // result: [{ required: true, message: "请输入处理结果" }],
        // village: [{ required: true, message: "请输入小区名称" }],
        // eventTime: [{ required: true, message: "请选择发生时间" }],
        // images: [{ required: true, message: "请上传图片" }],
      },
      // 事件列表
      eventTypeList: [],

      // 回显图片
      images: [],
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
      // 图片列表
      fileList: [],
      dialogVisible: false,
      //图片预览
      dialogImageUrl: "",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };
  },
  created() {
    // 获取类别类型
    this.getDicts("event_category").then((res) => {
      this.eventTypeList = res.data;
    });
  },
  methods: {
    // 关闭弹窗
    close() {
      this.visible = false;
      // 清空表单
      this.modelForm = {};
      this.fileList = [];
      this.images = [];
      // 清空表单校验
      this.$refs["modelForm"].resetFields();
    },

    // 新增
    add() {
      this.visible = true;
      this.type = 0;
    },

    // 编辑
    edit(record) {
      this.visible = true;
      this.type = 1;
      // this.modelForm = { ...record };
      this.getDetail(record.id);
    },

    // 上传文件之前对文件大小和类型做限制
    beforeUpload(file) {
      let types = [
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/bmp",
        "image/png",
      ];
      const isImage = types.includes(file.type);
      const isLtSize = file.size / 1024 < 200;
      if (!isImage) {
        this.$message.error("上传图片只能是 JPG、JPEG、gif、bmp、PNG 格式!");
        return false;
      }
      if (!isLtSize) {
        this.$message.error("上传图片大小不能超过 200kb!");
        return false;
      }
      return true;
    },
    // 删除图片
    handleRemove(file) {
      console.log(file);
      this.fileList.splice(this.fileList.indexOf(file.response.data.url), 1);
      this.modelForm.images = this.fileList.toString();
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
    handleUploadSuccess(response, file, fileList) {
      console.log(response);
      this.fileList.push(response.data.url);
      // this.fileList.push(file.url);
      this.modelForm.images = this.fileList.toString();
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.code === 200) {
          console.log(res);
          this.modelForm = res.data;
          // 处理图片
          if (res.data.images) {
            this.images.push({
              url: res.data.images,
              name: "图片",
              id: 1,
            });
          }
        }
      });
    },

    // 提交
    handleSubmit() {
      let that = this;
      that.$refs["modelForm"].validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            addImportEvents(this.modelForm).then((res) => {
              if (res.code == 200) {
                this.$message.success("新增成功");
                this.$emit("ok");
                this.close();
              } else {
                this.$message.error("新增失败");
              }
            });
          } else {
            editImportEvents(this.modelForm).then((res) => {
              if (res.code == 200) {
                this.$message.success("编辑成功");
                this.$emit("ok");
              } else {
                this.$message.error("编辑失败");
              }
              this.close();
            });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style></style>
