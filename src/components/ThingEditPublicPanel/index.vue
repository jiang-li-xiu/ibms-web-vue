<!--
 * @Author: MJ
 * @Date: 2021-08-13 10:26:15
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-07 14:37:51
 * @Description: 
-->
<template>
  <div>
    <el-form :model="formEdit" ref="formEdit" label-width="136px">
      <el-form-item label="图标">
        <el-select
          style="width: 100%"
          v-model="formEdit.iconFilepath"
          placeholder="请选择图标"
          @change="changeSelection"
          ref="refSelect"
        >
          <el-option
            v-for="item in optionsImg"
            :key="item.id"
            :value="item.label"
          >
            <div style="display: flex; align-items: center">
              <el-image
                style="width: 20px; height: 20px; margin-right: 7px"
                :src="item.valueImg"
              ></el-image>
              <span v-text="item.label"></span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="设备标识" prop="deviceTypeCode">
        <el-input
          v-model="formEdit.deviceTypeCode"
          disabled
          placeholder="请输入设备标识"
        />
      </el-form-item>

      <el-form-item
        label="设备类型名称"
        prop="deviceTypeName"
        :rules="[
          {
            required: true,
            message: '请输入设备类型名称',
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model="formEdit.deviceTypeName"
          placeholder="请输入设备类型名称"
        />
      </el-form-item>

      <el-form-item label="备注" prop="remarks">
        <el-input v-model="formEdit.remarks" placeholder="" />
      </el-form-item>
    </el-form>

    <div style="display: flex; justify-content: flex-end; align-items: center">
      <el-button @click="submitForm(0)">取 消</el-button>
      <el-button type="primary" @click="submitForm(1)">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { editDeviceDevicetype } from "@/api/device/deviceClasses";

export default {
  name: "ThingEditPublicPanel",
  props: {
    editData: {
      type: Object,
      default() {
        return {
          deviceTypeId: null,
          iconFilepath: null,
          deviceTypeCode: null,
          deviceTypeName: null,
          remarks: null,
        };
      },
    },
  },
  data() {
    return {
      formEdit: {
        deviceTypeId: null,
        iconFilepath: null,
        deviceTypeCode: null,
        deviceTypeName: null,
        remarks: null,
      },
      optionsImg: [],
    };
  },

  watch: {
    editData: {
      handler() {
        // 图标处理
        this.imgData();
        let {
          deviceTypeId,
          iconFilepath,
          deviceTypeCode,
          deviceTypeName,
          remarks,
        } = this.editData;
        this.formEdit = {
          deviceTypeId,
          iconFilepath,
          deviceTypeCode,
          deviceTypeName,
          remarks,
        };
      },
    },
  },

  created() {
    // 图标处理
    this.imgData();
    let {
      deviceTypeId,
      iconFilepath,
      deviceTypeCode,
      deviceTypeName,
      remarks,
    } = this.editData;
    this.formEdit = {
      deviceTypeId,
      iconFilepath,
      deviceTypeCode,
      deviceTypeName,
      remarks,
    };
    this.$nextTick(() => {
      this.changeSelection(iconFilepath);
    });
  },

  methods: {
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

    // 修改提交
    submitForm(e = 0) {
      if (e == 0) {
        this.formEdit = {};
        this.$emit("thingEditPublicPanel", { type: "editCancel" });
        return false;
      }

      this.$refs.formEdit.validate((valid) => {
        if (valid) {
          editDeviceDevicetype(this.formEdit).then((response) => {
            if (response.code == 200) {
              this.msgSuccess("修改成功");
              this.formEdit = {};
              this.$emit("thingEditPublicPanel", { type: "editDetermine" });
              this.isEdit = !this.isEdit;
            }
          });
        }
      });
    },
  },
};
</script>

<style  lang="scss" scoped>
</style>
