<!--
 * @Author: RobertFan
 * @Date: 2022-06-06 11:49:12
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-06-22 16:23:55
 * @Description: 
-->
<template>
  <div class="main-box">
    <el-card class="min-height-124">
      <!-- 查询区域 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item label="任务名称:" prop="taskName">
          <el-input
            v-model="queryParams.taskName"
            placeholder="请输入任务名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="设备类型:" prop="deviceTypeId">
          <el-select
            v-model="queryParams.deviceTypeId"
            placeholder="请选择设备类型"
            clearable
            filterable
          >
            <el-option
              v-for="item in DeviceType"
              :key="item.deviceTypeId"
              :label="item.deviceTypeName"
              :value="item.deviceTypeId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="任务时间:" prop="queryDateArray">
          <el-date-picker
            v-model="queryDateArray"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            align="right"
            @change="changeQueryTime"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="负责人:" prop="supervisePerson">
          <el-input
            v-model="queryParams.supervisePerson"
            placeholder="请输入负责人"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="维保级别:" prop="maintenanceGrade">
          <el-select
            v-model="queryParams.maintenanceGrade"
            placeholder="请选择维保级别"
            clearable
            filterable
          >
            <el-option
              v-for="dict in maintenanceGradeDict"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="任务状态:" prop="taskState">
          <el-select
            v-model="queryParams.taskState"
            placeholder="请选择任务状态"
            clearable
            filterable
          >
            <el-option
              v-for="dict in taskDict"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 按钮区域 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            v-hasPermi="['equipment:standardItems:add']"
            >新增</el-button
          >
        </el-col>

        <el-col :span="1.5">
          <el-upload
            :action="uploadFileUrl"
            :before-upload="beforeUpload"
            :on-error="handleUploadError"
            :on-success="handleUploadSuccess"
            :file-list="fileList"
            :limit="limit"
            :show-file-list="false"
            :headers="headers"
            ref="upload"
          >
            <el-button
              icon="el-icon-upload"
              type="primary"
              v-hasPermi="['equipment:standardItems:import']"
              >导入</el-button
            >
          </el-upload>
        </el-col>

        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['equipment:standardItems:export']"
            >导出</el-button
          >
        </el-col>

        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete()"
            v-hasPermi="['equipment:standardItems:remove']"
            >删除</el-button
          >
        </el-col>

        <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="downloadTemplate"
            >下载模板</el-button
          >
        </el-col> -->

        <!-- 表格右上区域按钮 -->
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <!-- 表格区域 -->
      <el-table
        :height="650"
        class="table"
        :row-key="rowKey"
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标准任务名称" align="center" prop="taskName" />
        <el-table-column label="任务描述" align="center" prop="taskDescribe" />

        <el-table-column
          label="设备类型"
          align="center"
          prop="deviceTypeName"
        />

        <el-table-column
          label="维保级别"
          align="center"
          prop="maintenanceGrade"
        >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.maintenanceGrade == 0"
              >日常维保</el-tag
            >
            <el-tag type="info" v-if="scope.row.maintenanceGrade == 1"
              >月度维保</el-tag
            >
            <el-tag type="warning" v-if="scope.row.maintenanceGrade == 2"
              >季度维保</el-tag
            >
            <el-tag type="danger" v-if="scope.row.maintenanceGrade == 3"
              >年度维保</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          label="计划开始日期"
          align="center"
          prop="planStartTime"
        />
        <el-table-column label="计划结束日期" align="center" prop="stopTime" />

        <el-table-column label="循环方式" align="center" prop="repeatWay">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.repeatWay == 0">单次</el-tag>
            <el-tag type="danger" v-else>多次</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="时间间隔" align="center" prop="timeInterval">
          <template slot-scope="scope">
            <span v-if="scope.row.timeInterval">{{
              scope.row.timeInterval
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column label="时间单位" align="center" prop="unit">
          <template slot-scope="scope">
            <span v-if="scope.row.unit == 0">天</span>
            <span v-else-if="scope.row.unit == 1">周</span>
            <span v-else-if="scope.row.unit == 2">月</span>
            <span v-else-if="scope.row.unit == 3">季</span>
            <span v-else-if="scope.row.unit == 4">年</span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column label="负责人" align="center" prop="supervisePerson" />
        <el-table-column label="任务状态" align="center" prop="taskState">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.taskState == 0"
              >未过期</el-tag
            >
            <el-tag type="danger" v-else>已过期</el-tag>
          </template>
        </el-table-column>

        <el-table-column width="350" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              v-hasPermi="['equipment:standardItems:edit']"
              >修改</el-button
            >
            <el-button
              type="success"
              icon="el-icon-edit"
              @click="handleDetail(scope.row)"
              v-hasPermi="['equipment:standardItems:detail']"
              >查看详情</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.taskId)"
              v-hasPermi="['equipment:standardItems:remove']"
              >删除</el-button
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

    <!-- 增加修改对话框 -->
    <add-edit-dialog ref="modelForm" @ok="modalFormOk" />
    <!-- 详情对话框 -->
    <details-dialog ref="detailForm"></details-dialog>
  </div>
</template>

<script>
import {
  getTableList,
  getDeviceType,
  deleteList,
} from "@/api/maintenance/standerItems";
import { TableListMixin } from "@/mixins/TableListMixin";
import { getToken } from "@/utils/auth";
import AddEditDialog from "./AddEditDialog.vue";
import DetailsDialog from "./DetailsDialog";
export default {
  mixins: [TableListMixin],
  components: {
    AddEditDialog,
    DetailsDialog,
  },
  data() {
    return {
      // 时间
      queryDateArray: [],
      // 文件列表
      fileList: [],
      // 上传的图片服务器地址
      uploadFileUrl:
        process.env.VUE_APP_BASE_API + "/maintenance/task/importData",
      // 最大可上传文件个数
      limit: 5,
      // 设置上传的请求头部
      headers: {
        Authorization: "Bearer " + getToken(),
      },

      // 获取设备类型数据列表
      DeviceType: [],
      // 任务状态数据字典
      taskDict: [],
      // 维保级别数据字典
      maintenanceGradeDict: [],
      // 主键id
      rowKey: "taskId",
      // 是否加载
      loading: false,
      // 请求列表查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskName: "",
        deviceTypeId: "",
        supervisePerson: null,
        maintenanceGrade: "",
        taskState: "",
        planStartTime: "",
        stopTime: "",
      },
      // 表格数据列表
      tableList: [],
      interface: {
        // 获取表格数据
        getTableList: getTableList,
        // 表格数据的删除
        delList: deleteList,
      },
    };
  },
  created() {
    // 获取任务状态数据字典
    this.getDicts("maintenance_task_state").then((response) => {
      this.taskDict = response.data;
    });
    // 获取维保级别数据字典列表
    this.getDicts("maintenance_grade").then((response) => {
      this.maintenanceGradeDict = response.data;
    });
    // 获取设备类型
    this.getDeviceType();
  },
  methods: {
    /** 重置检索 */
    resetQuery() { 
      this.resetForm("queryForm");
      this.queryDateArray = []
      this.queryParams.planStartTime = "";
      this.queryParams.stopTime = "";
      this.handleQuery();
    },
    // 导入功能
    handleImport() {},
    // 导出功能
    handleExport() {
      this.download(
        "/maintenance/task/export",
        {
          ids: this.selectedRowKeys,
        },
        "标准任务管理.xlsx"
      );
    },

    // 获取设备类型
    getDeviceType() {
      getDeviceType()
        .then((res) => {
          if (res.code == 200) {
            this.DeviceType = res.data;
          }
        })
        .catch(() => {
          this.$message.error("获取设备失败");
        });
    },

    /** 详情 */
    handleDetail(record) {
      this.$refs.detailForm.edit(record);
      this.$refs.detailForm.title = "任务详情";
    },

    beforeUpload(file) {
      // 上传前 文件校验
      this.files = file;
      const xls = file.name.split(".")[1] === "xls";
      const xlsx = file.name.split(".")[1] === "xlsx";
      if (xls || xlsx) {
        return true;
      }
      this.$message.error("请上传正确的文件格式：xls、xlsx");
      return false;
    },

    // 上传失败
    handleUploadError(err) {
      this.$message.error("上传失败，请重试:", err);
    },

    // 上传成功回调
    handleUploadSuccess(res, file) {
      console.log("res:", res);
      console.log("code:", res.code);
      console.log(file);

      if (res.code == 500) {
        return this.$message.error("上传失败，存在重复编码，请联系管理员！");
      }
      this.getList();
      this.$message.success("上传成功");
    },

    // 下载
    // downloadTemplate() {
    // getInfoByFileType({ fileType: 1 }).then((res) => {
    //   this.handleDownload(res.data.url);
    // });
    // },

    // 时间选择
    changeQueryTime() {
      this.queryParams.planStartTime = this.queryDateArray[0];
      this.queryParams.stopTime = this.queryDateArray[1];
    },
  },
};
</script>

<style></style>
