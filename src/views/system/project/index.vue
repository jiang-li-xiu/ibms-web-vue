<template>
  <div class="app-container">
    <div class="project-box">
      <el-form
        :model="queryParams"
        :rules="queryFormRules"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item label="id" prop="id" v-if="false">
          <el-input
            v-model="queryParams.id"
            placeholder="请输入id"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入项目名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="项目开始日期范围" prop="field102">
          <el-date-picker
            type="daterange"
            v-model="queryDateArray"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :style="{ width: '100%' }"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            clearable
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="项目结束日期范围" prop="field103">
          <el-date-picker
            type="daterange"
            v-model="queryDateArray2"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :style="{ width: '100%' }"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            clearable
          >
          </el-date-picker>
        </el-form-item>

        <!--
  <el-form-item label="开始时间" prop="startTime" >
        <el-date-picker clearable 
                        v-model="queryParams.startTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择项目开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="finishTime" >
        <el-date-picker clearable 
                        v-model="queryParams.finishTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择项目结束时间">
        </el-date-picker>
      </el-form-item>

   -->
        <el-form-item label="地理位置" prop="geographicLocation">
          <el-input
            v-model="queryParams.geographicLocation"
            placeholder="请输入地理位置"
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
            v-hasPermi="['system:project:add']"
            >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:project:edit']"
            >修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:project:remove']"
            >删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['system:project:export']"
            >导出
          </el-button>
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        v-loading="loading"
        :data="projectList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="false" />
        <el-table-column label="项目名称" align="center" prop="name" />
        <el-table-column
          label="项目开始时间"
          align="center"
          prop="startTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="项目结束时间"
          align="center"
          prop="finishTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.finishTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="地理位置"
          align="center"
          prop="geographicLocation"
        />
        <el-table-column label="图片地址" align="center" prop="imageUrl">
          <template slot-scope="scope">
            <el-tag type="info" @click="handleImageView(scope.row)"
              >查看图片</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="项目简介" align="center" prop="details" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              plain
              icon="el-icon-edit"
              @click="handleDetils(scope.row)"
              v-hasPermi="['system:project:edit']"
              >详情
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:project:edit']"
              >修改
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:project:remove']"
              >删除
            </el-button>
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
    </div>

    <!-- ************************************************ -->

    <!-- 添加或修改项目管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目开始时间" prop="startTime">
          <el-date-picker
            clearable
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择项目开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目结束时间" prop="finishTime">
          <el-date-picker
            clearable
            v-model="form.finishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择项目结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地理位置" prop="geographicLocation">
          <el-input
            v-model="form.geographicLocation"
            placeholder="请输入地理位置"
          />
        </el-form-item>
        <el-form-item label="图片地址">
          <ImageUpload v-model="form.imageUrl" />
        </el-form-item>
        <el-form-item label="项目简介" prop="details">
          <el-input
            v-model="form.details"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--    打开详情对话框-->
    <el-dialog
      :title="title"
      :visible.sync="isOpenDetailsDialog"
      width="40%"
      append-to-body
    >
    </el-dialog>

    <el-dialog title="项目详情" :visible.sync="isOpenDetailsDialog" width="60%">
      <div class="dialog-form">
        <div class="dialog-form-left">项目名称：</div>
        <div class="dialog-form-right">{{ formData.name }}</div>
      </div>
      <div class="dialog-form">
        <div class="dialog-form-left">项目开始时间：</div>
        <div class="dialog-form-right">{{ formData.startTime }}</div>
      </div>

      <div class="dialog-form">
        <div class="dialog-form-left">项目结束时间：</div>
        <div class="dialog-form-right">{{ formData.finishTime }}</div>
      </div>
      <div class="dialog-form">
        <div class="dialog-form-left">项目地理位置：</div>
        <div class="dialog-form-right">{{ formData.geographicLocation }}</div>
      </div>
      <div class="dialog-form">
        <div class="dialog-form-left">项目图片地址：</div>
        <div class="dialog-form-right">
          <el-input
            disabled="true"
            type="text"
            placeholder="placeholder"
            v-model="formData.imageUrl"
          ></el-input>
        </div>
      </div>
      <div class="dialog-form">
        <div class="dialog-form-left">项目简介：</div>
        <div class="dialog-form-right">
          <el-input
            disabled="true"
            type="button"
            placeholder="placeholder"
            v-model="formData.details"
          ></el-input>
        </div>
      </div>
    </el-dialog>

    <!--  查看图片对话框  -->
    <el-dialog
      :title="title"
      :visible.sync="isOpenImageView"
      width="60%"
      append-to-body
    >
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in imageUrls" :key="item">
          <el-image
            style="width: 100%; height: 100%"
            :src="item"
            :preview-src-list="imageUrls"
          ></el-image>
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import {
  listProject,
  getProject,
  delProject,
  addProject,
  updateProject,
} from "@/api/system/project";
import ImageUpload from "@/components/ImageUpload/newImageUpload";
import { TableListMixin } from "@/mixins/TableListMixin";

