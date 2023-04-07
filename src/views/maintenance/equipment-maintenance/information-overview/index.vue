<!--
 * @Author: RobertFan
 * @Date: 2022-06-06 11:52:13
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-06-22 16:25:47
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
        
        <el-form-item label="任务时间:">
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
        :height="650"
        class="table"
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleDetail(scope.row)"
              v-hasPermi="['equipment:informationOverview:detail']"
              >查看详情</el-button
            >
            <!-- <el-button
              v-show="scope.row.maintenanceState == 0"
              type="success"
              icon="el-icon-plus"
              @click="addTask()"
              >维 保</el-button
            > -->
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
    <details-dialog ref="modelForm" @ok="modalFormOk"></details-dialog>
  </div>
</template>

<script>
import { getTableList, getDeviceType } from "@/api/maintenance/standerItems";
import detailsDialog from "./DetailsDialog";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  components: {
    detailsDialog,
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
        //  {
        //   taskName: "国家级任务",
        //   taskDescribe: "我是一只熊",
        //   deviceTypeName: "摄像头",
        //   maintenanceGrade: "保准级别",
        //   planStartTime: "2022-05-20",
        //   stopTime: "2022-06-23",
        //   repeatWay: "地狱模式",
        //   timeInterval: "一周",
        //   supervisePerson: "robert",
        //   taskState: "hello",
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
        // 获取表格数据
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
    addTask() {
      console.log(123);
      this.$refs.addForm.add();
    },

    // 子组件传过来的函数
    modalFormOk() {},

    // 获取设备类型
    getDeviceType() {
      getDeviceType()
        .then((res) => {
          if (res.code == 200) {
            // console.log('设备类型',res.data);
            this.DeviceType = res.data;
          }
        })
        .catch(() => {
          this.$message.error("获取设备失败");
        });
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
