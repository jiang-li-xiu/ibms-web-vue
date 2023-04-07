<!--
 * @Author: RobertFan
 * @Date: 2022-06-06 11:47:36
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-06-22 16:24:41
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
        label-width="auto"
      >
        <el-form-item label="检查项目:" prop="inspectProject">
          <el-input
            v-model="queryParams.inspectProject"
            placeholder="请输入检查项目"
            clearable
            @keyup.enter.native="handleQuery"
          />
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
            v-hasPermi="['equipment:maintenanceItems:add']"
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
              v-hasPermi="['equipment:maintenanceItems:import']"
              >导入</el-button>
          </el-upload>
        </el-col>

        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['equipment:maintenanceItems:export']"
            >导出</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete()"
            v-hasPermi="['equipment:maintenanceItems:remove']"
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
        class="table"
        border
        :height="650"
        :row-key="rowKey"
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="检查项目"
          align="center"
          prop="inspectProject"
        />
        <el-table-column label="步骤指导" align="center" prop="stepGuidance" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column width="350" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              v-hasPermi="['equipment:maintenanceItems:edit']"
              >修改</el-button
            >
            <el-button
              type="success"
              icon="el-icon-edit"
              @click="handleDetail(scope.row)"
              v-hasPermi="['equipment:maintenanceItems:detail']"
              >查看详情</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.maintenanceId)"
              v-hasPermi="['equipment:maintenanceItems:remove']"
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

    <!-- 添加、修改维保项目对话框 -->
    <add-edit-maintenance-dialog ref="modelForm" @ok="modalFormOk" />
  </div>
</template>

<script>
import { getTableList, deleteList } from "@/api/maintenance/maintenanceItems";
import { TableListMixin } from "@/mixins/TableListMixin";
import { getToken } from "@/utils/auth";
import AddEditMaintenanceDialog from "./AddEditMaintenanceDialog";
export default {
  mixins: [TableListMixin],
  components: {
    AddEditMaintenanceDialog,
  },
  data() {
    return {
      // 文件列表
      fileList: [],
      // 上传的图片服务器地址
      uploadFileUrl:
        process.env.VUE_APP_BASE_API + "/maintenance/project/importData",
      // 最大可上传文件个数
      limit: 5,
      // 设置上传的请求头部
      headers: {
        Authorization: "Bearer " + getToken(),
      },

      // 主键id
      rowKey: "maintenanceId",
      // 是否加载
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 总条数
      total: 0,
      // 维保项目表格数据
      tableList: [],
      // 接口地址
      interface: {
        // 获取表格数据
        getTableList: getTableList,
        // 表格数据的删除
        delList: deleteList,
      },
    };
  },
  created() {},
  methods: {
    // 导出
    handleExport() {
      this.download(
        "/maintenance/project/export",
        {
          ids: this.selectedRowKeys,
        },
        "维保项目管理.xlsx"
      );
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
      this.getList()
      this.$message.success("上传成功");
    },

    // 下载
    downloadTemplate(){
      
    }

    // 子组件回传的数据
    // modalFormOk() {},
  },
};
</script>

<style lang="scss" scoped></style>
