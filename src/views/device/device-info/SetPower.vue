<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-06-15 14:42:18
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-06-15 16:29:09
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="600px"
    append-to-body
  >
    <el-form ref="modelForm" :model="modelForm" :rules="rules">
      <el-form-item label="功率（W）" prop="planePower">
        <el-input-number
          v-model="modelForm.planePower"
          controls-position="right"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="寿命（年）" prop="planeLife">
        <el-input-number
          v-model="modelForm.planeLife"
          controls-position="right"
          :min="1"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="开始使用时间" prop="installTime">
        <el-date-picker
          v-model="modelForm.installTime"
          type="date"
          placeholder="请选择开始日期"
          value-format="yyyy-MM-dd"
          clearable
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { setPower } from "@/api/device/deviceInfo";
export default {
  name: "SetPower",
  props: {},
  data() {
    return {
      // 弹窗标题
      title: "",
      // 控制弹窗显隐
      visible: false,
      // 表单参数
      modelForm: {},
      // 表单校验
      rules: {
        planePower: [
          { required: true, message: "请输入功率", trigger: "blur" },
        ],
        planeLife: [
          { required: true, message: "请输入寿命", trigger: "blur" },
        ],
        installTime: [
          { required: true, message: "请选择开始使用", trigger: "blur" },
        ],
      },
      //   弹窗数据加载动画
      spinning: false,
    };
  },
  methods: {
    /** 点击新增触发 */
    add(ids) {
      // console.log(ids);
      this.title = "批量添加";
      this.refresh();
      this.modelForm.deviceIds = ids;
      this.visible = true;
    },
    /** 触发编辑功能 */
    edit(record) {
      this.title = "修改";
      this.spinning = true;
      getListDetail(record.postId).then((response) => {
        this.modelForm = { ...response.data };
        this.spinning = false;
      });
      this.visible = true;
    },
    /** 重置表单 */
    refresh() {
      this.modelForm = {
        deviceIds: null,
        planePower: null,
        planeLife: null,
        installTime: null,
      };
    },
    /** 弹窗提交 */
    handleSubmit() {
      let that = this;
      that.$refs["modelForm"].validate((valid) => {
        if (valid) {
          console.log(this.modelForm);
            setPower(that.modelForm).then((response) => {
              console.log(response);

              that.msgSuccess(response.message);
              that.visible = false;
              that.$emit("ok");
            });
        }
      });
    },
  },
};
</script>
<style scoped lang='scss' >
</style>