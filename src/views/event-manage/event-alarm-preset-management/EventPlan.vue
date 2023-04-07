<template>
  <el-card class="min-height-124">
    <!-- 标题 -->
    <div class="table-title">{{ tableTitle }}</div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="预案名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入预案名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="启用状态" prop="planStarts">
        <el-select
          v-model="queryParams.planStarts"
          placeholder="请选择处理状态"
          clearable
        >
          <el-option
            v-for="dict in isState"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['system:plan:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-upload2"
          @click="handleImport"
          v-hasPermi="['system:plan:import']"
        >
          <i class="fa fa-upload"></i> 导入</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete()"
          v-hasPermi="['system:plan:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          @click="handleExport"
          v-hasPermi="['system:plan:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :row-key="rowKey"
      :data="planList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备类型" align="center" prop="deviceTypeName" />
      <el-table-column label="预案名称" align="center" prop="planName" />
      <el-table-column label="预案内容" align="center" prop="planContent">
      </el-table-column>
      <el-table-column label="启用状态" align="center" prop="planStarts">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.planStarts === '0'"
            >启用</el-tag
          >
          <el-tag type="danger" v-if="scope.row.planStarts === '1'"
            >停用</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="350">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
            v-hasPermi="['system:plan:edit']"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['system:plan:remove']"
            >删除</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-circle-close"
            v-if="scope.row.planStarts == 0"
            @click.stop="handleStop(scope.row)"
            >停用</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-circle-check"
            v-else
            @click.stop="handleStop(scope.row)"
            >启用</el-button
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

    <!-- 添加或修改事件告警预案管理对话框 -->
    <event-plan-edit-btn
      ref="modelForm"
      :is-state="isState"
      @ok="modalFormOk"
    ></event-plan-edit-btn>

    <!-- 导入对话框 -->
    <to-lead-btn ref="toLeadBtn" @ok="modalFormOk"></to-lead-btn>
  </el-card>
</template>

<script>
import {
  listPlan,
  delPlan,
  updatePlan,
} from "@/api/common-config/event-manage/plan";
import EventPlanEditBtn from "./component/EventPlanEditBtn";
import ToLeadBtn from "./component/ToLeadBtn";

import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  name: "Plan",
  components: {
    EventPlanEditBtn,
    ToLeadBtn,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "id",
      tableTitle: "全部", // 标题
      // 事件告警预案管理表格数据
      planList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceTypeId: null,
        deviceTypeName: null,
        planName: null,
        planContent: null,
        planStarts: null,
        deleted: null,
        version: null,
        systemId: null,
        systemName: null,
        regionId: "",
      },
      // 启用状态
      isState: [],
      interface: {
        delList: delPlan,
      },
    };
  },
  created() {
    this.getDicts("ibms_active_status").then((response) => {
      this.isState = response.data;
    });
  },
  methods: {
    /** 查询事件告警预案管理列表 */
    getList() {
      this.loading = true;
      listPlan(this.queryParams).then((response) => {
        this.planList = response.rows;
        this.total = response.total;
      });
      this.loading = false;

      // 重置
      this.queryParams.deviceTypeId = null;
      this.queryParams.systemId = null;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "event/plan/export",
        {
          ids: this.selectedRowKeys,
        },
        `事件预案记录.xlsx`
      );
    },
    /** 停用预案操作 */
    handleStop(row) {
      if (row.planStarts == 1) {
        row.planStarts = 0;
      } else {
        row.planStarts = 1;
      }
      updatePlan(row)
        .then((response) => {})
        .then(() => {
          this.getList();
        })
        .catch(() => {});
    },
    /*---------------------------导入-----------------------------*/
    /** 导入按钮操作 */
    handleImport() {
      alert("功能暂未开放");
      // this.$refs.toLeadBtn.upload.open = true
      // this.$refs.toLeadBtn.upload.title = "用户导入"
    },
  },
  watch: {
    treeNode: {
      handler(newVal) {
        let code = newVal.code;
        let index = code == null ? -1 : code.indexOf("&");
        if (index !== -1) {
          this.queryParams.deviceTypeId = newVal.code.substring(
            index + 1,
            newVal.code.length
          );
        } else {
          this.queryParams.systemId = code;
        }
        this.queryParams.regionId = newVal.regionId;
        this.tableTitle = newVal.regionName;
        this.getList();
      },
    },
  },
};
</script>
