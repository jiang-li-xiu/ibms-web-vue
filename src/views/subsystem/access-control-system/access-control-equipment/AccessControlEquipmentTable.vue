<!--
 * @Author: MJ
 * @Date: 2021-09-09 17:57:12
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-19 11:39:38
 * @Description: 
-->
<template>
  <el-card class="min-height-124">
    <!-- 标题 -->
    <div class="table-title">{{ tableTitle }}</div>

    <!-- 查询选项 -->
    <el-form
      :inline="true"
      :model="queryParams"
      ref="queryForm"
      :rules="queryFormRules"
      v-show="showSearch"
    >
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        ></el-input>
      </el-form-item>

      <el-form-item label="设备状态" prop="isStatus">
        <el-select
          v-model="queryParams.isStatus"
          placeholder="请选择设备状态"
          clearable
        >
          <el-option
            v-for="item in ibmsDeviceState"
            :label="item.dictLabel"
            :value="item.dictValue"
            :key="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          :disabled="false"
          @click="exportFil"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="false" @click="print" icon="el-icon-printer">
          打印
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- table表格 -->
    <el-table
      v-loading="loading"
      :data="tableList"
      :row-key="rowKey"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column
        align="center"
        label="设备编码"
        prop="deviceCode"
        show-overflow-tooltip
      /> -->
      <el-table-column
        align="center"
        label="设备名称"
        prop="deviceName"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="设备类型"
        prop="deviceTypeName"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="设备位置"
        prop="regionName"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="运行状态" prop="isStatus">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isStatus == 0">运行</el-tag>
          <el-tag type="danger" v-else>停止</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="在线状态" prop="isStatus">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
          <el-tag type="danger" v-else>离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button type="primary" icon="" @click="openOff(scope.row, 1)"
            >开门</el-button
          >
          <el-button type="danger" @click="openOff(scope.row, 2)"
            >关门</el-button
          >
          <el-button type="info" @click="openOff(scope.row, 3)"
            >常开门</el-button
          >
          <el-button type="warning" @click="openOff(scope.row, 4)"
            >常关门</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </el-card>
</template>
<script>
import {
  getTableList,
  putAccessDevice,
  exportDevice,
} from "@/api/subsystem/access-control-system/accessControlEquipment.js";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  name: "AccessControlEquipmentTable",
  mixins: [TableListMixin],
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "deviceId",
      tableTitle: "全部", //标题
      // 请求列表参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // 设备名称
        deviceName: "",
        isStatus: "",
        // plugId: "sub-entranceguard-hikvision",
        regionId: 0,
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
      // 字典
      ibmsDeviceState: [],
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getTableList,
      },
    };
  },
  created() {
    // 字典
    this.getDicts("ibms_device_state").then((response) => {
      this.ibmsDeviceState = response.data;
    });
  },

  methods: {
    // 操作按钮
    openOff(row, i) {
      this.$confirm("是否执行此操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          putAccessDevice({ deviceCode: row.deviceCode, openModel: i }).then(
            (response) => {
              this.$message({
                type: "success",
                message: "操作成功",
              });
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    // 导出
    exportFil() {
      this.download(
        "/access/device/export",
        {
          ids: this.selectedRowKeys,
        },
        "门禁设备管理.xlsx"
      );
    },
    // 打印
    print() {
      let data;
      if (this.selection.length) {
        data = this.selection.map((item) => {
          item.statusTest = item.isStatus == 0 ? "在线" : "离线";
          return item;
        });
      } else {
        data = this.tableList.map((item) => {
          item.statusTest = item.isStatus == 0 ? "在线" : "离线";
          return item;
        });
      }

      printJS({
        printable: data,
        properties: [
          { field: "deviceCode", displayName: "设备ID" },
          { field: "deviceName", displayName: "设备名称" },
          { field: "deviceTypeName", displayName: "设备类型" },
          { field: "regionName", displayName: "设备位置" },
          { field: "statusTest", displayName: "设备状态" },
        ],
        type: "json",
        gridStyle: "border: 1px solid #3971A5; text-align: center",
        gridHeaderStyle: "border: 1px solid #3971A5;",
        scanStyles: false, // 不适用默认样式
        repeatTableHeader: false, // 打印json表头只显示在第一页
        style: "@page{size: auto; margin: 0cm 1cm 0cm 1cm;}", // 去除页眉页脚
        // scanStyles: false,
      });
    },

    // 重置
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        deviceName: "",
        isStatus: "",
        // plugId: "sub-entranceguard-jielink",
        regionId: this.queryParams.regionId,
      };
      this.getList();
    },
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
</style>
