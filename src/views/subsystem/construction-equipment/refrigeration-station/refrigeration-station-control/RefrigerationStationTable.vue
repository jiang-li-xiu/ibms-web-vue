<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-05-23 11:00:24
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-24 16:03:42
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

      <el-form-item label="设备状态" prop="isStatus">
        <el-select
          v-model="queryParams.isStatus"
          placeholder="请选择设备状态"
          clearable
        >
          <el-option
            v-for="item in ibmsDeviceState"
            :label="item.dictLabel"
            :value="item.dictValue"
            :key="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 按钮 -->
    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
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
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- table表格 -->
    <el-table
      v-loading="loading"
      :data="tableList"
      :row-key="rowKey"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column
        align="center"
        label="设备名称"
        prop="deviceName"
        show-overflow-tooltip
      />
      
      <el-table-column
        align="center"
        label="设备位置"
        prop="regionName"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="温度（℃）"
        prop="temp"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="在线状态" prop="isStatus">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
          <el-tag type="danger" v-else>离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-view"
            @click="handleDetail(scope.row.deviceCode)"
          >
            详情
          </el-button>
          <el-button
            icon="el-icon-coordinate"
            @click="handleControl(scope.row.deviceCode)"
            >控制</el-button
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

    <refrigeration-station-detail ref="modelForm"></refrigeration-station-detail>
    <refrigertion-control ref="control" @ok="modalFormOk"></refrigertion-control>
  </el-card>
</template>
<script>
import { TableListMixin } from "@/mixins/TableListMixin";
import { getEquipmentList } from "@/api/subsystem/construction-equipment/refrigeration-station/RefrigerationStation.js";
import RefrigerationStationDetail from "./RefrigerationStationDetail"
import RefrigertionControl from "./RefrigertionControl"
export default {
  mixins: [TableListMixin],
  name: "RefrigerationStationTable",
  components: {
    RefrigerationStationDetail,
    RefrigertionControl,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "deviceId",
      tableTitle: "全部", // 标题
      // 请求列表参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // 设备名称
        deviceName: "",
        isStatus: "",
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
      // 字典
      ibmsDeviceState: [],
      // 接口集合
      interface: {
        getTableList: getEquipmentList,
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
    // 查看控制
    handleControl(id) {
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
      //   "冷冻站设备管理.xlsx"
      // );
    },
  },
  watch: {
    treeNode: {
      handler(newVal) {
        this.queryParams.regionId = newVal.regionId;
        this.tableTitle = newVal.regionName;
        this.getList();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