export default {
  name: "Project",
  mixins: [TableListMixin],
  components: {
    ImageUpload,
  },
  data() {
    return {
      // 项目开始时间
      queryDateArray: [],
      // 项目结束时间
      queryDateArray2: [],
      // 是否打开详情对话框
      isOpenDetailsDialog: false,
      // 图片Url
      imageUrls: [],
      // 图片预览
      isOpenImageView: false,
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
      // 项目管理表格数据
      projectList: [],
      // 弹出层标题
      title: "",
      imagetitle: "预览",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        name: null,
        startTime: null,
        startTime2: null,
        finishTime: null,
        finishTime2: null,
        geographicLocation: null,
        imageUrl: null,
        details: null,
        field102: null,
        field103: null,
      },
      // 检索验证
      queryFormRules: {
        name: [{ validator: this.validateQueryFormRules, trigger: "change" }],
        geographicLocation: [
          { validator: this.validateQueryFormRules, trigger: "change" },
        ],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "项目开始时间不能为空", trigger: "blur" },
        ],
        finishTime: [
          { required: true, message: "项目结束时间不能为空", trigger: "blur" },
        ],
        details: [
          { required: true, message: "项目介绍不能为空", trigger: "blur" },
        ],
      },
      formData: [
        {
          name: "项目名称：",
          value: "xxxx",
        },
        {
          name: "开始时间：",
          value: "xxxx",
        },
        {
          name: "结束时间：",
          value: "xxxx",
        },
        {
          name: "地理位置：",
          value: "xxxx",
        },
        {
          name: "项目介绍：",
          value: "xxxx",
        },
        {
          name: "项目图片：",
          value: "xxxx",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询项目管理列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams);
      listProject(this.queryParams).then((response) => {
        this.projectList = response.rows;
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
        id: null,
        name: null,
        startTime: null,
        startTime2: null,
        finishTime: null,
        finishTime2: null,
        geographicLocation: null,
        imageUrl: null,
        details: null,
        field102: null,
        field103: null,
      };
      this.resetForm("form");
      this.queryDateArray = [];
      this.queryDateArray2 = [];
    },
    /** 搜索按钮操作 */
    // handleQuery() {
    //   this.queryParams.pageNum = 1;
    //   if (this.queryDateArray != null) {
    //     this.queryParams.startTime = this.queryDateArray[0];
    //     this.queryParams.startTime2 = this.queryDateArray[1];
    //   }

    //   if (this.queryDateArray2.length != null) {
    //     this.queryParams.finishTime = this.queryDateArray2[0];
    //     this.queryParams.finishTime2 = this.queryDateArray2[1];
    //   }
    //   this.getList();
    // },
    /** 重置按钮操作 */
    resetQuery() {
      console.log(111);
      this.queryParams.field102 = null;
      this.queryParams.field103 = null;
      this.queryDateArray = [];
      this.queryDateArray2 = [];
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
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加项目管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getProject(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目管理";
      });
    },
    /** 图片预览 */
    handleImageView(row) {
      this.title = "图片浏览";
      this.imageUrls = row.imageUrl.split(",");
      this.isOpenImageView = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateProject(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProject(this.form).then((response) => {
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
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除项目管理编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delProject(ids);
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
        "system/project/export",
        {
          ...this.queryParams,
        },
        `system_project.xlsx`
      );
    },
    /** 详情按钮操作 */
    handleDetils(row) {
      this.formData = row;
      this.title = "详情";
      this.isOpenDetailsDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #eee;
  padding: 20px;
}

.project-box {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.assembly-table-title {
  letter-spacing: 2px;
  font-weight: 600;
  padding: 10px;
  font-size: 18px;
  border-bottom: 1px solid #d6d6d6;
}

// 内容
.assembly-table-main {
  padding: 10px;
}

/* 弹框 */
.dialog-form {
  display: flex;

  div {
    flex: 1;
    border: 1px solid #bfbfbf;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-bottom: 0;
  }

  .dialog-form-left {
    background-color: #f2f2f2;
  }
}

.dialog-form:last-child {
  border-bottom: 1px solid #bfbfbf;
}

.onstate {
  color: #95f204;
}

.unstate {
  color: #d9001b;
}
</style>
