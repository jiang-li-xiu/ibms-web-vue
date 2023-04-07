<template>
  <div>
    <div class="assembly-table-title">{{ title }}</div>
    <div class="assembly-table-main">
      <!-- 查询选项 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item
          label="创建时间："
          prop="dateTime"
          class="assembly-margin-10"
        >
          <el-date-picker
            v-model="queryParams.dateTime"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" " label-width="100px">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 导出 -->
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="2.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            :disabled="false"
            @click="bindingClick"
          >
            导出
          </el-button>
        </el-col> -->
        <el-col :span="2.5">
          <el-button
            type="warning"
            icon="el-icon-setting"
            :disabled="false"
            @click="viewdetailsClick"
          >
            设置
          </el-button>
        </el-col>

        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <!-- table表格 -->
      <el-table
        :height="tableHeight"
        v-loading="loading"
        :row-key="rowKey"
        :data="tableList"
        @selection-change="handleSelectionChange"
        :page-sizes="[15, 20, 30, 50]"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="设备名称"
          align="center"
          width="150"
          fixed="left"
          prop="deviceName"
        />
        <el-table-column
          label="创建时间"
          align="center"
          width="200"
          prop="createTime"
        />
        <el-table-column label="CO浓度" align="center" prop="co" />
        <el-table-column label="CO2浓度" align="center" prop="co2" />
        <el-table-column label="PM10浓度" align="center" prop="pmTen" />
        <el-table-column label="PM2.5浓度" align="center" prop="pmOneFourth" />
        <el-table-column label="温度" align="center" prop="temp" />
        <el-table-column label="湿度" align="center" prop="humi" />
        <!-- <el-table-column label="光照强度" align="center" prop="light" /> -->
        <!-- <el-table-column label="负离子浓度" align="center" prop="ion" /> -->
        <el-table-column label="噪音" align="center" prop="noise" />
        <!-- <el-table-column label="紫外线" align="center" prop="uv" /> -->
        <el-table-column label="风向" align="center" prop="windDirection" />
        <el-table-column label="风速" align="center" prop="windSpeed" />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 设置-弹框 -->
    <monitoring-detail ref="setDialog"></monitoring-detail>
  </div>
</template>
<script>
import { getSelectEnvironmentData } from "@/api/subsystem/envir-monitoring/envir-monitoring.js";
import { TableListMixin } from "@/mixins/TableListMixin";
import MonitoringDetail from "./MonitoringDetail";

export default {
  mixins: [TableListMixin],
  components: {
    MonitoringDetail,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "dataId",
      tableHeight: 0, //表格高度
      title: "全部", //标题
      frequency: 30, //频率值
      time: [],
      queryParams: {
        regionId: 0, //区域id
        startTime: "", //开始时间
        endTime: "", //结束时间
        pageNum: 1,
        pageSize: 10,
      },
      // 接口集合
      interface: {
        getTableList: getSelectEnvironmentData,
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
  },
  methods: {
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 380;
    },
    //导出
    bindingClick() {
      const _this = this;
      let msg = "是否确认导出选中数据？";
      if (this.selectedRowKeys.length == 0) {
        msg = "是否确认导出全部数据？";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (_this.selectedRowKeys.length == 0) {
            _this.download(
              "/environment/exportData",
              {},
              `环境监控数据_${new Date().getTime()}.xlsx`
            );
          } else {
            _this.download(
              "/environment/exportData",
              { dataIds: _this.selectedRowKeys },
              `环境监控数据_${new Date().getTime()}.xlsx`
            );
          }
        })
        .catch(() => {});
    },
    /** 查询按钮操作 */
    handleQuery() {
      if (this.queryParams.dateTime) {
        this.queryParams.startTime = this.queryParams.dateTime[0];
        this.queryParams.endTime = this.queryParams.dateTime[1];
      } else {
        this.queryParams.startTime = "";
        this.queryParams.endTime = "";
      }
      this.queryParams.pageNum = 1;
      this.getList();
    },
    //设置
    viewdetailsClick() {
      this.$refs.setDialog.edit();
    },
  },
  watch: {
    treeNode: {
      handler(newVal) {
        this.queryParams.regionId = newVal.regionId;
        this.tableTitle = newVal.regionName;
        this.getList();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>
