<template>
  <div class="main-box">
    <el-card class="min-height-124">
      <el-form
        :model="queryParams"
        :rules="queryFormRules"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item label="岗位编码" prop="postCode">
          <el-input
            v-model="queryParams.postCode"
            placeholder="请输入岗位编码"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="岗位名称" prop="postName">
          <el-input
            v-model="queryParams.postName"
            placeholder="请输入岗位名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="岗位状态"
            clearable
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            v-hasPermi="['system:post:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete()"
            v-hasPermi="['system:post:remove']"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['system:post:export']"
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
        :data="tableList"
        :row-key="rowKey"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="岗位编号"
          align="center"
          prop="postId"
          show-overflow-tooltip
        />
        <el-table-column
          label="岗位编码"
          align="center"
          prop="postCode"
          show-overflow-tooltip
        />
        <el-table-column
          label="岗位名称"
          align="center"
          prop="postName"
          show-overflow-tooltip
        />
        <el-table-column
          label="岗位排序"
          align="center"
          prop="postSort"
          show-overflow-tooltip
        />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 0">正常</el-tag>
            <el-tag type="danger" v-else>停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              v-hasPermi="['system:post:edit']"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.postId)"
              v-hasPermi="['system:post:remove']"
              >删除</el-button
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
    </el-card>

    <!-- 新增、编辑弹窗组件 -->
    <model-form
      ref="modelForm"
      :statusOptions="statusOptions"
      @ok="modalFormOk"
    ></model-form>
  </div>
</template>

<script>
import { getTableList, delList } from "@/api/system/post";
import { TableListMixin } from "@/mixins/TableListMixin";

import ModelForm from "./ModelForm.vue";
export default {
  name: "Post",
  mixins: [TableListMixin],
  components: { ModelForm },
  data() {
    return {
      // table row-key
      rowKey: "postId",
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        postCode: undefined,
        postName: undefined,
        status: undefined,
      },
      // 检索验证
      queryFormRules: {
        postCode: [
          { validator: this.validateQueryFormRules, trigger: "change" },
        ],
        postName: [
          { validator: this.validateQueryFormRules, trigger: "change" },
        ],
      },
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getTableList,
        // 删除接口
        delList: delList,
      },
    };
  },
  created() {
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/post/export",
        {
          ...this.queryParams,
        },
        `post_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>