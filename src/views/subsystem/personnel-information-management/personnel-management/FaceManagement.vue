<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" @close="close" width="800px">
      <el-form :model="modelForm" ref="ruleForm" label-width="130px">
        <el-row>
          <!-- 上传图片 -->
          <template>
            <el-col :span="24">
              <el-form-item label="上传人脸图片" prop="faceData">
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
                    :on-change="getFile"
                    :before-upload="beforeUpload"
                    :limit="1"
                    :file-list="imgFilesList"
                  >
                    <em class="el-icon-plus"></em>
                  </el-upload>

                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="" />
                  </el-dialog>
                </div>
                <div style="color: red">
                  注意：只能上传一张图片，且上传的图片不能超过200kb
                </div>
              </el-form-item>
            </el-col>
          </template>
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
import {
  addFace,
  editFace,
  deleteFace,
  getPeoplePicturesDetail,
} from "@/api/subsystem/personnel-information-management/personnelManagement.js";
import { getToken } from "@/utils/auth";
export default {
  props: {
    orgIndexCode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 显示弹窗
      open: false,
      loading: false,
      // 标题
      title: "管理人脸",
      // 当前模式 0新增 1编辑
      type: 0,
      // 表单
      modelForm: {
        personId: "", //人员id
        faceData: "", //人脸图片base64编码后的字符
      },
      // 人脸图片
      personPhoto: [],
      // 回显图片
      imgFilesList: [],

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

  methods: {
    // 关闭弹窗
    close() {
      this.open = false;
      // 清空表单
      this.modelForm = {};
      // 清空表单校验
      this.$refs["ruleForm"].resetFields();
      // 清空图片列表
      this.fileList = [];
      this.imgFilesList = [];
      // 清除图片缓存
      this.$refs["pictureFrom"].clearFiles();
    },

    // 新增
    add(record) {
      console.log(record);
      this.modelForm.personId = record.personId;
      this.open = true;
      this.type = 0;
      this.getPeoplePicturesDetails(
        record.personPhoto.length != 0
          ? record.personPhoto[0].serverIndexCode.toString()
          : "",
        record.personPhoto.length != 0
          ? record.personPhoto[0].picUri.toString()
          : ""
      );
    },

    // 详情
    detail(record) {
      console.log(record);
      this.type = 2;
      this.open = true;
      // 回显数据
      this.modelForm = { ...record };
      // 保存图片数据
      this.personPhoto = record.personPhoto;
      // 图片详情
      this.getPeoplePicturesDetails(
        record.personPhoto.length != 0
          ? record.personPhoto[0].serverIndexCode.toString()
          : "",
        record.personPhoto.length != 0
          ? record.personPhoto[0].picUri.toString()
          : ""
      );
    },

    // 删除人脸
    delete(record) {
      const id = record.personId;
      let that = this;
      that
        .$confirm("是否确认删除此数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function () {
          deleteFace(id).then((res) => {
            that.$emit("refresh");
            that.msgSuccess("删除成功");
          });
        })
        .catch(() => {});
    },

    //获取图片的base64
    getFile(file, fileList) {
      this.getBase64(file.raw).then((res) => {
        this.modelForm.faceData = res.split(",")[1];
        console.log(this.modelForm.faceData);
      });
    },
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
          // console.log(imgResult);
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
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
      this.fileList.splice(this.fileList.indexOf(file.response.data.url), 1);
      this.modelForm.faceData = this.fileList.toString();
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
      console.log(response);
      this.fileList.push(response.data.url);
      this.modelForm.faceData = this.fileList.toString();
    },

    // 查看人员图片详情
    getPeoplePicturesDetails(serverIndexCode, picUri) {
      getPeoplePicturesDetail({ serverIndexCode, picUri }).then((res) => {
        console.log(res);
        this.modelForm.faceData = res;
        console.log(this.modelForm.faceData);
        // 回显人脸图片
        if (res !== "") {
          this.imgFilesList.push({
            url: res,
            name: "人脸图片",
            id: 1,
          });
        }
        console.log(this.imgFilesList);
      });
    },

    // 提交
    submitForm() {
      console.log(this.modelForm);
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            addFace(this.modelForm).then((res) => {
              if (res.code == 200) {
                this.$message.success("添加成功");
                this.$emit("refresh");
                this.close();
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            editFace(this.modelForm).then((res) => {
              if (res.code == 200) {
                this.$message.success("修改成功");
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
  },
};
</script>

<style></style>
