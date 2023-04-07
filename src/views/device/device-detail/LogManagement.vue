<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-31 11:06:35
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-13 18:32:52
-->
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="日志类型" prop="deviceinfoHistoryType">
        <el-select
          v-model="queryParams.deviceinfoHistoryType"
          placeholder="请选择类型"
          clearable
          size="small"
        >
          <el-option
            v-for="item in historyType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日志时间" prop="createTime">
        <!-- <el-date-picker
          v-model="createTime"
          type="daterange"
          align="right"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker> -->
        <el-date-picker
          v-model="createTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 列表操作功能 -->
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:history:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:history:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->

    <el-table
      :height="tableHeight"
      v-loading="loading"
      :data="historyList"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column
        label="设备日志id"
        align="center"
        prop="deviceinfoHistoryId"
      /> -->
      <el-table-column
        label="日志类型"
        align="center"
        prop="deviceinfoHistoryInfo"
      />
      <el-table-column label="操作时间" align="center" prop="createTime" />

      <el-table-column label="备注" align="center" prop="remarks" />
      <!-- <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:history:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listHistory } from "@/api/device/history";

export default {
  name: "LogManagement",
  props: {
    deviceId: Number,
  },
  components: {},
  data() {
    return {
      // 日志类型下拉数据
      historyType: [],
      // 表格自适应高度
      tableHeight: 0,
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
      // 设备日志表格数据
      historyList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceinfoHistoryType: null,
        deviceDeviceinfoId: null,
        startTime: null,
        endTime: null,
      },
      // 时间选择数据
      createTime: "",
      // 最近时间参数
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
    };
  },
  created() {
    // this.getList();
    this.getHeight();
    window.addEventListener("resize", this.getHeight);
    this.getDicts("device_operation_type").then((res) => {
      this.historyType = res.data.map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue,
        };
      });
    });
  },
  methods: {
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 430;
    },
    /** 查询设备日志列表 */
    getList() {
      this.loading = true;
      listHistory(this.queryParams).then((response) => {
        this.historyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.createTime = null;
      this.queryParams.startTime = null;
      this.queryParams.endTime = null;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceinfoHistoryId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    // /** 删除按钮操作 */
    // handleDelete(row) {
    //   const deviceinfoHistoryIds = row.deviceinfoHistoryId || this.ids;
    //   this.$confirm('是否确认删除设备日志编号为"' + deviceinfoHistoryIds + '"的数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return delHistory(deviceinfoHistoryIds);
    //     }).then(() => {
    //       this.getList();
    //       this.msgSuccess("删除成功");
    //     }).catch(() => {});
    // },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/history/export",
        {
          ...this.queryParams,
        },
        `system_history.xlsx`
      );
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  watch: {
    createTime: {
      handler(newVal) {
        // console.log(newVal);
        if (newVal !== null) {
          this.queryParams.startTime = newVal[0];
          this.queryParams.endTime = newVal[1];
        }
      },
    },
    deviceId: {
      handler(newVal) {
        // console.log(newVal);
        this.queryParams.deviceDeviceinfoId = newVal;
        this.getList();
      },
    },
  },
};
</script>