<!--
 * @Author: your name
 * @Date: 2021-09-08 19:10:41
 * @LastEditTime: 2022-05-17 16:07:17
 * @LastEditors: PengXuanwei
 * @Description: In User Settings Edit
 * @FilePath: \ibms-web-vue\src\views\subsystem\parking-system\parking-equipment\assembly-table.vue
-->
<template>
  <div>
    <div class="assembly-table-title">{{ title }}</div>
    <div class="assembly-table-main">
      <!-- 查询选项 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :rules="queryFormRules"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="设备状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择设备状态"
            clearable
            size="small"
          >
            <el-option label="在线" value="0" />
            <el-option label="离线" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 导出 -->
      <el-row :gutter="10" class="mb8">
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
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="设备名称"
          align="center"
          prop="deviceName"
          show-overflow-tooltip
        />
        <!-- <el-table-column
          label="设备ID"
          align="center"
          prop="deviceCode"
          show-overflow-tooltip
        /> -->
        <el-table-column
          label="设备类型"
          align="center"
          prop="deviceTypeName"
          show-overflow-tooltip
        />
        <el-table-column
          label="设备位置"
          align="center"
          prop="regionName"
          show-overflow-tooltip
        />
        <el-table-column label="运行状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isStatus == 0">运行</el-tag>
            <el-tag type="danger" v-else>停止</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="在线状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
            <el-tag type="danger" v-else>离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        />

        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              plain
              @click="handleDetail(scope.row)"
              >详情</el-button
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
    <alarm-eqpt-detail ref="modelForm"></alarm-eqpt-detail>
  </div>
</template>

<script>
import bus from "@/utils/bus.js";
import { getAlarmEqptList } from "@/api/subsystem/alarm-eqpt/index.js";
import { TableListMixin } from "@/mixins/TableListMixin";
import AlarmEqptDetail from "./AlarmEqptDetail";
export default {
  mixins: [TableListMixin],
  components: {
    AlarmEqptDetail,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "deviceId",
      tableHeight: 0, //表格高度
      title: "全部", //标题
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceName: "",
        status: "",
        regionId: 0,
      },
      // 检索验证
      queryFormRules: {
        deviceName: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
      // 接口集合
      interface: {
        getTableList: getAlarmEqptList,
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
    //消防设备导出
    bindingClick() {
      if (this.selectedRowKeys.length > 0) {
        this.download(
          "/firealarm/firealarm/device/export",
          {
            ids: this.selectedRowKeys,
          },
          "消防设备.xlsx"
        );
      } else {
        this.$message({
          message: "由于记录数据过大，请选择需要导出的数据",
          type: "warning",
        });
      }
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
