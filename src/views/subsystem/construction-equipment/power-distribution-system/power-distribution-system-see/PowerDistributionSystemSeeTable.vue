<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-10-08 15:43:17
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-24 17:17:41
-->
<template>
  <el-card class="min-height-124">
    <div class="table-title">{{ tableTitle }}</div>
    <!-- 查询选项 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      :rules="queryFormRules"
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
      <el-form-item label=" ">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          :disabled="false"
          @click="exportFil"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->
    <!-- table表格 -->
    <el-table v-loading="loading" :data="tableList" :row-key="rowKey" border>
      <!-- <el-table-column label="设备ID" align="center" prop="deviceCode" show-overflow-tooltip /> -->
      <!-- <el-table-column
        label="设备编码"
        align="center"
        prop="deviceCode"
        show-overflow-tooltip
      /> -->
      <el-table-column
        label="设备名称"
        align="center"
        prop="deviceName"
        show-overflow-tooltip
      />
      <el-table-column
        label="设备类型"
        align="center"
        prop="deviceTypeName"
        show-overflow-tooltip
      />
      <el-table-column
        label="设备位置"
        align="center"
        prop="regionName"
        show-overflow-tooltip
      />
      <el-table-column label="在线状态" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
          <el-tag type="danger" v-else>离线</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-view"
            @click="handleDetail(scope.row.deviceCode)"
            >查看详情</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 详情组件 -->
    <distribution-detail ref="modelForm"></distribution-detail>
  </el-card>
</template>

<script>
import { getTableList } from "@/api/subsystem/construction-equipment/distribution/distribution-equipment";

import { TableListMixin } from "@/mixins/TableListMixin";
import DistributionDetail from "./DistributionDetail.vue";

export default {
  mixins: [TableListMixin],
  components: { DistributionDetail },
  props:{
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "deviceId",
      tableTitle: "全部", //标题
      queryParams: {
        regionId: 0,
        pageNum: 1,
        pageSize: 10,
        deviceName: "", // 设备名称
        isStatus: "", // 设备状态(0开启，1离线)
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
        getTableList: getTableList,
      },
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    // 导出
    exportFil() {},
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

<style lang="scss">
</style>
