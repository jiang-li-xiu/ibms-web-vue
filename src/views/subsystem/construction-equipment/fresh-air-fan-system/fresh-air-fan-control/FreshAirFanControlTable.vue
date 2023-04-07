<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-10-18 15:07:02
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-24 15:50:31
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
    <!-- <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->
    <!-- table表格 -->
    <el-table v-loading="loading" :data="tableList" :row-key="rowKey" border>
      <!-- <el-table-column label="设备ID" align="center" prop="deviceCode" /> -->
      <el-table-column
        align="center"
        label="设备名称"
        prop="deviceName"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        align="center"
        label="设备ID"
        prop="deviceCode"
        show-overflow-tooltip
      /> -->
      <!-- <el-table-column
        align="center"
        label="设备类型"
        prop="deviceTypeName"
        show-overflow-tooltip
      /> -->
      <!-- <el-table-column
        align="center"
        label="设备位置"
        prop="deviceName"
        show-overflow-tooltip
      /> -->
      <el-table-column align="center" label="在线状态" prop="isStatus">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
          <el-tag type="danger" v-else>离线</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        align="center"
        label="温度"
        prop="deviceName"
        show-overflow-tooltip
      /> -->
      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-view"
            @click="handleDetail(scope.row.deviceCode)"
          >
            详情
          </el-button>
          <el-button
            icon="el-icon-coordinate"
            @click="handelControl(scope.row.deviceCode)"
            >控制</el-button
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

    <!-- 详情组件 -->
    <new-fan-detail ref="detail"></new-fan-detail>
    <!-- 控制组件 -->
    <new-fan-control ref="control" @ok="modalFormOk"></new-fan-control>
  </el-card>
</template>

<script>
import { getTableList } from "@/api/subsystem/construction-equipment/new-fan/new-fan-equipment";

import { TableListMixin } from "@/mixins/TableListMixin";

import NewFanDetail from "./NewFanDetail.vue";
import NewFanControl from "./NewFanControl.vue";

export default {
  mixins: [TableListMixin],
  props: {
    treeNode: Object,
  },
  components: { NewFanDetail, NewFanControl },
  data() {
    return {
      rowKey: "deviceId",
      tableTitle: "全部", //标题
      fromRegion: "", //弹框-下拉选择
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
    // 查看详情
    handleDetail(id) {
      this.$refs.detail.open(id);
    },
    // 查看控制
    handelControl(id) {
      this.$refs.control.open(id);
    },
  },
  watch: {
    treeNode: {
      handler(newVal) {
        this.queryParams.regionId = newVal.regionId
        this.tableTitle = newVal.regionName
        this.getList()
      },
    },
  },
};
</script>

<style lang="scss">
/* 开关 */
.state-switch {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.state-switch > div:last-child {
  margin-top: 10px;
}
.switchStyle {
  margin-top: 0 !important;
}
.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}

.switchStyle .el-switch__label--left {
  z-index: 9;
  left: 6px;
}

.switchStyle .el-switch__label--right {
  z-index: 9;
  left: -14px;
}

.switchStyle .el-switch__label.is-active {
  display: block;
}

.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 70px !important;
}
</style>
