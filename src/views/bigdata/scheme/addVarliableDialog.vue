<!--
 * @Author: Yelucc
 * @Date: 2021-07-23 16:43:11
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-19 15:05:38
 * @Description: 
-->
<template>
  <div>
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

          <el-form-item label="来源表字段" prop="varCode">
            <el-button type="primary" @click="selectTable"
              >选择表字段</el-button
            >
            <!-- <el-input v-model="selectFieldName" :disabled="true"></el-input> -->
          </el-form-item>

          <el-form-item label="数据变量标签（变量名）" prop="varTag">
            <el-input
              v-model="selectField.columnComment"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <el-form-item label="数据变量标识" prop="varCode">
            <el-input
              v-model="selectField.columnName"
              :disabled="true"
            ></el-input>
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
              @current-change="handleDataFieldSelectionChange"
            >
              <el-table-column
                label="来源字段标识"
                align="center"
                prop="columnName"
              />
              <el-table-column
                label="来源字段名"
                align="center"
                prop="columnComment"
              />
              <el-table-column
                label="来源字段类型"
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
</template>
<script>
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
  props: {},
  components: {},
  data() {
    return {
      open: false,
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
        varSourceTableField: null,
      },

      varTypeOptions: [],

      viewTableList: null,
      selectTableName: "",

      viewFieldList: null,
      selectField: "",
    };
  },
  created() {
    this.getDicts("ibms_base_data_type").then((response) => {
      this.varDataTypeOptions = response.data;
    });
    this.getDicts("bigdata_var_type").then((response) => {
      this.varTypeOptions = response.data;
    });
    this.$emit("update:variable", this.dataForm);
    this.$emit("update:resetDialog", this.active);
    this.$emit("update:visible", this.open);
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    submitForm() {
      // this.variableList.push(this.form)
      // this.form = null;

      this.cancel();
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
    handleDataFieldSelectionChange(selection) {
      this.dataForm.varSourceTableField = selection.columnName;
      this.dataForm.varTag = selection.columnComment;
      this.dataForm.varCode = selection.columnName;
      this.dataForm.varType = 1;
      this.selectField = selection;
      this.dataTableOpen = false;
      // this.active = 0
    },
  },

  // watch:{
  //   active:{
  //     handle(n){
  //       console.log(n);
  //     if(n == 0){
  //       this.dataForm = {
  //       varTag: null,
  //       varCode: null,
  //       varDataType: null,
  //       varType: null,
  //       varSourceType: null,
  //       varDefault: null,
  //       varSourceTableName: null,
  //       varSourceTableField: null,
  //       }
  //     }

  //     },deep:true
  //   }
  // }
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