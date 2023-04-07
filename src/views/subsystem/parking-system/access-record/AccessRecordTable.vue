<template>
  <div>
    <div class="assembly-table-title">{{ title }}<span>进出记录</span></div>
    <div class="assembly-table-main">
      <!-- 查询选项 -->
      <el-form
        v-show="showSearch"
        :model="queryParams"
        ref="queryForm"
        :rules="queryFormRules"
        :inline="true"
      >
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input
            v-model="queryParams.plateNumber"
            placeholder="请输入车牌号"
            class="form-width"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="出/入场设备名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输出/入场设备名称"
            clearable
            size="small"
            class="form-width"
          />
        </el-form-item>

        <el-form-item label="放行方式" prop="releaseWay">
          <el-input
            v-model="queryParams.releaseWay"
            placeholder="请输放行方式"
            clearable
            size="small"
            class="form-width"
          />
        </el-form-item>

        <el-form-item label="记录类型" prop="recordType">
          <el-select
            v-model="queryParams.recordType"
            placeholder="请选择记录类型"
            clearable
            size="small"
            class="form-width"
          >
            <el-option
              v-for="item in recordOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="出/入场时间" prop="recordTime">
          <el-date-picker
            v-model="queryParams.recordTime"
            type="datetimerange"
            range-separator="-"
            size="small"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <!-- 导出 -->
        <el-col :span="1.5">
          <el-button
            type="primary"
            :disabled="false"
            @click="bindingClick"
            icon="el-icon-download"
          >
            导出
          </el-button>
        </el-col>

        <!-- 打印 -->
        <el-col :span="1.5">
          <el-button :disabled="false" @click="print" icon="el-icon-printer">
            打印
          </el-button>
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <!-- table表格 -->
      <el-table
        v-loading="loading"
        :row-key="rowKey"
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" align="center" />
        <el-table-column
          label="出/入场设备名称"
          align="center"
          prop="deviceName"
        />
        <el-table-column label="车牌号码" align="center" prop="plateNo" />
        <el-table-column label="车牌颜色" align="center" prop="carColor" />
        <el-table-column label="记录类型" align="center" prop="recordType" />
        <el-table-column label="出/入场时间" align="center" prop="recordTime" />
        <el-table-column label="放行结果" align="center" prop="releaseResult" />
        <el-table-column label="放行方式" align="center" prop="releaseWay" />
        <el-table-column
          label="车辆图片"
          align="center"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              v-if="scope.row.recordType == '进'"
              plain
              @click="handleDetail(scope.row, '入场')"
              >入场</el-button
            >
            <el-button
              icon="el-icon-view"
              v-else
              plain
              @click="handleDetail(scope.row, '出场')"
              >出场</el-button
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
    <!-- 查看详情-弹框 -->
    <access-detail ref="modelForm"></access-detail>
  </div>
</template>
<script>
import { getParkinglotRecord } from "@/api/subsystem/parking-system/parking-system.js";

import { TableListMixin } from "@/mixins/TableListMixin";
import AccessDetail from "./AccessDetail";

export default {
  mixins: [TableListMixin],
  components: {
    AccessDetail,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "id",
      recordOptions: [], //记录类型数组
      title: "全部", //标题
      queryParams: {
        deviceName: "", //入场设备名称
        plateNumber: "", //车牌号
        recordType: "", //记录类型（入场0，出场1）
        recordTime: [], //入场时间
        releaseWay: "", //放行方式
        regionId: 0, //区域
        pageNum: 1,
        pageSize: 10,
      },
      // 检索验证
      queryFormRules: {
        plateNumber: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
        deviceName: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
        releaseWay: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getParkinglotRecord,
      },
    };
  },
  created() {
    //获取记录类型数据
    this.getDicts("parking_record_type").then((res) => {
      this.recordOptions = res.data.map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue,
        };
      });
    });
  },
  methods: {
    filterTag(value, row) {
      return row.recordType === value;
    },
    //导出
    bindingClick() {
      if (this.selectedRowKeys.length > 0) {
        this.download(
          "/parkinglot/record/export",
          {
            ids: this.selectedRowKeys,
          },
          "停车场车辆进出记录.xlsx"
        );
      } else {
        this.$message({
          message: "由于记录数据过大，请选择需要导出的数据",
          type: "warning",
        });
      }
    },
    // 打印
    print() {
      printJS({
        printable: this.tableList,
        properties: [
          { field: "deviceName", displayName: "出/入场设备名称" },
          { field: "plateNo", displayName: "车牌号码" },
          { field: "carColor", displayName: "车辆颜色" },
          { field: "recordType", displayName: "记录类型" },
          { field: "recordTime", displayName: "出/入场时间" },
          { field: "deviceCode", displayName: "出/入场设备ID" },
        ],
        type: "json",
        gridStyle: "border: 1px solid #3971A5; text-align: center",
        gridHeaderStyle: "border: 1px solid #3971A5;",
        scanStyles: false, // 不适用默认样式
        repeatTableHeader: false, // 打印json表头只显示在第一页
        style: "@page{size: auto; margin: 0cm 1cm 0cm 1cm;}", // 去除页眉页脚
        // scanStyles: false,
      });
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
  span {
    margin-left: 5px;
  }
}
// 内容
.assembly-table-main {
  padding: 20px;
}

.form-width {
  width: 150px;
}
.el-input {
  width: 200px;
}
</style>
