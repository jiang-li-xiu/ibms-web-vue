<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-26 10:36:36
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-27 14:34:56
-->
<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="550px" @close="closed">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="消息标题：" prop="programName">
          <el-input v-model="form.programName" placeholder="请输入消息标题" clearable size="small" />
        </el-form-item>
        <el-form-item label="消息内容：" prop="programDesc">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入消息内容"
            v-model="form.programDesc"></el-input>
        </el-form-item>
        <el-form-item label="图片：" prop="imgUrls">
          <el-upload class="avatar-uploader" ref="otherLicense" action :auto-upload="false"
            :on-preview="handlePicPreview" :on-remove="handleRemove" :before-remove="beforeRemove" :file-list="fileList"
            :on-change="otherSectionFile" list-type="picture-card" multiple>
            <em class="el-icon-plus avatar-uploader-icon"></em>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="determineMsg" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 大图展示 -->
    <el-dialog :visible.sync="dialogImage">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import {
  uploadProgramImg,
  addProgramMsg,
  updateProgramMsg,
} from "@/api/subsystem/information-release/information-release";
export default {
  name: "EditDialog",
  components: {},
  props: {},
  data() {
    return {
      title: "",
      dialogVisible: false, // 添加修改弹框
      form: {
        id: "",
        imgUrls: "", //图片地址
        programDesc: "", //消息描述
        programName: "", //消息名称
      }, //添加修改消息对象
      rules: {
        programName: [
          { required: true, message: "消息标题不能为空", trigger: "blur" },
        ],
        programDesc: [
          { required: true, message: "消息内容不能为空", trigger: "blur" },
        ],
      },
      fileList: [], //图片数组
      dialogImageUrl: "", //图片临时地址
      dialogImage: false, // 大图弹框
    };
  },
  created() { },
  methods: {
    //点击 添加
    add() {
      
      this.dialogVisible = true;
    },
    //点击 修改
    edit(row) {
      console.log(row.imgUrls);
      if (row.imgUrls) {
        console.log("row.imgUrls", row.imgUrls);
        let imgsJSON = JSON.parse(row.imgUrls);
        console.log(" JSON.parse(row.imgUrls)", imgsJSON);
        for (let item of imgsJSON) {
          this.fileList.push({ url: item });
        }
      }
      this.dialogVisible = true;
    },

    // 表单重置
    reset() {
      this.form = {
        id: "",
        imgUrls: "", //图片地址
        programDesc: "", //消息描述
        programName: "", //消息名称
      };
      this.$refs.otherLicense.clearFiles();
      this.resetForm("form");
    },
    //确定添加||修改
    determineMsg() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let imgList = this.fileList.map((item) => item.url);
          let data = {
            imgUrls: JSON.stringify(imgList), //图片地址
            programDesc: this.form.programDesc, //消息描述
            programName: this.form.programName, //消息名称
          };
          let funMsg;
          if (this.form.id) {
            data.id = this.form.id;
            funMsg = updateProgramMsg(data);
          } else {
            funMsg = addProgramMsg(data);
          }
          funMsg.then((res) => {
              this.$message.success(res.message);
              this.$emit("ok");
              this.dialogVisible = false;
          });
        }
      });
    },


    //上传列表点击查看图片
    handlePicPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImage = true;
    },
    //确定删除上传图片url
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    //监听删除上传图片
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除图片？`);
    },
    //上传图片
    otherSectionFile(file) {
      console.log(file);
      let _this = this;
      const typeArr = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
      const isJPG = typeArr.indexOf(file.raw.type) !== -1;
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error("只能是图片!");
        this.$refs.otherLicense.clearFiles();
        return;
      }
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
        this.$refs.otherLicense.clearFiles();
        return;
      }
      // FormData 对象
      var formData = new FormData();
      // 文件对象
      formData.append("files", file.raw);
      uploadProgramImg(formData).then((res) => {
        if (res.code === 200) {
          _this.fileList.push({ url: res.data[0].url });
        }
      });
    },
    closed(){
      this.fileList = [];
      this.reset();
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
