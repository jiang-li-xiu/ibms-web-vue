<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-05-27 17:09:20
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-06-02 17:49:03
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
      <el-form-item label="区域名称" prop="regionName">
        <el-input v-model="formData.regionName" placeholder="请输入区域名称" />
      </el-form-item>
      <el-form-item label="区域编码" prop="regionCode">
        <el-input v-model="formData.regionCode" placeholder="请输入区域编码" />
      </el-form-item>
      <el-form-item label="父级区域" prop="fid">
        <span>{{ formData.fname }}</span>
      </el-form-item>
      <!-- <el-form-item label="所属楼层" prop="regionFloor">
          <el-select v-model="formData.regionFloor" placeholder="请选择">
            <el-option label="item.label" value="item.value"></el-option>
          </el-select>
        </el-form-item>-->
      <el-form-item label="区域类型" prop="regionType">
        <el-select
          v-model="formData.regionType"
          placeholder="请选择"
          :loading="regionTypes.length === 0"
          :disabled="title == '编辑' ? true : false"
        >
          <el-option
            v-for="item in regionTypes"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联子系统" prop="subSytemCodes">
        <el-select
          v-model="formData.subSytemCodes"
          multiple
          placeholder="请选择"
          :loading="subSystems.length === 0"
        >
          <el-option
            v-for="item in subSystems"
            :key="item.id"
            :label="item.title"
            :value="item.code"
          ></el-option>
        </el-select>
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
  getRegionDetails,
  getSubSystemList,
  updateRegionInfo,
  addRegion,
} from "@/api/system/regionalManagement.js";
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
      formData: {},
      // 验证表单
      rules: {
        regionName: [
          { required: true, message: "请输入区域名称", trigger: "blur" },
        ],
        fid: [{ required: true, message: "请选择父级区域", trigger: "blur" }],
        regionType: [
          { required: true, message: "请选择区域类型", trigger: "blur" },
        ],
      },
      // 当前选择的父级区域
      parentRegion: {},
      // 区域类型
      regionTypes: [],
      // 子系统列表
      subSystems: [],
    };
  },
  created() {},
  methods: {
    edit(data) {
      const {
        regionName,
        regionCode,
        regionType,
        regionId,
        label,
        fid,
        subSytemCodes,
        fname,
      } = data;
      this.formData = {
        label,
        regionName,
        regionType,
        fid,
        regionCode,
        regionId,
        fname,
        subSytemCodes: subSytemCodes,
      };
      // 获取区域类型字典
      this.getRegionTypeDicts();
      // 获取子系统列表
      this.getSubSystems();
      this.getRegionDetailsData(data);
    },
    add(data) {
      this.resetForm("formData");
      // 添加父级区域信息
      this.formData = { fname: data.fname, fid: data.fid };
      // 获取区域管理字典
      this.getRegionTypeDicts();
      // 获取子系统列表
      this.getSubSystems();
    },
    // 获取区域详情数据
    async getRegionDetailsData(res) {
      const { data } = await getRegionDetails(res.regionId);
      this.formData = data
    },
    // 确认修改区域
    handleUpdateRegion() {
      this.$refs.form.validate((valid) => {
        if (this.title == "编辑") {
          if (valid) {
            updateRegionInfo(this.formData).then((res) => {
              this.$message.success("修改成功");
              // 关闭弹窗
              this.dialogVisible = false;
              // 刷新树形数据
              bus.$emit("refreshTree", this.formData.regionId);
              bus.$emit("refreshTreeData", this.formData);
              this.$emit("getData",this.formData);
            });
          }
        } else if (this.title == "新增") {
          if (valid) {
            addRegion(this.formData).then((res) => {
              this.$message.success("添加成功");
              // 关闭弹窗
              this.dialogVisible = false;
              // 刷新数据
              bus.$emit("refresh");
              this.$emit("getDataAdd",this.formData.fid)
            });
          }
        }
      });
    },
    // 获取区域类型字典
    getRegionTypeDicts() {
      this.getDicts("region_type").then((res) => {
        this.regionTypes = res.data;
      });
    },
    // 关闭弹窗回调
    handleDialogClose() {
      this.dialogVisible = false;
      // 重置表单
      this.$refs.form.resetFields();
      this.formData = {};
    },
    // 获取子系统列表
    async getSubSystems() {
      const { data } = await getSubSystemList();
      this.subSystems = data;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
