<!--
 * @Author: Yelucc
 * @Date: 2021-07-23 16:20:31
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-08-04 15:39:12
 * @Description: 
-->
<template>
  <div>
    <el-card>
      <div slot="header">
        <el-form ref="scriptForm" :model="scriptForm" label-width="80px">
          <el-form-item label="脚本语言" prop="scriptLang">
            <el-select
              v-model="scriptForm.scriptLang"
              placeholder="请选择脚本语言"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in scriptLangOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <code-editor :code.sync="scriptForm.scriptContent"></code-editor>
      </div>
      <div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['bigdata:variable:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['bigdata:variable:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleUpdate"
              v-hasPermi="['bigdata:variable:remove']"
              >删除</el-button
            >
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="variableList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <!-- <el-table-column label="变量ID" align="center" prop="varId" />
      <el-table-column label="脚本ID" align="center" prop="scriptId" /> -->
          <el-table-column label="变量标签" align="center" prop="varTag" />
          <el-table-column label="变量标识" align="center" prop="varCode" />
          <el-table-column
            label="变量数据类型"
            align="center"
            prop="varDataType"
            :formatter="varDataTypeFormat"
          />
          <el-table-column
            label="变量类型"
            align="center"
            prop="varType"
            :formatter="varTypeFormat"
          />
          <el-table-column
            label="数据来源标识"
            align="center"
            prop="varSourceType"
            :formatter="varSourceTypeFormat"
          />
          <el-table-column
            label="数据默认值"
            align="center"
            prop="varDefault"
          />
          <el-table-column
            label="来源数据表"
            align="center"
            prop="varSourceTableName"
          />
          <el-table-column
            label="来源键字段"
            align="center"
            prop="varSourceTableKeyField"
          />
          <el-table-column
            label="来源值字段"
            align="center"
            prop="varSourceTableValueField"
          />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['bigdata:variable:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['bigdata:variable:remove']"
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

        <!-- 添加或修改大数据分析方案对话框 -->
        <el-dialog
          title="添加分析变量"
          :visible.sync="open"
          width="1500px"
          append-to-body
        >
          <!-- STEP1 选择数据源 自创变量 来源数据表 -->
          <div v-if="active == 0">
            <el-row :gutter="10">
              <el-col :span="3">
                <div
                  class="select-box"
                  :style="{
                    backgroundImage:
                      'url(' + require('@/assets/images/element1.png') + ')',
                  }"
                  @click="selectDataSource(0)"
                >
                  <div style="margin-top: 30px">
                    <el-image
                      style="width: 45px; height: 45px"
                      :src="require('@/assets/icons/number.png')"
                    />
                    <div>用户自定义变量</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="3">
                <div
                  class="select-box"
                  :style="{
                    backgroundImage:
                      'url(' + require('@/assets/images/element2.png') + ')',
                  }"
                  @click="selectDataSource(1)"
                >
                  <div style="margin-top: 30px">
                    <el-image
                      style="width: 45px; height: 45px"
                      :src="require('@/assets/icons/database.png')"
                    />
                    <div>从数据库中选择</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- STEP2-0 用户自定义变量 -->
          <div v-if="active == 1 && dataForm.varSourceType == 0">
            <el-form ref="dataForm" :model="dataForm" label-width="200px">
              <el-form-item label="数据变量标签（变量名）" prop="varTag">
                <el-input v-model="dataForm.varTag"></el-input>
              </el-form-item>

              <el-form-item label="数据变量标识" prop="varCode">
                <el-input v-model="dataForm.varCode"></el-input>
              </el-form-item>

              <el-form-item label="变量数据类型" prop="varDataType">
                <el-select
                  v-model="dataForm.varDataType"
                  placeholder="请选择变量数据类型"
                >
                  <el-option
                    v-for="dict in varDataTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="变量类型" prop="varType">
                <el-select
                  v-model="dataForm.varType"
                  placeholder="请选择变量类型（入参或返回值）"
                >
                  <el-option
                    v-for="dict in varTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="数据默认值" prop="varDefault">
                <el-input
                  v-model="dataForm.varDefault"
                  placeholder="请输入数据默认值"
                />
              </el-form-item>
            </el-form>
          </div>
          <!-- STEP2-1 从数据库中选择 -->
          <div v-if="active == 1 && dataForm.varSourceType == 1">
            <el-form ref="dataForm" :model="dataForm" label-width="200px">
              <el-form-item label="来源数据表" prop="varSourceTableName">
                <el-button type="primary" @click="selectTable"
                  >选择数据表</el-button
                >
                <el-input v-model="selectTableName" :disabled="true"></el-input>
              </el-form-item>

              <el-form-item label="键值字段" prop="varSourceTableKeyField">
                <el-button type="primary" @click="selectTable"
                  >选择键和值字段</el-button
                >
                <el-row :gutter="10">
                  <el-col :span="6">
                    <span>键：</span>
                    <el-input
                      v-model="dataForm.varSourceTableKeyField"
                      :disabled="true"
                    ></el-input
                  ></el-col>
                  <el-col :span="6">
                    <span>值：</span>
                    <el-input
                      v-model="dataForm.varSourceTableValueField"
                      :disabled="true"
                    ></el-input
                  ></el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="数据变量标签（变量名）" prop="varTag">
                <el-input v-model="dataForm.varTag"></el-input>
              </el-form-item>

              <el-form-item label="数据变量标识" prop="varCode">
                <el-input v-model="dataForm.varCode"></el-input>
              </el-form-item>

              <el-form-item label="变量数据类型" prop="varDataType">
                <el-select
                  v-model="dataForm.varDataType"
                  placeholder="请选择变量数据类型"
                >
                  <el-option
                    v-for="dict in varDataTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>

              <!-- 选择数据库 -->
              <el-dialog
                title="选择数据库"
                :visible.sync="dataTableOpen"
                width="500px"
                append-to-body
              >
                <el-table
                  v-loading="dataTableLoading"
                  :data="viewTableList"
                  highlight-current-row
                  @current-change="handleDataTableSelectionChange"
                >
                  <el-table-column
                    label="来源数据表标识"
                    align="center"
                    prop="tableName"
                  />
                  <el-table-column
                    label="来源数据表名"
                    align="center"
                    prop="tableComment"
                  />
                </el-table>

                <el-table
                  v-loading="dataTableLoading"
                  :data="viewFieldList"
                  highlight-current-row
                  @current-change="handleKeyFieldSelectionChange"
                >
                  <el-table-column
                    label="作为键字段标识"
                    align="center"
                    prop="columnName"
                  />
                  <el-table-column
                    label="作为键字段名"
                    align="center"
                    prop="columnComment"
                  />
                  <el-table-column
                    label="作为键字段类型"
                    align="center"
                    prop="columnType"
                  />
                </el-table>

                <el-table
                  v-loading="dataTableLoading"
                  :data="viewFieldList"
                  highlight-current-row
                  @current-change="handleValueFieldSelectionChange"
                >
                  <el-table-column
                    label="作为值字段标识"
                    align="center"
                    prop="columnName"
                  />
                  <el-table-column
                    label="作为值字段名"
                    align="center"
                    prop="columnComment"
                  />
                  <el-table-column
                    label="作为值字段类型"
                    align="center"
                    prop="columnType"
                  />
                </el-table>
              </el-dialog>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
