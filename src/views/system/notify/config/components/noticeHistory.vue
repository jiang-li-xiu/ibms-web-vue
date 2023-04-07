<!--
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-08-10 09:58:40
 * @LastEditors: Chen
 * @LastEditTime: 2021-08-10 15:46:52
-->
<template>
  <div>
    <el-drawer
      title="通知记录"
      :before-close="handleBeforeClose"
      @closed="closedDrawer"
      :visible.sync="drawerOpen"
      :wrapperClosable="true"
      append-to-body
      size="45%"
      ref="drawer"
    >
      <div class="drawer_center">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="通知时间" prop="notifyTime">
            <el-date-picker
              v-model="queryParams.notifyTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              style="width: 100%"
              placeholder="请选择"
            >
              <el-option
                v-for="status in statusOptions"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              ></el-option>
            </el-select>
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

        <el-table v-loading="loading" :height="height" :data="historyList">
          <el-table-column label="序号" align="center" prop="id" width="250%" />
          <el-table-column label="通知时间" align="center" prop="notifyTime" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === 'SUCCESS' ? 'success' : 'danger'"
                size="mini"
                effect="dark"
              >
                {{ scope.row.status === "SUCCESS" ? "成功" : "失败" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                slot="reference"
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleDetails(scope.row)"
                >查看</el-button
              >
              <el-button
                v-if="scope.row.status !== 'SUCCESS'"
                slot="reference"
                size="mini"
                type="text"
                icon="el-icon-search"
                @click="handleErrorDetails(scope.row)"
                >错误日志</el-button
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
      </div>
    </el-drawer>

    <el-dialog title="详情" width="680px" :visible.sync="dialogVisible">
      <json-viewer
        :value="context"
        :expand-depth="2"
        copyable
        sort
      ></json-viewer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageListByHistory } from "@/api/system/notify";

export default {
  name: "noticeHistory",
  data() {
    return {
      drawerOpen: false,
      loading: false,
      dialogVisible: false,
      context: undefined,
      height: 0,
      historyList: [],
      statusOptions: [
        { value: "SUCCESS", label: "成功" },
        { value: "FAILURE", label: "失败" },
      ],
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
      total: 0,
      confId: undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        notifyTime: undefined,
        startTime: undefined,
        endTime: undefined,
        status: undefined,
      },
    };
  },
  methods: {
    init(confId) {
      this.$nextTick(() => {
        this.drawerOpen = true;
        this.confId = confId;
        this.getList();
      });
    },
    getList() {
      this.loading = true;

      pageListByHistory(this.confId, this.queryParams)
        .then((res) => {
          this.loading = false;
          this.historyList = res.data.records;
          this.total = res.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.$refs["queryForm"].resetFields();
      this.getList();
    },
    handleBeforeClose(done) {
      done();
    },
    closedDrawer() {
      this.$refs["queryForm"].resetFields();
    },
    handleDetails(row) {
      this.context = row.context;
      this.dialogVisible = true;
    },
    handleErrorDetails(row) {
      this.context = row.errorMsg;
      this.dialogVisible = true;
    },
  },
  mounted() {
    this.height = document.body.clientHeight * 0.7;
  },
};
</script>

<style scoped>
.drawer_center {
  margin: 15px;
}
</style>
