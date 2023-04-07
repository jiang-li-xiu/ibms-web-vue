<template>
  <div class="main-box">
    <el-card class="min-height-124">
      <!-- 查询 -->

      <!-- 表单 -->
      <el-form ref="queryForm" :model="queryParams" :rules="queryFormRules" :inline="true">
        <el-form-item label="地点名称" prop="positionName">
          <el-input v-model="queryParams.positionName" placeholder="请输入地点名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="人员名称" prop="peopelName">
          <el-input v-model="queryParams.peopelName" placeholder="请输入人员名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 导出 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" @click="bindingClick">导出</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button :disabled="false" @click="print" icon="el-icon-printer">打印</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>

      </el-row>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableList" border :row-key="rowKey"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" label="地点名称" prop="positionName"></el-table-column>
        <el-table-column align="center" label="巡检时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="巡更路线" prop="routeName"></el-table-column>

        <el-table-column align="center" label="人员名称" prop="peopelName"></el-table-column>
        <el-table-column align="center" label="巡检状态" prop="statusName">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 1">{{ scope.row.statusName }}</el-tag>
            <el-tag type="danger" v-else>{{ scope.row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="地点图片" prop="images">
          <template slot-scope="scope">
            <el-image style="width: 50px; height: 50px" :src="scope.row.images"
              :preview-src-list="[...scope.row.images]">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination class="pagination" v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script>
import { getRecordList } from "@/api/subsystem/electronic-patrol/patrol-record/index.js";
import printJS from "print-js";
import { TableListMixin } from "@/mixins/TableListMixin";

export default {
  mixins: [TableListMixin],
  data() {
    return {
      rowKey: "id",

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // 卡号
        cardNum: "",
        // 巡检时间（巡更时间）
        patrolTime: "",
        // 巡检器号码（设备编码）
        deviceCode: "",
        // 巡检器名称（设备名称）
        deviceName: "",
        // 地点名称
        positionName: "",
        // 人员名称
        peopelName: "",
        queryStartTime: "",
        queryEntTime: "",
        queryTime: "",
      },
      // 检索验证
      queryFormRules: {
        positionName: [
          // {
          //   validator: this.validateQueryFormRules,
          //   trigger: ["blur", "change"],
          // },
        ],
        deviceName: [
          // {
          //   validator: this.validateQueryFormRules,
          //   trigger: ["blur", "change"],
          // },
        ],
        peopelName: [
          // {
          //   validator: this.validateQueryFormRules,
          //   trigger: ["blur", "change"],
          // },
        ],
      },

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getRecordList,
      },
    };
  },

  methods: {
    // 打印
    print() {
      printJS({
        printable: this.tableList,
        properties: [
          { field: "cardNum", displayName: "卡号", columnSize: 1 },
          { field: "positionName", displayName: "地点名称", columnSize: 1 },
          { field: "patrolTime", displayName: "巡检时间", columnSize: 1 },
          { field: "uploadTime", displayName: "上传时间", columnSize: 1 },
          { field: "deviceCode", displayName: "巡检器号码", columnSize: 1 },
          { field: "deviceName", displayName: "巡检器名称", columnSize: 1 },
          { field: "peopelName", displayName: "人员名称", columnSize: 1 },
          { field: "deptName", displayName: "部门", columnSize: 1 },
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
    // 获取巡检时间并拆分
    updateQueryTime() {
      if (this.queryParams.queryTime) {
        this.queryParams.queryStartTime = this.queryParams.queryTime[0];
        this.queryParams.queryEntTime = this.queryParams.queryTime[1];
      }
    },

    // 导出
    bindingClick() {
      this.download(
        "patrol/record/export",
        // 按查询导出
        {
          ids: this.selectedRowKeys,
        },
        // 按选择导出
        // { deviceIds: this.ids },
        `巡更记录.xlsx`
      );
    },

    /* 重置按钮操作 */
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams.queryStartTime = "";
      this.queryParams.queryEntTime = "";
      this.queryParams.queryTime = null;
      this.handleQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
