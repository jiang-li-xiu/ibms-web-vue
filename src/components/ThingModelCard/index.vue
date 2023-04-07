<!--
 * @Author: Yelucc
 * @Date: 2021-06-24 10:13:51
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-29 11:36:57
 * @Description: 
-->
<template>
  <div class="card-main">
    <el-card v-if="edit" class="m20" style="width: 350px">
      <!-- 第一行 -->
      <el-row :gutter="10" slot="header">
        <el-col :span="6">
          <svg-icon
            v-if="thingModelInfo.iconFilepath"
            style="height: 60px; width: 60px"
            :icon-class="thingModelInfo.iconFilepath"
          />
          <el-image
            v-else
            style="height: 60px; width: 60px"
            :src="require('@/assets/icons/plug-in.png')"
          />
        </el-col>

        <el-col :span="18" style="padding-left: 8px">
          <div class="title" :title="thingModelInfo.name">
            {{ thingModelInfo.name }}
          </div>

          <!-- <el-row :gutter="10">
            <el-col class="ellipsis" :span="24"
              ><span
                class="k-status"
                style="color: #aaa"
                :title="thingModelInfo.id"
                >{{ thingModelInfo.id }}</span
              ></el-col
            >
          </el-row> -->
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="10" slot="header" style="margin-top: 10px">
        <el-col :span="8">
          <div style="text-align: center; color: #aaa">设备数量</div>
          <div style="text-align: center; margin-top: 10px">
            {{
              thingModelInfo.deviceCount == null
                ? 0
                : thingModelInfo.deviceCount
            }}
          </div>
        </el-col>

        <el-col :span="8">
          <div style="text-align: center; color: #aaa">状态</div>
          <div style="text-align: center; margin-top: 10px">
            <span
              class="is_status is_status_00ff00"
              v-if="thingModelInfo.isStatus == 0"
              >已启用</span
            >
            <span class="is_status is_status_ff0000" v-else>已停用</span>
          </div>
        </el-col>

        <el-col :span="8">
          <div style="text-align: center; color: #aaa">所属子系统</div>
          <div
            class="ellipsis"
            style="margin-top: 10px"
            :title="thingModelInfo.subSystemText"
          >
            {{ thingModelInfo.subSystemText }}
          </div>
        </el-col>
      </el-row>

      <!-- 按钮 -->
      <el-row :gutter="2">
        <el-col :span="4" class="icon_box">
          <em
            title="查看详情"
            class="el-icon-view icon_font cursor_pointer"
            style="color: #1890ff"
            @click="infoPage"
          ></em>
        </el-col>

        <el-col :span="2">
          <em class="rotates el-icon-minus"></em>
        </el-col>

        <el-col :span="4" class="icon_box">
          <em
            title="编辑"
            class="el-icon-edit-outline icon_font cursor_pointer"
            style="color: #1890ff"
            @click="edits"
          ></em>
        </el-col>

        <el-col :span="2">
          <em class="rotates el-icon-minus"></em>
        </el-col>

        <el-col :span="4" class="icon_box">
          <em
            class="el-icon-circle-close icon_font cursor_pointer"
            style="color: #ff4760"
            title="停用"
            v-if="thingModelInfo.isStatus == 0"
            @click="putStatus"
          >
          </em>
          <em
            class="el-icon-circle-check icon_font cursor_pointer"
            style="color: #00ff00"
            title="开启"
            v-else
            @click="putStatus"
          ></em>
        </el-col>

        <el-col :span="2">
          <em class="rotates el-icon-minus"></em>
        </el-col>

        <el-col :span="6" class="icon_box">
          <em
            title="删除"
            class="el-icon-delete icon_font cursor_pointer"
            style="color: #ff4760"
            @click="deleteThing"
          ></em>
        </el-col>
      </el-row>
    </el-card>

    <el-card v-else class="click" @click.native="titleClickHandler">
      <div class="flex align-center">
        <el-image
          style="width: 60px; height: 60px"
          :src="thingModelInfo.icon || require('@/assets/icons/plug-in.png')"
        />
        <div class="pl-20">
          <div class="title">{{ thingModelInfo.name || "物模型" }}</div>
          <div class="mb-20" style="font-size: 14px; line-height: 36px">
            {{ thingModelInfo.id }}
          </div>
        </div>
        <!-- <el-col :span="19" style="padding-left: 8px">
            <el-row :gutter="10">
              <el-col :span="24">
                <span class="title">{{ thingModelInfo.name }}</span>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="24"
                ><span class="k-status" style="color: #aaa">{{
                  thingModelInfo.id
                }}</span></el-col
              >
            </el-row>
          </el-col> -->
      </div>
    </el-card>

    <!-- 编辑面板 -->
    <div>
      <el-dialog
        title="编辑设备类型"
        :visible.sync="isEdit"
        width="30%"
        append-to-body
        @close="closes"
      >
        <el-form :model="form" ref="form" label-width="136px">
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
                style="width: 100%"
                v-model="form.iconFilepath"
                placeholder="点击选择图标"
                readonly
              >
                <svg-icon
                  v-if="form.iconFilepath"
                  slot="prefix"
                  :icon-class="form.iconFilepath"
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

          <!-- <el-form-item label="类型标识" prop="equipmentType">
            <el-input
              v-model="form.equipmentType"
              disabled
              placeholder="请输入类型标识"
            />
          </el-form-item> -->

          <el-form-item
            label="设备类型名称"
            prop="equipmentName"
            :rules="[
              {
                required: true,
                message: '请输入设备类型名称',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="form.equipmentName"
              placeholder="请输入设备类型名称"
            />
          </el-form-item>

          <el-form-item label="3d模型类型">
            <el-select
              style="width: 100%"
              v-model="form.unityType"
              placeholder="请选择3d模型类型"
              clearable
            >
              <el-option
                v-for="dict in unityTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="图片上传">
            <div>
              <el-upload
                :headers="headers"
                :action="uploadFileUrl"
                list-type="picture-card"
                :file-list="fileList"
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

          <!-- <el-form-item label="备注">
            <el-input v-model="form.remarks" placeholder="" />
          </el-form-item> -->
        </el-form>

        <div slot="footer">
          <el-button @click="isEdit = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

import {
  deleteDeviceDevicetype,
  statusUpdate,
  editDeviceDevicetype,
} from "@/api/device/deviceClasses";

// 用于图标选择
import IconSelect from "@/components/IconSelect";

export default {
  name: "ThingModelCard",
  components: { IconSelect },
  props: {
    edit: {
      type: Boolean,
      default: () => true,
    },
    thingModelInfo: {
      type: Object,
      default: () => {
        return {
          name: "海康威视摄像头",
          subsystemCode: "视频监控",
          tDeviceNum: 3,
          status: true,
          id: "Camera-A413587-01",
          icon: "",
        };
      },
    },
  },
  data() {
    return {
      isEdit: false,
      form: {
        deviceTypeId: "",
        // equipmentType: "",
        equipmentName: "",
        remarks: "",
        iconFilepath: "",
        unityType: "",
        imagesPath: "",
      },
      optionsImg: [],
      unityTypeOptions: [],

      dialogImageUrl: "",
      dialogVisible: false,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
    };
  },

  mounted() {
    this.imgData();
    // 字典
    this.getDicts("UNITY_TYPE").then((response) => {
      this.unityTypeOptions = response.data;
    });
  },

  methods: {
    // 删除
    handleRemove(file) {
      this.fileList.splice(
        this.fileList.findIndex((item) => item.uid == file.uid),
        1
      );
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
      console.log("上传成功回调:", response);
      this.fileList.push({ url: response.data.url });
    },

    // 选择图标
    selected(name) {
      this.form.iconFilepath = name;
    },
    // 图标处理
    imgData() {
      this.optionsImg = [];
      let imgName = ["video_camera", "icon-8"],
        i = 0,
        item = null;
      for (; i < imgName.length; i++) {
        item = imgName[i];
        this.optionsImg.push({
          id: i + 1,
          valueImg: require(`@/assets/images/equipmentTypeIcon/${item}.png`),
          label: item,
        });
      }
    },

    // select标签的change事件
    changeSelection(val) {
      let optionsImg = this.optionsImg,
        i = optionsImg.findIndex((item) => item.label == val);
      this.$refs["refSelect"].$el.children[0].children[0].setAttribute(
        "style",
        `background: url(${optionsImg[i].valueImg}) no-repeat; background-position: 10px center; background-size: 20px 20px; text-indent: 30px; `
      );
    },

    // 编辑面板关闭
    closes() {
      this.$refs["form"].clearValidate();
      this.$refs["form"].resetFields();
    },

    // 编辑面板提交数据
    submitForm() {
      let {
          deviceTypeId,
          // equipmentType,
          equipmentName,
          remarks,
          iconFilepath,
          unityType,
        } = this.form,
        obj = {
          deviceTypeId: deviceTypeId,
          iconFilepath,
          // deviceTypeCode: equipmentType,
          deviceTypeName: equipmentName,
          unityType,
          remarks,
          imagesPath: this.fileList
            .map((item) => {
              return item.url;
            })
            .toString(),
        };

      this.$refs.form.validate((valid) => {
        if (valid) {
          editDeviceDevicetype(obj).then((response) => {
            if (response.code == 200) {
              this.msgSuccess("修改成功");
              this.$emit("trigger", {
                type: "delete",
                id: null,
              });
              this.isEdit = !this.isEdit;
              this.$refs["form"].clearValidate();
              this.$refs["form"].resetFields();
            }
          });
        } else {
          return false;
        }
      });
    },

    // 打开编辑面板
    edits() {
      this.isEdit = !this.isEdit;
      let {
        deviceTypeId,
        deviceTypeCode,
        deviceTypeName,
        unityType,
        remarks,
        iconFilepath,
        imagesPath,
      } = this.thingModelInfo;
      this.fileList = imagesPath
        ? imagesPath.split(",").map((item) => {
            return { url: item };
          })
        : [];

      this.form.deviceTypeId = deviceTypeId;
      // this.form.equipmentType = deviceTypeCode;
      this.form.equipmentName = deviceTypeName;
      this.form.remarks = remarks;
      this.form.iconFilepath = iconFilepath;
      this.form.unityType = unityType;
      this.form.imagesPath = imagesPath;
    },

    // 修改状态
    putStatus() {
      let { deviceTypeId, isStatus } = this.thingModelInfo;
      statusUpdate({ deviceTypeId, isStatus: isStatus == 0 ? 1 : 0 }).then(
        (response) => {
          if (response.code == 200) {
            this.$emit("trigger", {
              type: "delete",
              id: null,
            });
            this.msgSuccess("修改成功");
          }
        }
      );
    },

    // 删除
    deleteThing() {
      let data = this.thingModelInfo;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDeviceDevicetype(data.deviceTypeId).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.$emit("trigger", {
              type: "delete",
              id: data.deviceTypeId,
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 详情
    infoPage() {
      let data = this.thingModelInfo;
      this.$emit("trigger", {
        type: "details",
        id: data.deviceTypeId,
      });
    },

    titleClickHandler() {
      this.$emit("titleClickHandler", this.thingModelInfo);
    },
  },
};
</script>

<style lang="scss" scoped>
.click {
  height: 139px;
  display: flex;
  align-items: center;
}
.click:hover {
  background-color: #6cd4e2;
  opacity: 0.1;
  cursor: pointer;
}
.card-main {
  /* width: 300px; */
  display: inline-block;
}

.title {
  width: 180px;
  font-size: 20px;
  font-weight: 1000;
  color: rgb(2, 167, 240);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.icon_box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon_font {
  font-size: 26px;
}

.is_status {
  color: #333;
  font-weight: 600;
}

.is_status_ff0000::before {
  content: "";
  width: 5px;
  height: 5px;
  border: 5px solid;
  border-radius: 50%;
  display: inline-block;
  color: #ff0000;
  margin-right: 5px;
}

.is_status_00ff00::before {
  content: "";
  width: 5px;
  height: 5px;
  border: 5px solid;
  border-radius: 50%;
  display: inline-block;
  color: #00ff00;
  margin-right: 5px;
}

.cursor_pointer {
  cursor: pointer;
}

.rotates {
  transform: rotate(90deg);
  font-size: 26px;
  font-weight: 300;
  color: #e6ebf5;
}

.option_box {
  display: flex;
  align-items: center;
}

.option_img {
  width: 25px;
  height: 25px;
  margin-right: 7px;
}

.v-modal {
  z-index: 1900 !important;
}
</style>
