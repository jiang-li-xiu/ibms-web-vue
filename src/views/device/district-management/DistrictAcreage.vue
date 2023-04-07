<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-08-02 12:00:30
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-13 15:11:30
-->
<template>
  <div class="districtmanagement-top">
    <el-row type="flex" class="justify-center">
      <el-col :span="4" class="flex-column-cc">
        <p>园区占地面积</p>
        <div>
          <span class="font-600">{{ greenData.totalArea }}</span>
          <span> ㎡</span>
        </div>
      </el-col>
      <el-col :span="4" class="flex-column-cc">
        <p>绿化面积</p>
        <div>
          <span class="font-600">{{ greenData.greenArea }}</span>
          <span> ㎡</span>
        </div>
      </el-col>
      <el-col :span="4" class="flex-column-cc">
        <p>绿化率</p>
        <div>
          <span class="font-600">{{ greenData.greening }}</span>
          <span> %</span>
        </div>
      </el-col>
      <el-col :span="4" class="flex-column-cc">
        <div class="el-icon-edit-outline" @click="handleEditGreen">编辑</div>
      </el-col>
    </el-row>
    <!-- 编辑绿化弹窗 -->
    <el-dialog
      title="园区面积编辑"
      :visible.sync="greenOpen"
      width="600px"
      append-to-body
    >
      <el-form
        ref="greenForm"
        :model="greenForm"
        :rules="greenRules"
        label-width="120px"
      >
        <el-form-item label="园区占地面积" prop="totalArea">
          <el-input
            v-model.number="greenForm.totalArea"
            placeholder="请输入园区占地面积"
          />
        </el-form-item>
        <el-form-item label="绿化面积" prop="greenArea">
          <el-input
            v-model.number="greenForm.greenArea"
            placeholder="请输入绿化面积"
          />
        </el-form-item>
        <el-form-item label="绿化率">
          <el-input v-model="greening" :disabled="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGreen">确 定</el-button>
        <el-button @click="cancelEditGreen">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGreening, editGreening } from "@/api/device/districtManagement";

export default {
  name: "DistrictAcreage",
  props: {},
  data() {
    return {
      // 绿化信息
      greenData: {},
      // 控制编辑绿化弹窗展示
      greenOpen: false,
      // 编辑绿化
      greenForm: {
        greeningId: null,
        totalArea: null,
        greenArea: null,
        greening: null,
      },
      //   greening: null,
      // 绿化信息验证
      greenRules: {
        totalArea: [
          { required: true, message: "请输入园区占地面积", trigger: "blur" },
          { type: "number", message: "请输入数字面积" },
        ],
        greenArea: [
          { required: true, message: "请输入绿化面积", trigger: "blur" },
          { type: "number", message: "请输入数字面积" },
        ],
      },
    };
  },
  mounted() {
    this.getGreening();
  },
  computed: {
    greening() {
      if (
        isNaN(
          parseInt(this.greenForm.greenArea) /
            parseInt(this.greenForm.totalArea)
        )
      ) {
        return "";
      } else {
        return (
          (parseInt(this.greenForm.greenArea) /
            parseInt(this.greenForm.totalArea)) *
          100
        ).toFixed(1);
      }
    },
  },
  methods: {
    // 获取面积数据
    getGreening() {
      getGreening().then((response) => {
        this.greenData = response.data;
        this.greenForm = JSON.parse(JSON.stringify(response.data));
      });
    },

    handleEditGreen() {
      this.greenOpen = true;
    },
    //提交编辑绿化后
    submitGreen() {
      this.greenForm.greening = this.greening;
      this.$refs["greenForm"].validate((valid) => {
        console.log(this.greenForm);
        if (valid) {
          editGreening(this.greenForm).then((response) => {
            console.log(response);
            this.getGreening();
            this.msgSuccess("修改成功");
            this.greenOpen = false;
            this.reset();
          });
        }
      });
    },
    // 取消编辑绿化弹窗
    cancelEditGreen() {
      this.greenOpen = false;
    },
    reset() {
      (this.greenForm = {
        greeningId: null,
        totalArea: null,
        greenArea: null,
        greening: null,
      }),
        this.resetForm("greenForm");
    },
  },
};
</script>
<style scoped lang='scss' >
.districtmanagement-top {
  background-color: #fff;
  padding: 20px;
}
.el-icon-edit-outline {
  cursor: pointer;
  color: #0dabf1;
}
.font-600 {
  font-weight: 600;
}
</style>