// import addVarliableDialog from "@/views/bigdata/scheme/addVarliableDialog";
import dedent from "dedent";
import CodeEditor from "@/components/CodeEditor";

import "codemirror/lib/codemirror.css";
// import theme style
import "codemirror/theme/base16-dark.css";
import {
  listVariable,
  getVariable,
  delVariable,
  addVariable,
  updateVariable,
} from "@/api/bigdata/variable";
import {
  listScheme,
  getScheme,
  delScheme,
  addScheme,
  updateScheme,
  selectDbTableList,
  columnList,
} from "@/api/bigdata/scheme";

export default {
  name: "SchemeVarliablePage",
  props: {
    scriptId: {
      type: String,
      default: () => "",
    },
  },
  components: { CodeEditor },
  data() {
    return {
      title: "",
      open: false,
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
      // 变量数据类型字典
      varDataTypeOptions: [],
      // 变量类型字典
      varTypeOptions: [],
      // 数据来源标识字典
      varSourceTypeOptions: [],
      // 分析变量表格数据
      variableList: [],
      scriptLangOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      scriptForm: {
        scriptLang: "Javascript",
        scriptContent: null,
      },

      // 表单校验
      rules: {},

      active: 0,
      // 查询参数
      dataTableOpen: false,
      dataTableLoading: false,
      dataForm: {
        varTag: null,
        varCode: null,
        varDataType: null,
        varType: null,
        varSourceType: null,
        varDefault: null,
        varSourceTableName: null,
        varSourceTableKeyField: null,
        varSourceTableValueField: null,
      },

      viewTableList: null,
      selectTableName: "",

      viewFieldList: null,
      selectField: "",
    };
  },
  created() {
    this.getList();
    this.getDicts("ibms_base_data_type").then((response) => {
      this.varDataTypeOptions = response.data;
    });
    this.getDicts("bigdata_var_type").then((response) => {
      this.varTypeOptions = response.data;
    });
    this.getDicts("bigdata_var_source_type").then((response) => {
      this.varSourceTypeOptions = response.data;
    });
    this.getDicts("big_data_script_lang").then((response) => {
      this.scriptLangOptions = response.data;
    });
    this.$emit("update:scriptData", this.scriptForm);
  },
  methods: {
    /** 查询分析变量列表 */
    getList() {
      this.loading = true;
      this.queryParams.scriptId = this.scriptId;
      listVariable(this.queryParams).then((response) => {
        this.variableList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
        updateBy: null,
      };
      this.dataForm = {
        varTag: null,
        varCode: null,
        varDataType: null,
        varType: null,
        varSourceType: null,
        varDefault: null,
        varSourceTableName: null,
        varSourceTableField: null,
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
      this.ids = selection.map((item) => item.varId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加分析变量";
      this.active = 0;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.active = 1;
      this.dataForm.varSourceType = row.varSourceType;
      const varId = row.varId || this.ids;
      getVariable(varId).then((response) => {
        this.dataForm = response.data;
        this.open = true;
        this.title = "修改分析变量";
      });
    },
    submitForm() {
      // this.variableList.push(this.dataForm);
      this.dataForm.scriptId = this.scriptId;
      addVariable(this.dataForm).then((res) => {
        this.reset();
        // console.log(res);
        this.open = false;
        this.getList();
      });
    },
    selectDataSource(n) {
      this.dataForm.varSourceType = n;
      this.active++;
    },
    selectTable() {
      this.dataTableOpen = true;
      this.dataTableLoading = true;
      selectDbTableList().then((res) => {
        this.viewTableList = res.rows;
        this.dataTableLoading = false;
      });
    },
    handleDataTableSelectionChange(selection) {
      this.dataForm.varSourceTableName = selection.tableName;
      this.selectTableName = selection.tableComment;
      columnList(this.dataForm.varSourceTableName).then((res) => {
        this.viewFieldList = res.rows;
      });
    },
    handleKeyFieldSelectionChange(selection) {
      this.dataForm.varSourceTableKeyField = selection.columnName;

      this.dataForm.varType = 0;
      this.selectField = selection;
      // this.dataTableOpen = false;
      // this.active = 0
    },
    //  TODO
    handleValueFieldSelectionChange(selection) {
      this.dataForm.varSourceTableValueField = selection.columnName;

      this.dataForm.varType = 0;
      this.selectField = selection;
      this.dataTableOpen = false;
      // this.active = 0
    },
  },
};
</script>
<style lang='scss' scoped>
.select-box {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #eee;
  text-align: center;
}
</style>