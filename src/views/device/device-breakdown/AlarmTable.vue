<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-06-09 11:00:20
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-06-15 18:16:03
-->
<template>
  <div class="assembly-table-main">
    <!-- 查询选项 -->
    <el-form
      :inline="true"
      :model="queryParams"
      ref="queryForm"
      :rules="queryFormRules"
      v-show="showSearch"
    >
      <el-form-item label="告警名称" prop="alarmName">
        <el-input
          v-model="queryParams.alarmName"
          placeholder="请输入告警名称"
          clearable
          @keyup.enter.native="handleQuery"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="设备状态" prop="isStatus">
        <el-select
          v-model="queryParams.isStatus"
          placeholder="请选择设备状态"
          clearable
          filterable
        >
          <el-option label="已启用" value="1"></el-option>
          <el-option label="已停用" value="0"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="告警等级" prop="alarmLevel">
        <el-select
          v-model="queryParams.alarmLevel"
          placeholder="请选择告警等级"
          clearable
          filterable
        >
          <el-option label="严重" value="1"></el-option>
          <el-option label="警告" value="2"></el-option>
          <el-option label="提醒" value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="处理状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择处理状态"
          clearable
          filterable
        >
          <el-option label="未处理" value="0"></el-option>
          <el-option label="处理中" value="1"></el-option>
          <el-option label="已处理" value="2"></el-option>
          <el-option label="已解决" value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- table表格 -->
    <el-table
      v-loading="loading"
      :data="tableList"
      :row-key="rowKey"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        align="center"
        label="告警名称"
        prop="alarmName"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="设备类型"
        prop="deviceTypeName"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="告警等级" prop="alarmLevel">
        <template slot-scope="scope">
          <div v-if="scope.row.alarmLevel == 1">严重</div>
          <div v-if="scope.row.alarmLevel == 2">警告</div>
          <div v-if="scope.row.alarmLevel == 3">提醒</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="告警区域"
        prop="regionName"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="设备名称"
        prop="deviceName"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="发生时间"
        prop="alarmTime"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="处理状态" prop="status">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.status == 0">未处理</el-tag>
          <el-tag type="primary" v-if="scope.row.status == 1">处理中</el-tag>
          <el-tag type="info" v-if="scope.row.status == 2">已处理</el-tag>
          <el-tag type="success" v-if="scope.row.status == 3">已解决</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            type="primary"
            icon=""
            @click="disposeDetail(scope.row)"
            >处理</el-button
          >
          <el-button
            v-if="scope.row.status == 1"
            type="primary"
            icon=""
            @click="disposecomplete(scope.row)"
            >完成</el-button
          >
          <el-button
            v-if="scope.row.status == 2"
            type="primary"
            icon=""
            @click="disposeClose(scope.row)"
            >关闭</el-button
          >
          <el-button v-if="scope.row.status != 0" type="primary" @click="handleDetail(scope.row)"
            >查看详情</el-button
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
    <alarm-detail ref="modelForm" @ok="modalFormOk"></alarm-detail>
    <dispose-detail ref="disposeForm" @ok="modalFormOk"></dispose-detail>
  </div>
</template>
<script>
import { getEquipmentList } from "@/api/device/deviceBreakdown.js";
import { TableListMixin } from "@/mixins/TableListMixin";
import AlarmDetail from "./components/AlarmDetail";
import DisposeDetail from "./components/DisposeDetail";
export default {
  name: "AlarmTable",
  mixins: [TableListMixin],
  components: {
    AlarmDetail,
    DisposeDetail,
  },
  props: {},
  data() {
    return {
      rowKey: "faultId",
      // 请求列表参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // 设备名称
        alarmName: "",
        alarmLevel: "",
        status: "",
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
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getEquipmentList,
      },
    };
  },
  created() {},

  methods: {
    modelFormData(data) {
      this.$refs.modelForm.dispose(data);
    },
    disposeDetail(record) {
      this.$refs.disposeForm.edit(record);
      this.$refs.disposeForm.title = "详情";
    },
    disposecomplete(record) {
      this.$refs.disposeForm.complete(record);
    },
    disposeClose(record) {
      this.$refs.disposeForm.closeDispose(record);
    },
    /** 检索搜索 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
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
  watch: {},
};
</script>

<style lang="scss" scoped>
.assembly-table-main {
  padding: 10px;
}
</style>
