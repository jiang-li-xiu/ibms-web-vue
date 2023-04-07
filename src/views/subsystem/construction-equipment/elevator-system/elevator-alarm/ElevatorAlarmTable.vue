<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-05-23 10:28:56
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-24 16:03:13
-->
<template>
  <el-card class="min-height-124">
    <!-- 标题 -->
    <div class="table-title table-title-head">{{ tableTitle }}</div>

    <!-- 查询选项 -->
    <el-form
      :inline="true"
      :model="queryParams"
      ref="queryForm"
      :rules="queryFormRules"
      v-show="showSearch"
    >
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        ></el-input>
      </el-form-item>

      <el-form-item label="告警时间：" prop="createTime">
        <el-date-picker
          v-model="queryDateArray"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          align="right"
          @change="changeQueryTime"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 按钮 -->
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          :disabled="false"
          @click="exportFil"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="false" @click="print" icon="el-icon-printer">
          打印
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->

    <!-- table表格 -->
    <el-table
      v-loading="loading"
      :data="tableList"
      :row-key="rowKey"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        align="center"
        label="告警区域"
        prop="regionName"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        align="center"
        label="告警名称"
        prop="deviceCode"
        show-overflow-tooltip
      /> -->
      <!-- <el-table-column
        align="center"
        label="设备类型"
        prop="deviceTypeName"
        show-overflow-tooltip
      /> -->
      <el-table-column
        align="center"
        label="设备名称"
        prop="deviceName"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        align="center"
        label="设备ID"
        prop="deviceName"
        show-overflow-tooltip
      /> -->
      <el-table-column
        align="center"
        label="告警时间"
        prop="createTime"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-view"
            @click="handleDetail(scope.row.deviceCode)"
          >
            详情
          </el-button>
        </template>
      </el-table-column> -->
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
</template>
<script>
import { TableListMixin } from "@/mixins/TableListMixin";
import { getRecordList } from "@/api/subsystem/construction-equipment/elevator/ElevatorEquipment.js";

export default {
  mixins: [TableListMixin],
  name: "ElevatorAlarmTable",
  components: {},
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "deviceId",
      tableTitle: "全部", //标题
      // 时间
      queryDateArray: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // 设备名称
        deviceName: "",
        isStatus: "",
        // plugId: "sub-entranceguard-hikvision",
        regionId: 0,
        startTime: null,
        endTime: null,
      },
      // 检索验证
      queryFormRules: {
        // deviceName: [
        //   {
        //     validator: this.validateQueryFormRules,
        //     trigger: ["blur", "change"],
        //   },
        // ],
      },
      // 字典
      ibmsDeviceState: [],
      // 接口集合
      interface: {
        getTableList: getRecordList,
      },
    };
  },
  created() {
    // 字典
    this.getDicts("ibms_device_state").then((response) => {
      this.ibmsDeviceState = response.data;
    });
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    changeQueryTime() {
      this.queryParams.startTime = this.queryDateArray[0];
      this.queryParams.endTime = this.queryDateArray[1];
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams= {
        pageNum: 1,
        pageSize: 10,
        deviceName: null,
        startTime: null,
        endTime: null,
      }
      this.queryDateArray= []
      this.handleQuery();
    },
    /** 获取表格数据列表 */
    getList() {
      this.loading = true;
      this.interface
        .getTableList(this.queryParams)
        .then((response) => {
          this.tableList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 查看控制
    handelControl(id) {
      this.$refs.control.open(id);
    },
    // 导出
    exportFil() {
      // this.download(
      //   "/device/deviceinfo/exportBy",
      //   {
      //     selectedRowKeys: this.selectedRowKeys,
      //     subSystem: "sub-entranceguard",
      //     subPlug: "sub-entranceguard-hikvision",
      //   },
      //   "热水交换设备管理.xlsx"
      // );
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
</style>
