<!--
 * @Author: RobertFan
 * @Date: 2022-06-06 11:52:13
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-06-22 16:25:25
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

        <el-form-item label="维保状态:" prop="maintenanceState">
          <el-select
            v-model="queryParams.maintenanceState"
            placeholder="请选择维保状态"
            clearable
            filterable
          >
            <el-option
              v-for="dict in maintenanceStatusDict"
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
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['subsystem:linkRecord:export']"
            >导出</el-button
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
        :height="650"
        :row-key="rowKey"
        v-loading="loading"
        :data="tableList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="标准任务名称"
          align="center"
          prop="taskName"
          show-overflow-tooltip
        />
        <el-table-column
          label="任务描述"
          align="center"
          prop="taskDescribe"
          show-overflow-tooltip
        />
        <el-table-column
          label="设备类型"
          align="center"
          prop="deviceTypeName"
          show-overflow-tooltip
        />
        <el-table-column
          label="维保级别"
          align="center"
          prop="maintenanceGrade"
          show-overflow-tooltip
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
          label="开始日期"
          align="center"
          prop="planStartTime"
          show-overflow-tooltip
        />
        <el-table-column
          label="结束日期"
          align="center"
          prop="stopTime"
          show-overflow-tooltip
        />
        <el-table-column
          label="维保状态"
          align="center"
          prop="maintenanceState"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.maintenanceState == 0"
              >待维保</el-tag
            >
            <el-tag type="success" v-else>已维保</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="负责人"
          align="center"
          prop="supervisePerson"
          show-overflow-tooltip
        />
        <el-table-column width="300" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleDetail(scope.row)"
              v-hasPermi="['equipment:personalTasks:detail']"
              >查看详情</el-button
            >
            <el-button
              v-show="scope.row.maintenanceState == 0"
              type="success"
              icon="el-icon-plus"
              @click="addTask(scope.row.taskId)"
              v-hasPermi="['equipment:personalTasks:add']"
              >维 保</el-button
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

    <!-- 详情对话框 -->
    <details-dialog ref="modelForm" ></details-dialog>
    <!-- 添加维保任务对话框 -->
    <add-dialog ref="addForm" @ok="handleAdd" />
  </div>
</template>

<script>
import { getTableList } from "@/api/maintenance/personalTasks";
import { getDeviceType } from "@/api/maintenance/standerItems";
import detailsDialog from "./DetailsDialog";
import addDialog from "./AddMaintenanceDialog";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  components: {
    detailsDialog,
    addDialog,
  },
  data() {
    return {
      queryDateArray:[],
      // 获取设备类型数据列表
      DeviceType: [],
      // 维保状态数据字典
      maintenanceStatusDict: [],
      // 维保等级数据字典
      maintenanceGradeDict: [],
      // 唯一Id
      rowKey: "id",
      // 总条数
      total: 1,
      // 是否加载
      loading: false,
      // 表格数据
      tableList: [
        // {
        //   id: 1,
        //   taskName: "hello",
        //   taskDescription: "world",
        //   equipmentType: "iKun",
        //   Level: "am",
        //   startTime: "2022-06",
        //   endTime: "2022-05",
        //   status: "待维保",
        //   person: "喜洋洋",
        // },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskName: "",
        deviceTypeId: "",
        supervisePerson: null,
        maintenanceGrade: "",
        maintenanceState: null,
        planStartTime:"",
        stopTime:"",
      },
      interface: {
        // 获取个人任务列表
        getTableList: getTableList,
      },
    };
  },
  created() {
    // 获取维保状态数据字典
    this.getDicts("maintenance_state").then((response) => {
      this.maintenanceStatusDict = response.data;
    });
    // 获取维保级别数据字典列表
    this.getDicts("maintenance_grade").then((response) => {
      this.maintenanceGradeDict = response.data;
    });
    // 获取设备类型
    this.getDeviceType();
  },
  methods: {
    // getList() {},
    /** 重置检索 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryDateArray = []
      this.queryParams.planStartTime = "";
      this.queryParams.stopTime = "";
      this.handleQuery();
    },

    // 导出按钮
    handleExport() {
      this.download(
        "/access/device/export",
        {
          ids: this.selectedRowKeys,
        },
        "门禁设备管理.xlsx"
      );
    },

    // 添加维保信息
    addTask(id) {
      this.$refs.addForm.add(id);
    },

    // 获取设备类型
    getDeviceType() {
      getDeviceType()
        .then((res) => {
          if (res.code == 200) {
            // console.log("设备类型", res.data);
            this.DeviceType = res.data;
          }
        })
        .catch(() => {
          this.$message.error("获取设备失败");
        });
    },

    handleAdd() {
      this.getList();
    },

    // 时间选择
    changeQueryTime() {
      this.queryParams.planStartTime = this.queryDateArray[0];
      this.queryParams.stopTime = this.queryDateArray[1];
    },
  },
};
</script>

<style></style>
