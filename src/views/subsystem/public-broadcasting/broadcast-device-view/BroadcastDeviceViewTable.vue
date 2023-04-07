<!--
 * @Author: MJ
 * @Date: 2021-09-15 16:36:41
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 16:50:14
 * @Description: 
-->
<template>
  <div class="broadcast-device-view-card">
    <el-form :inline="true" :model="queryParams" :rules="queryFormRules" ref="queryForm" v-show="showSearch">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable @keyup.enter.native="handleQuery">
        </el-input>
      </el-form-item>

      <el-form-item label="设备状态" prop="isStatus">
        <el-select v-model="queryParams.isStatus" placeholder="请选择设备状态" clearable>
          <el-option label="在线" value="0"></el-option>
          <el-option label="离线" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleQuery" icon="el-icon-search">查询</el-button>
        <el-button @click="resetQuery" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click="exportS" icon="el-icon-download">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table :height="tableHeight" v-loading="loading" :row-key="rowKey" :data="tableList" border
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" prop="deviceName" label="设备名称" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column align="center" prop="deviceCode" label="设备ID" show-overflow-tooltip>
      </el-table-column> -->
      <el-table-column align="center" prop="deviceTypeName" label="设备类型" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" prop="regionName" label="设备位置" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" label="运行状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isStatus == 0">运行</el-tag>
          <el-tag type="danger" v-else>停止</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="在线状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
          <el-tag type="danger" v-else>离线</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-view" @click.stop="handleDetail(scope.row)" plain>详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 查看详情-弹框 -->
    <brodcast-device-view-detail ref="modelForm"></brodcast-device-view-detail>
  </div>
</template>

<script>
import { getEquipmentTable } from "@/api/subsystem/public-broadcasting/index";
import { TableListMixin } from "@/mixins/TableListMixin";
import BrodcastDeviceViewDetail from "./BrodcastDeviceViewDetail";

export default {
  mixins: [TableListMixin],
  components: {
    BrodcastDeviceViewDetail,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "deviceId",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // 设备名称
        deviceName: "",
        // 设备状态
        isStatus: "",
        // 区域 ID
        regionId: "",
      },
      // 检索验证
      queryFormRules: {
        // deviceName: [
        //   {
        //     validator: this.validateQueryFormRules,
        //     trigger: ["blur", "change"],
        //   },
        // ],
      },
      tableHeight: 0,
      // 接口集合
      interface: {
        getTableList: getEquipmentTable,
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight());
  },

  methods: {
    // 获取 table 表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 390;
    },

    // 导出
    exportS() {
      if (this.selectedRowKeys.length > 0) {
        this.download(
          "/broadcast/broadcast/export",
          {
            ids: this.selectedRowKeys,
          },
          "广播设备查看.xlsx"
        );
      } else {
        this.$message({
          message: "由于记录数据过大，请选择需要导出的数据",
          type: "warning",
        });
      }
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight());
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
.broadcast-device-view-card {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>
