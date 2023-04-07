<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-03-14 11:30:51
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 16:14:42
-->
<template>
  <div class="template-box">
    <!-- 检索 -->
    <el-form :model="queryParams" :rules="queryFormRules" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="queryParams.deviceName" placeholder="请输入菜单名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="设备状态" prop="isStatus">
        <el-select v-model="queryParams.isStatus" placeholder="请选择设备状态" clearable>
          <el-option v-for="item in ibmsDeviceState" :label="item.dictLabel" :value="item.dictValue"
            :key="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 列表 -->
    <el-table border v-loading="loading" :row-key="rowKey" :data="tableList" :height="tableHeight"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="设备编码" align="center" prop="deviceCode" /> -->
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备位置" align="center" prop="regionName" />
      <el-table-column label="设备状态" align="center" prop="isStatus">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
          <el-tag type="danger" v-else>离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template id="handle" slot-scope="scope">
          <el-button v-if="scope.row.armStatus == 0" type="primary" icon="el-icon-connection"
            @click="handleDefense(scope.row.deviceCode, 1)" :loading="btnLoading">布防</el-button>
          <el-button v-else type="danger" icon="el-icon-close" @click="handleDefense(scope.row.deviceCode, 0)"
            :loading="btnLoading">撤防</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { TableListMixin } from "@/mixins/TableListMixin";
import { getDeviceList, postDefense } from "@/api/subsystem/intrusion-alarm";

export default {
  mixins: [TableListMixin],
  name: "InvasionEquipment",
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "deviceId",
      // 表格自适应高度
      tableHeight: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isStatus: null,
        deviceName: "",
        regionId: 0,
      },
      // 检索验证
      queryFormRules: {
        deviceName: [
          { validator: this.validateQueryFormRules, trigger: "change" },
        ],
      },
      // 字典
      ibmsDeviceState: [],
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getDeviceList,
      },
      btnLoading: false,
    };
  },
  created() {
    // 字典
    this.getDicts("ibms_device_state").then((response) => {
      this.ibmsDeviceState = response.data;
    });
    // 获取表格高度
    this.getHeight();
    // 监听页面变化
    window.addEventListener("resize", this.getHeight);
  },
  methods: {
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 270;
    },
    handleExport() {
      this.download(
        "/intrusion/intrusion/exportDeviceList",
        {
          ids: this.selectedRowKeys,
        },
        "入侵报警设备.xlsx"
      );
    },
    // 布撤防
    handleDefense(deviceCode, i) {
      this.btnLoading = true
      postDefense({ deviceCode: deviceCode, operate: i }).then((response) => {
        let that= this
        let timer = setTimeout(() => {
          that.$message.success(`${i == 1 ? "布防" : "撤防"}成功`);
          that.btnLoading = false
          that.getList();
          clearTimeout(timer)
        }, 2000)
      });
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  watch: {
    treeNode: {
      handler(newVal) {
        this.queryParams.regionId = newVal.regionId;
        this.tableTitle = newVal.regionName;
        this.getList();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.template-box {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>