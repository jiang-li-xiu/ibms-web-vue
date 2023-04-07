<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="脚本ID" prop="scriptId">
        <el-input
          v-model="queryParams.scriptId"
          placeholder="请输入脚本ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变量标签" prop="varTag">
        <el-input
          v-model="queryParams.varTag"
          placeholder="请输入变量标签"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变量标识" prop="varCode">
        <el-input
          v-model="queryParams.varCode"
          placeholder="请输入变量标识"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变量数据类型" prop="varDataType">
        <el-select v-model="queryParams.varDataType" placeholder="请选择变量数据类型" clearable>
          <el-option
            v-for="dict in varDataTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="变量类型" prop="varType">
        <el-select v-model="queryParams.varType" placeholder="请选择变量类型" clearable>
          <el-option
            v-for="dict in varTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据来源标识" prop="varSourceType">
        <el-select v-model="queryParams.varSourceType" placeholder="请选择数据来源标识" clearable size="small">
          <el-option
            v-for="dict in varSourceTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据默认值" prop="varDefault">
        <el-input
          v-model="queryParams.varDefault"
          placeholder="请输入数据默认值"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源数据表" prop="varSourceTableName">
        <el-input
          v-model="queryParams.varSourceTableName"
          placeholder="请输入来源数据表"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源字段" prop="varSourceTableField">
        <el-input
          v-model="queryParams.varSourceTableField"
          placeholder="请输入来源字段"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源字段" prop="deleted">
        <el-input
          v-model="queryParams.deleted"
          placeholder="请输入来源字段"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['bigdata:variable:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bigdata:variable:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bigdata:variable:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          @click="handleExport"
          v-hasPermi="['bigdata:variable:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="variableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="变量ID" align="center" prop="varId" />
      <el-table-column label="脚本ID" align="center" prop="scriptId" />
      <el-table-column label="变量标签" align="center" prop="varTag" />
      <el-table-column label="变量标识" align="center" prop="varCode" />
      <el-table-column label="变量数据类型" align="center" prop="varDataType" :formatter="varDataTypeFormat" />
      <el-table-column label="变量类型" align="center" prop="varType" :formatter="varTypeFormat" />
      <el-table-column label="数据来源标识" align="center" prop="varSourceType" :formatter="varSourceTypeFormat" />
      <el-table-column label="数据默认值" align="center" prop="varDefault" />
      <el-table-column label="来源数据表" align="center" prop="varSourceTableName" />
      <el-table-column label="来源字段" align="center" prop="varSourceTableField" />
      <el-table-column label="来源字段" align="center" prop="deleted" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bigdata:variable:edit']"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bigdata:variable:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改分析变量对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="脚本ID" prop="scriptId">
          <el-input v-model="form.scriptId" placeholder="请输入脚本ID" />
        </el-form-item>
        <el-form-item label="变量标签" prop="varTag">
          <el-input v-model="form.varTag" placeholder="请输入变量标签" />
        </el-form-item>
        <el-form-item label="变量标识" prop="varCode">
          <el-input v-model="form.varCode" placeholder="请输入变量标识" />
        </el-form-item>
        <el-form-item label="变量数据类型" prop="varDataType">
          <el-select v-model="form.varDataType" placeholder="请选择变量数据类型">
            <el-option
              v-for="dict in varDataTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变量类型" prop="varType">
          <el-select v-model="form.varType" placeholder="请选择变量类型">
            <el-option
              v-for="dict in varTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源标识" prop="varSourceType">
          <el-select v-model="form.varSourceType" placeholder="请选择数据来源标识">
            <el-option
              v-for="dict in varSourceTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据默认值" prop="varDefault">
          <el-input v-model="form.varDefault" placeholder="请输入数据默认值" />
        </el-form-item>
        <el-form-item label="来源数据表" prop="varSourceTableName">
          <el-input v-model="form.varSourceTableName" placeholder="请输入来源数据表" />
        </el-form-item>
        <el-form-item label="来源字段" prop="varSourceTableField">
          <el-input v-model="form.varSourceTableField" placeholder="请输入来源字段" />
        </el-form-item>
        <el-form-item label="来源字段" prop="deleted">
          <el-input v-model="form.deleted" placeholder="请输入来源字段" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->



    <!-- test -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <!-- <add-link-action-dialog></add-link-action-dialog> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      </el-dialog>
  </div>
</template>

<script>
import { listVariable, getVariable, delVariable, addVariable, updateVariable } from "@/api/bigdata/variable";
// import AddLinkActionDialog from '../../subsystem/components/addPanel/addLinkActionDialog.vue';
export default {
  name: "Variable",
  components: {
    // AddLinkActionDialog
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 分析变量表格数据
      variableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 变量数据类型字典
      varDataTypeOptions: [],
      // 变量类型字典
      varTypeOptions: [],
      // 数据来源标识字典
      varSourceTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        scriptId: null,
        varTag: null,
        varCode: null,
        varDataType: null,
        varType: null,
        varSourceType: null,
        varDefault: null,
        varSourceTableName: null,
        varSourceTableField: null,
        deleted: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("ibms_base_data_type").then(response => {
      this.varDataTypeOptions = response.data;
    });
    this.getDicts("bigdata_var_type").then(response => {
      this.varTypeOptions = response.data;
    });
    this.getDicts("bigdata_var_source_type").then(response => {
      this.varSourceTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询分析变量列表 */
    getList() {
      this.loading = true;
      listVariable(this.queryParams).then(response => {
        this.variableList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 变量数据类型字典翻译
    varDataTypeFormat(row, column) {
      return this.selectDictLabel(this.varDataTypeOptions, row.varDataType);
    },
    // 变量类型字典翻译
    varTypeFormat(row, column) {
      return this.selectDictLabel(this.varTypeOptions, row.varType);
    },
    // 数据来源标识字典翻译
    varSourceTypeFormat(row, column) {
      return this.selectDictLabel(this.varSourceTypeOptions, row.varSourceType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        varId: null,
        scriptId: null,
        varTag: null,
        varCode: null,
        varDataType: null,
        varType: null,
        varSourceType: null,
        varDefault: null,
        varSourceTableName: null,
        varSourceTableField: null,
        deleted: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.varId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加分析变量";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const varId = row.varId || this.ids
      getVariable(varId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改分析变量";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.varId != null) {
            updateVariable(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVariable(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const varIds = row.varId || this.ids;
      this.$confirm('是否确认删除分析变量编号为"' + varIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delVariable(varIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bigdata/variable/export', {
        ...this.queryParams
      }, `bigdata_variable.xlsx`)
    }
  }
};
</script>