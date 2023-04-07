<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="方案名称" prop="schemeName">
        <el-input
          v-model="queryParams.schemeName"
          placeholder="请输入方案名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="脚本id" prop="scriptId">
        <el-input
          v-model="queryParams.scriptId"
          placeholder="请输入脚本id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['bigdata:scheme:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bigdata:scheme:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bigdata:scheme:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          @click="handleExport"
          v-hasPermi="['bigdata:scheme:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="schemeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="方案ID" align="center" prop="schemeId" />
      <el-table-column label="方案名称" align="center" prop="schemeName" />
      <el-table-column label="脚本id" align="center" prop="scriptId" />
      <el-table-column label="方案描述" align="center" prop="schemeDescription" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleExec(scope.row)"
            v-hasPermi="['bigdata:scheme:edit']"
          >执行一次</el-button>
          <el-button
            type="success"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bigdata:scheme:edit']"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bigdata:scheme:remove']"
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

    <!-- 添加或修改大数据分析方案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="方案名称" prop="schemeName">
          <el-input v-model="form.schemeName" placeholder="请输入方案名称" />
        </el-form-item>
        <el-form-item label="脚本id" prop="scriptId">
          <el-input v-model="form.scriptId" placeholder="请输入脚本id" />
        </el-form-item>
        <el-form-item label="方案描述" prop="schemeDescription">
          <el-input v-model="form.schemeDescription" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="方案描述" prop="deleted">
          <el-input v-model="form.deleted" placeholder="请输入方案描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" >确 定</el-button>
        <el-button >取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看执行结果 -->
    <el-dialog title="执行结果" :visible.sync="execOpen" width="500px" append-to-body>
      <el-table :data="showTable">
        <el-table-column label="输出变量标签" align="center" prop="varTag" />
        <el-table-column label="输出变量标识" align="center" prop="varCode" />
        <el-table-column label="输出数据值" align="center" prop="varDefault" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listScheme, getScheme, delScheme, addScheme, updateScheme,selectDbTableList,columnList } from "@/api/bigdata/scheme";
import {
  execScript,
} from "@/api/bigdata/scriptManager";
import{listVariable} from "@/api/bigdata/variable"
export default {
  name: "Scheme",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,

      execOpen:false,
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
      // 大数据分析方案表格数据
      schemeList: [],
      variableList:[],
      showTable:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        schemeName: null,
        scriptId: null,
        schemeDescription: null,
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
  },
  methods: {
    /** 查询大数据分析方案列表 */
    getList() {
      this.loading = true;
      listScheme(this.queryParams).then(response => {
        this.schemeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      // selectDbTableList().then(res=>{
      //   let tablename = res.rows[0].tableName
      //   console.log(tablename);
      //   columnList(tablename).then(res=>{
      //     console.log(res);
      //   })
      // })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        schemeId: null,
        schemeName: null,
        scriptId: null,
        schemeDescription: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        deleted: null
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
      this.ids = selection.map(item => item.schemeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset();
      // this.open = true;
      // this.title = "添加大数据分析方案";
      this.$router.push({name:'AddSchemePage'})
    },
    /** 执行 */
    handleExec(row) {
      const scriptId = row.scriptId;
      listVariable({scriptId:scriptId}).then(res=>{
        this.variableList = res.rows
      })
      execScript(scriptId).then(ress=>{
        this.showTable = []
        this.execOpen = true;
        let res = ress.data;
        this.variableList.forEach(item=>{
          for(let k in res){
            if(item.varCode == k){
              this.showTable.push({
                varTag:item.varTag,
                varCode:item.varCode,
                varDefault:res[k]
              })
            }
          }
        })
        
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const schemeId = row.schemeId || this.ids
      getScheme(schemeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改大数据分析方案";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.schemeId != null) {
            updateScheme(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addScheme(this.form).then(response => {
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
      const schemeIds = row.schemeId || this.ids;
      this.$confirm('是否确认删除大数据分析方案编号为"' + schemeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delScheme(schemeIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bigdata/scheme/export', {
        ...this.queryParams
      }, `bigdata_scheme.xlsx`)
    }
  }
};
</script>