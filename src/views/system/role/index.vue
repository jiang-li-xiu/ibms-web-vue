<template>
  <div class="main-box">
    <el-card class="min-height-124">
      <el-form
        :model="queryParams"
        :rules="queryFormRules"
        ref="queryForm"
        v-show="showSearch"
        :inline="true"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input
            v-model="queryParams.roleKey"
            placeholder="请输入权限字符"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="角色状态"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
            v-hasPermi="['system:role:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete()"
            v-hasPermi="['system:role:remove']"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['system:role:export']"
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
        border
        :row-key="rowKey"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色编号" prop="roleId" show-overflow-tooltip />
        <el-table-column
          label="角色名称"
          prop="roleName"
          show-overflow-tooltip
        />
        <el-table-column
          label="权限字符"
          prop="roleKey"
          show-overflow-tooltip
        />
        <el-table-column label="显示顺序" prop="roleSort" />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="400"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              v-hasPermi="['system:role:edit']"
              >修改</el-button
            >
            <el-button
              icon="el-icon-circle-check"
              @click="handleDataScope(scope.row)"
              v-hasPermi="['system:role:edit']"
              >数据权限</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.roleId)"
              v-hasPermi="['system:role:remove']"
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
    <!-- ********************************************************************************************* -->
    <!-- 添加或修改角色配置对话框 -->
    <configuration
      ref="modelForm"
      :statusOptions="statusOptions"
      @ok="modalFormOk"
    />
    <!-- 分配角色数据权限对话框 -->
    <jurisdiction ref="jurisdiction" @ok="modalFormOk" />
  </div>
</template>

<script>
import { listRole, delRole, changeRoleStatus } from "@/api/system/role";
import { TableListMixin } from "@/mixins/TableListMixin";
import Configuration from "./Configuration";
import Jurisdiction from "./Jurisdiction";

export default {
  name: "Role",
  mixins: [TableListMixin],
  components: {
    Configuration,
    Jurisdiction,
  },
  data() {
    return {
      // 列表唯一id
      rowKey: "roleId",
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
      },
      // 检索验证
      queryFormRules: {
        roleName: [
          { validator: this.validateQueryFormRules, trigger: "change" },
        ],
        roleKey: [
          { validator: this.validateQueryFormRules, trigger: "change" },
        ],
      },
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: listRole,
        // 删除接口
        delList: delRole,
      },
    };
  },
  created() {
    // 获取角色状态字典
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.roleName + '"角色吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeRoleStatus(row.roleId, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 分配角色数据权限（组件）
    handleDataScope(row) {
      this.$refs.jurisdiction.title = "分配数据权限";
      this.$refs.jurisdiction.allocation(row);
      this.$refs.jurisdiction.disableSubmit = false;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/role/export",
        {
          ...this.queryParams,
        },
        `role_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>