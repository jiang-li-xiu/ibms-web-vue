<template>
  <div class="app-container">
    <div class="template-box">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :rules="queryFormRules"
        :inline="true"
        v-show="showSearch"
        label-width="80px"
      >
        <el-form-item label="模板名称" prop="fileName">
          <el-input
            v-model="queryParams.fileName"
            placeholder="请输入模板名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
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
            v-hasPermi="['system:template:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:template:remove']"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-printer" @click="handlePrint"
            >打印</el-button
          >
        </el-col>

        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <div id="table">
        <el-table
          border
          v-loading="loading"
          :data="tableList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="文件Id" align="center" prop="id" />
          <el-table-column label="文件名称" align="center" prop="fileName" />
          <el-table-column
            label="模板类型"
            align="center"
            prop="fileType"
            :formatter="handleTypeFormatter"
          />
          <el-table-column label="文件大小(KB)" align="center">
            <template slot-scope="scope">
              {{ (scope.row.size / 1000).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template id="handle" slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:template:remove']"
                >修改</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-download"
                @click="handleDownload(scope.row.url)"
                v-hasPermi="['system:template:remove']"
                >下载</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:template:remove']"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- ********************************************************************************** -->
    <!-- 添加或修改文件模板对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="upload.open"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模板名称" prop="fileName">
          <el-input v-model="form.fileName" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="类型" prop="fileType">
          <el-select v-model="form.fileType" placeholder="请选择类型">
            <el-option
              v-for="item in templateTypes"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="模板上传" prop="file">
          <el-upload
            v-if="!form.id"
            class="upload-demo"
            ref="upload"
            :multiple="false"
            :auto-upload="false"
            :file-list="upload.fileList"
            :headers="upload.headers"
            :action="upload.url"
            :data="form"
            :on-success="handlePreview"
            :on-change="handleBeforeUpload"
            :on-remove="handleRemove"
            :limit="1"
          >
            <el-button slot="trigger" type="primary" @click="clearFiles"
              >选取文件</el-button
            >
          </el-upload>
          <el-upload
            v-else
            class="upload-demo"
            ref="upload"
            :multiple="false"
            :auto-upload="false"
            :file-list="upload.fileList"
            :headers="upload.headers"
            :action="upload.url"
            :data="form"
            :on-success="handlePreview"
            :on-change="handleBeforeUpload"
            :on-remove="handleRemove"
            :limit="1"
          >
            <el-button slot="trigger" type="primary" @click="clearFiles"
              >选取文件</el-button
            >
          </el-upload>
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
  getTableList,
  getTemplate,
  delTemplate,
  addTemplate,
  updateTemplate,
} from "@/api/system/template";
import { getToken } from "@/utils/auth";
import { TableListMixin } from "@/mixins/TableListMixin";
import printJS from "print-js";
export default {
  name: "Template",
  mixins: [TableListMixin],
  components: {},
  data() {
    return {
      // 表格自适应高度
      tableHeight: 0,
      // 文件上传数据
      upload: {
        open: false,
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + "/system/template/upload",
        // 文件数据
        fileList: [],
      },
      // 检索验证
      queryFormRules: {
        fileName: [
          { validator: this.validateQueryFormRules, trigger: "change" },
        ],
      },
      // uploadUrl: "http://localhost:9202/template/upload",
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
      // 文件模板表格数据
      tableList: [],
      // 弹出层标题
      title: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fileName: null,
        file: null,
        // fileType: null,
        // filePath: null,
        // url: null,
        // size: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fileName: [
          { required: true, message: "请输入模版名称", trigger: "blur" },
          //
        ],
        file: [
          { required: true, message: "请上传模版文件", trigger: "change" },
        ],
        fileType: [
          { required: true, message: "请选择模版类型", trigger: "blur" },
        ],
      },
      // 模板类型
      templateTypes: [],
    };
  },
  created() {
    // 获取模板类型字典
    this.getTemplateTypeDicts();
    // 获取模版数据
    this.getList();
    // 获取表格高度
    this.getHeight();
    // 监听页面变化
    window.addEventListener("resize", this.getHeight);
  },
  methods: {
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 270;
    },
    /** 查询文件模板列表 */
    getList() {
      this.loading = true;
      getTableList(this.queryParams).then((response) => {
        this.tableList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取模板类型字典
    getTemplateTypeDicts() {
      this.getDicts("sys_template").then((res) => {
        this.templateTypes = res.data;
      });
    },
    // 格式化表格模板类型数据
    handleTypeFormatter(row) {
      const item = this.templateTypes.filter(
        (item) => item.dictValue === row.fileType
      );
      const value = item.length === 0 ? "无" : item[0].dictLabel;
      return value;
    },
    // 表单重置
    reset() {
      this.resetForm("form");
      this.form = {
        // id: null,
        fileName: null,
        // fileType: null,
        // filePath: null,
        // url: null,
        // size: null,
        // createTime: null,
        // createBy: null,
        // updateTime: null,
        // updateBy: null,
        remark: "",
      };
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 新增按钮操作 */
    async handleAdd() {
      this.reset();
      this.upload.open = true;
      this.title = "添加模板文件";
      this.upload.url =
        process.env.VUE_APP_BASE_API + "/system/template/upload";
      // 获取字典
      await this.getTemplateTypeDicts();
      this.rules.file = [
        { required: true, message: "请上传模版文件", trigger: "change" },
      ];
    },

    /** 修改按钮操作 */
    async handleUpdate(row) {
      // 重置表单
      this.reset();
      this.upload.open = true;
      this.title = "修改文件模板";

      this.upload.url =
        process.env.VUE_APP_BASE_API + "/system/template/update";
      // 填充数据
      this.form = row;
    },

    clearFiles() {
      this.$refs["upload"].clearFiles();
    },
    // 上传文件移除功能
    handleRemove(file, fileList) {
      this.rules.file = [
        { required: true, message: "请上传模版文件", trigger: "change" },
      ];
    },

    // 文件提交保存到页面上，没上传至服务器时
    handleBeforeUpload(file) {
      if (file.size > 10240000) {
        this.rules.file = [
          { required: true, message: "文件大于1024KB", trigger: "change" },
        ];
      } else {
        this.$refs["form"].clearValidate("file");
        this.rules.file[0].required = false;
        // 保存当前的文件数据
        // this.upload.file = FormData.
      }
    },

    /** 上传成功 */
    handlePreview(file) {
      this.reset();
      this.upload.open = false;
      this.getList();

      // 清空上传文件列表
      this.clearFiles();
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.title == "添加模板文件") {
            this.$refs.upload.submit();
          } else {
            this.$refs.upload.submit();
          }
        }
      });
    },

    // 取消按钮
    cancel() {
      this.upload.open = false;
      this.upload.fileList = [];
      this.reset();
    },

    // 下载操作
    handleDownload(url) {
      let link = document.createElement("a"); // 创建a标签
      link.style.display = "none";
      link.href = url; // 设置下载地址
      link.setAttribute("download", ""); // 添加downLoad属性
      document.body.appendChild(link);
      link.click();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除文件模板编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTemplate(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    handlePrint() {
      printJS({
        printable: this.tableList,
        properties: [
          { field: "id", displayName: "Id", columnSize: 1 },
          { field: "fileName", displayName: "文件名称", columnSize: 1 },
          { field: "size", displayName: "文件大小(KB)", columnSize: 1 },
          { field: "remark", displayName: "备注", columnSize: 1 },
        ],
        type: "json",
        gridStyle: "border: 2px solid #3971A5;text-align:center",
        gridHeaderStyle: "border: 2px solid #3971A5;",
        scanStyles: false, //不适用默认样式
        repeatTableHeader: false, //打印json表头只显示在第一页
        style: "@page{size:auto; margin: 0cm 1cm 0cm 1cm;}", //去除页眉页脚
        // scanStyles: false,
      });
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #eee;
  padding: 20px;
}

.template-box {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>
