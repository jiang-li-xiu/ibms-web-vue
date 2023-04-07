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
            <el-form-item label="姓名" prop="personName">
              <el-input
                v-model="modelForm.personName"
                placeholder="请输入姓名"
                size="small"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="性别" prop="gender">
              <el-select
                v-model="modelForm.gender"
                placeholder="请选择性别"
                clearable
                style="width: 630px"
                :disabled="disableSubmit"
              >
                <el-option
                  v-for="item in genderTypeList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="出生日期" prop="birthday">
              <el-input
                v-model="modelForm.birthday"
                placeholder="请输入出生日期 如：1992-09-12"
                size="small"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="手机号码" prop="phoneNo">
              <el-input
                v-model="modelForm.phoneNo"
                placeholder="请输入手机号码"
                size="small"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="modelForm.email"
                placeholder="请输入邮箱 如：hic@163.com"
                size="small"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证件类型" prop="certificateType">
              <el-select
                v-model="modelForm.certificateType"
                placeholder="请选择证件类型"
                clearable
                style="width: 630px"
                :disabled="disableSubmit"
              >
                <el-option
                  v-for="item in certificateTypeList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证件号码" prop="certificateNo">
              <el-input
                v-model="modelForm.certificateNo"
                placeholder="请输入证件号码"
                size="small"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工号" prop="jobNo">
              <el-input
                v-model="modelForm.jobNo"
                placeholder="请输入工号"
                size="small"
                :disabled="disableSubmit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 上传图片 -->
          <template v-if="this.type === 0">
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
                    :disabled="disableSubmit"
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

          <!-- 详情查看人员图片 -->
          <template v-if="this.type === 2">
            <el-col :span="24">
              <el-form-item
                label="人脸图片"
                prop="faceData"
                v-if="this.personPhoto.length !== 0"
              >
                <div>
                  <el-image style="width: 100px; height: 100px" :src="picUri">
                  </el-image>
                </div>
              </el-form-item>
              <el-form-item label="人脸图片" prop="faceData" v-else>
                <div>无</div>
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
  addPersonnlInfo,
  editPersonnlInfo,
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
      //控制可编辑
      disableSubmit: false,
      // 标题
      title: "新增",
      // 当前模式 0新增 1编辑
      type: 0,
      // 表单
      modelForm: {
        personName: "",
        gender: "", //性别
        orgIndexCode: "", //所属组织唯一标识
        birthday: "", //出生
        phoneNo: "", //手机号
        email: "", //邮箱
        certificateType: "", //证件类型
        certificateNo: "", //证件号码
        jobNo: "", //工号
        faceData: "", //人脸图片base64编码后的字符
        // 人员图片信息，添加时不需要
        // personPhoto: {
        //   faceData: "",
        //   personId: "", //人员id
        //   personPhotoIndexCode: "", //人脸图片唯一标示
        //   picUri: "", //图片相对url
        //   serverIndexCode: "", //图片服务器唯一标示
        // },
      },
      picUri: "",
      picUriList: [],
      personPhoto: [],

      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
      // 图片列表
      fileList: [],
      dialogVisible: false,
      //图片预览
      dialogImageUrl: "",
      headers: {
        Authorization: "Bearer " + getToken(),
      },

      // 性别列表
      genderTypeList: [],
      // 证件类型
      certificateTypeList: [],
      // 校验
      rules: {
        personName: [{ required: true, message: "请输入姓名" }],
        gender: [{ required: true, message: "请选择性别" }],
        certificateType: [{ required: true, message: "请选择证件类型" }],
        certificateNo: [{ required: true, message: "请输入证件号码" }],
        phoneNo: [
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/, // 正则
            message: "请输入正确的手机号码",
          },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    // 获取性别列表字典
    this.getDicts("sys_user_sex").then((res) => {
      this.genderTypeList = res.data;
    });
    // 获取证件类型
    this.getDicts("document_type").then((res) => {
      this.certificateTypeList = res.data;
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
      // 清空图片列表
      this.fileList = [];
      // 清除图片缓存
      this.$refs["pictureFrom"].clearFiles();
    },

    // 新增
    add() {
      this.open = true;
      this.type = 0;
      this.modelForm.orgIndexCode = this.orgIndexCode;
    },

    // 编辑
    edit(record) {
      console.log(record);
      this.open = true;
      this.type = 1;
      // 回显数据
      this.modelForm = { ...record };
      // 回显性别字典
      this.modelForm.gender = this.modelForm.gender.toString();
    },

    // 详情
    detail(record) {
      console.log(record);
      this.type = 2;
      this.open = true;
      // 回显数据
      this.modelForm = { ...record };
      // 回显性别字典
      this.modelForm.gender = this.modelForm.gender.toString();
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

    //获取图片的base64
    getFile(file, fileList) {
      this.getBase64(file.raw).then((res) => {
        // this.modelForm.faceData = "data:image/jpg;base64," + res.split(",")[1];
        this.modelForm.faceData = res.split(",")[1];
        console.log(this.modelForm.faceData);
      });
      // this.showCameraDetail = false;
      // this.$refs["pictureFrom"].clearFiles();
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
        this.picUri = res;
        this.picUriList = res;
      });
    },

    // 提交
    submitForm() {
      console.log(this.modelForm);
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            addPersonnlInfo(this.modelForm).then((res) => {
              if (res.code == 200) {
                this.$message.success("添加成功");
                this.$emit("refresh");
                this.close();
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            editPersonnlInfo(this.modelForm).then((res) => {
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
