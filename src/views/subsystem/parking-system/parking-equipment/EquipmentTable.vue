<!--
 * @Author: your name
 * @Date: 2021-09-08 19:10:41
 * @LastEditTime: 2022-05-17 16:02:41
 * @LastEditors: PengXuanwei
 * @Description: In User Settings Edit
 * @FilePath: \ibms-web-vue\src\views\subsystem\parking-system\parking-equipment\assembly-table.vue
-->
<template>
  <el-card class="min-height-124">
    <div class="table-title">{{ tableTitle }}</div>
    <!-- 查询选项 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      :rules="queryFormRules"
      :inline="true"
      label-width="68px"
      v-show="showSearch"
    >
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="设备状态" prop="isStatus">
        <el-select
          v-model="queryParams.isStatus"
          placeholder="请选择设备状态"
          clearable
        >
          <el-option label="在线" value="0" />
          <el-option label="离线" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 导出 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click="bindingClick" icon="el-icon-download">
          导出
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
      :row-key="rowKey"
      :data="tableList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <!-- <el-table-column label="设备编码" align="center" prop="deviceCode" /> -->
      <el-table-column label="设备类型" align="center" prop="deviceTypeName" />
      <el-table-column label="设备位置" align="center" prop="regionName" />
      <!-- <el-table-column label="在线状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
          <el-tag type="danger" v-else>离线</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column
        label="操作"
        align="center"
        width="400"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-circle-check"
            @click="openOff(scope.row, 1)"
            >开闸</el-button
          >

          <el-button
            type="danger"
            icon="el-icon-circle-close"
            @click="openOff(scope.row, 2)"
            >关闸</el-button
          >

          <el-button icon="el-icon-view" @click="handleDetail(scope.row)" plain
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 查看详情-弹框 -->
    <equipment-detail ref="modelForm"></equipment-detail>
  </el-card>
</template>
<script>
import {
  getParkinglotDeviceinfo,
  putParkLot,
} from "@/api/subsystem/parking-system/parking-system.js";
import { TableListMixin } from "@/mixins/TableListMixin";

import EquipmentDetail from "./EquipmentDetail";

export default {
  mixins: [TableListMixin],
  components: {
    EquipmentDetail,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "deviceId",
      tableTitle: "全部", //标题
      // 请求列表参数
      queryParams: {
        deviceName: "",
        isStatus: "",
        regionId: 0, //区域id
        systemId: "sub-parkinglot",
        pageNum: 1,
        pageSize: 10,
      },
      // 检索验证
      queryFormRules: {
        deviceName: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getParkinglotDeviceinfo,
      },
    };
  },
  created() {},
  methods: {
    //导出
    bindingClick() {
      this.download(
        "/device/deviceinfo/exportBy",
        {
          ids: this.selectedRowKeys,
          subSystem: "sub-parkinglot",
          subPlug: "sub-parkinglot-jielink",
        },
        "停车场设备管理.xlsx"
      );
    },
    // 操作按钮
    openOff(row, i) {
      this.$confirm("是否执行此操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          putParkLot({ deviceId: row.deviceCode, openModel: i }).then(
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
