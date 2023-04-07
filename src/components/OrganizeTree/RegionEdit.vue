<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-05-27 17:09:20
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-23 08:42:35
-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    width="30%"
    center
    @close="handleDialogClose"
  >
    <el-form
      style="width: 60%; margin: 0 auto"
      ref="form"
      :model="formData"
      label-suffix="："
      label-width="110px"
      :rules="rules"
    >
      <el-form-item label="组织名称" prop="orgName">
        <el-input v-model="formData.orgName" placeholder="请输入组织名称" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      <el-button size="mini" type="primary" @click="handleUpdateRegion"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>
<script>
import {
  addOrganization,
  EditOrganization,
} from "@/api/system/organizationManagement.js";
import bus from "@/utils/bus.js";

export default {
  name: "RegionEdit",
  components: {},
  props: {
    treeData: Object,
  },
  data() {
    return {
      title: "",
      // 弹窗开关
      dialogVisible: false,
      // 表单参数
      formData: {
        parentIndexCode: "",
        orgName: "", //组织名称
      },
      // 验证表单
      rules: {
        orgName: [
          { required: true, message: "请输入组织名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    edit(data) {
      console.log(data);
      this.formData = {
        label: data.label,
        orgName: data.name,
        parentIndexCode: data.id,
      };
    },
    add(data) {
      console.log(data);
      // 组织的id
      this.formData.parentIndexCode = data.id;
      this.resetForm("formData");
      // 添加父级区域信息
      this.formData = { orgName: data.orgName, parentIndexCode: data.id };
    },

    // 确认修改区域
    handleUpdateRegion() {
      console.log(this.formData);
      this.$refs.form.validate((valid) => {
        if (this.title == "编辑") {
          if (valid) {
            const data = {
              orgName:this.formData.orgName,
              orgIndexCode:this.formData.parentIndexCode
            }
            console.log(data);
            EditOrganization(data).then((res) => {
              console.log(res);
              this.$message.success("修改成功");
              // 关闭弹窗
              this.dialogVisible = false;
              // 刷新树形数据
              bus.$emit("refreshTree", this.formData.regionId);
              bus.$emit("refreshTreeData", this.formData);
              this.$emit("getData", this.formData);
            });
          }
        } else if (this.title == "新增") {
          if (valid) {
            addOrganization(this.formData).then((res) => {
              this.$message.success("添加成功");
              // 关闭弹窗
              this.dialogVisible = false;
              // 刷新数据
              bus.$emit("refresh");
              this.$emit("getDataAdd", this.formData.fid);
            });
          }
        }
      });
    },

    // 关闭弹窗回调
    handleDialogClose() {
      this.dialogVisible = false;
      // 重置表单
      this.$refs.form.resetFields();
      this.formData = {};
    },
  },
};
</script>
<style lang="scss" scoped></style>
