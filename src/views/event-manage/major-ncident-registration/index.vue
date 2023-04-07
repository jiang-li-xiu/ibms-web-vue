<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-05 08:39:09
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-05 15:11:47
-->
<template>
  <div class="main-box">
    <el-card class="min-height-124">
      <!-- 搜索 -->
      <el-form
        :model="queryParams"
        :rules="queryFormRules"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item label="事件名称" prop="eventName">
          <el-input
            v-model="queryParams.eventName"
            placeholder="请输入事件名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="类别" prop="eventType">
          <el-select
            v-model="queryParams.eventType"
            placeholder="请选择类别"
            clearable
          >
            <el-option
              v-for="item in eventTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >搜索
          </el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete(selectedRowKeys)"
            >删除</el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableList"
        :row-key="rowKey"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          header-align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="类别"
          prop="eventType"
          align="center"
          show-overflow-tooltip
          :formatter="eventTypeFormat"
        />
        <el-table-column
          v-for="(item, i) in columns"
          :key="i"
          :label="item.label"
          :prop="item.prop"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-view"
              @click="handleDetail(scope.row)"
              >详情</el-button
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

    <!-- 新增、编辑弹窗组件 -->
    <model-form ref="modelForm" @ok="modalFormOk"></model-form>
  </div>
</template>

<script>
import {
  getTableList,
  delList,
} from "@/api/common-config/event-manage/ImportantEvents.js";
import { TableListMixin } from "@/mixins/TableListMixin";

import ModelForm from "./ModelForm.vue";
export default {
  name: "Post",
  mixins: [TableListMixin],
  components: { ModelForm },
  data() {
    return {
      // table row-key
      rowKey: "id",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eventName: "", //事件名称
        village: "", //小区名称
      },
      // 检索验证
      queryFormRules: {
        eventName: [
          { validator: this.validateQueryFormRules, trigger: "change" },
        ],
        eventType: [
          { validator: this.validateQueryFormRules, trigger: "change" },
        ],
      },
      // 表格配置
      columns: [
        { label: "事件名称", prop: "eventName" },
        // { label: "类别", prop: "eventType" },
        { label: "小区名称", prop: "village" },
        { label: "区域", prop: "location" },
        { label: "原因", prop: "reason" },
        { label: "处理结果", prop: "result" },
        { label: "创建时间", prop: "createdTime" },
        { label: "创建人", prop: "createdBy" },
        { label: "更新人", prop: "updatedBy" },
        { label: "事件发生时间", prop: "eventTime" },
        { label: "更新时间", prop: "updatedTime" },
      ],

      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getTableList,
        // 删除接口
        // delList: delList,
      },

      // 类别列表
      eventTypeList: [],
    };
  },
  created() {
    // 获取类别类型
    this.getDicts("event_category").then((res) => {
      this.eventTypeList = res.data;
    });
  },
  methods: {
    // 翻译字典
    eventTypeFormat(row, column) {
      return this.selectDictLabel(this.eventTypeList, row.eventType);
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row);
      const ids = Array.isArray(row) ? row : [row];
      console.log(ids);
      let that = this;
      that
        .$confirm("是否确认删除此数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function () {
          return delList(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
