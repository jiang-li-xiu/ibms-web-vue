<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="脚本语言" prop="scriptLang">
        <el-select v-model="queryParams.scriptLang" placeholder="请选择脚本语言" clearable >
          <el-option
            v-for="dict in scriptLangOptions"
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
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery"
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
          v-hasPermi="['bigdata:scriptManager:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bigdata:scriptManager:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bigdata:scriptManager:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          @click="handleExport"
          v-hasPermi="['bigdata:scriptManager:export']"
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
      :data="scriptManagerList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="脚本ID" align="center" prop="scriptId" />
      <el-table-column label="脚本语言" align="center" prop="scriptLang" />
      <!-- <el-table-column label="脚本内容" align="center" prop="scriptContent" />  -->
      <el-table-column label="审核状态" align="center" prop="scriptChecked" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.scriptChecked == '0'"
            type="primary"
            icon="el-icon-edit"
            @click="handlChecked(scope.row)"
            v-hasPermi="['bigdata:scriptManager:edit']"
            >审核</el-button
          >
          <el-button
            type="success"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bigdata:scriptManager:edit']"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bigdata:scriptManager:remove']"
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

    <!-- 添加或修改大数据分析脚本对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="脚本语言" prop="scriptLang" v-if="!ischeck">
          <el-select v-model="queryParams.scriptLang" placeholder="请选择脚本语言" clearable size="small" >
          <el-option
            v-for="dict in scriptLangOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="脚本内容">
          <code-editor :code.sync='form.scriptContent' :codeCall="code"></code-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listScriptManager,
  getScriptManager,
  delScriptManager,
  addScriptManager,
  updateScriptManager,
  checkedScriptManager
} from "@/api/bigdata/scriptManager";
// import Editor from '@/components/Editor';
import dedent from "dedent";
import CodeEditor from "@/components/CodeEditor";

import "codemirror/lib/codemirror.css";
// import theme style
import "codemirror/theme/base16-dark.css";
export default {
  name: "ScriptManager",
  components: {
    CodeEditor,
  },
  data() {
    return {
      code:null,
      ischeck:false,
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
      // 大数据分析脚本表格数据
      scriptManagerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 脚本语言字典
      scriptLangOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        scriptLang: null,
        scriptContent: null,
        scriptChecked: null,
        deleted: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
    this.getDicts("big_data_script_lang").then(response => {
      this.scriptLangOptions = response.data;
    });
  },
  methods: {
    /** 查询大数据分析脚本列表 */
    getList() {
      this.loading = true;
      listScriptManager(this.queryParams).then((response) => {
        this.scriptManagerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        scriptId: null,
        scriptLang: null,
        scriptContent: null,
        scriptChecked: null,
        deleted: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
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
      this.ids = selection.map((item) => item.scriptId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加大数据分析脚本";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.ischeck = false;
      const scriptId = row.scriptId || this.ids;
      getScriptManager(scriptId).then((response) => {
        this.form = response.data;
        this.code = response.data.scriptContent;
        this.open = true;
        this.title = "修改大数据分析脚本";
      });
    },
    /** 审核按钮操作 */
    handlChecked(row) {
      this.reset();
      this.ischeck = true;
      const scriptId = row.scriptId || this.ids;
      getScriptManager(scriptId).then((response) => {
        this.form = response.data;
        this.code = response.data.scriptContent;
        this.open = true;
        this.title = "审核大数据分析脚本";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.scriptId != null) {
            if(!this.ischeck){
              updateScriptManager(this.form).then((response) => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            }else{
              checkedScriptManager(this.form).then(res=>{
                this.msgSuccess("审核通过");
                this.open = false;
                this.getList();
              })
            }
            
          } else {
            addScriptManager(this.form).then((response) => {
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
      const scriptIds = row.scriptId || this.ids;
      this.$confirm(
        '是否确认删除大数据分析脚本编号为"' + scriptIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delScriptManager(scriptIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "bigdata/scriptManager/export",
        {
          ...this.queryParams,
        },
        `bigdata_scriptManager.xlsx`
      );
    },
  },
};
</script>