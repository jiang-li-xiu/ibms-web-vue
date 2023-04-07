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
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label-width="100px" label="设备状态" prop="isStatus">
          <el-select
            v-model="queryParams.isStatus"
            placeholder="请选择在线状态"
            clearable
          >
            <el-option label="在线" value="0" />
            <el-option label="离线" value="1" />
          </el-select>
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
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            :disabled="false"
            @click="bindingClick"
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
        :row-key="rowKey"
        :height="tableHeight"
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="设备名称" align="center" prop="deviceName" />
        <el-table-column label="设备编码" align="center" prop="deviceCode" />

        <el-table-column label="在线状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
            <el-tag type="danger" v-else>离线</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              plain
              @click="viewdetailsClick(scope.row, 1)"
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

    <!-- 设备详情-监测数据-弹框 -->
    <envir-monitoring-eqpt-detail
      ref="equipmentDetail"
    ></envir-monitoring-eqpt-detail>
    <!-- 设置 -->
    <el-dialog
      title="新增告警"
      :visible.sync="dialogVisible2"
      width="50%"
      @close="closes"
    >
      <!-- <new-alarm style="margin-top: -20px"></new-alarm> -->
      <thing-add-set-ting-panel
        @receiveComponents="receiveComponents"
        :inforDetails="addInof"
        ref="addFunc"
      ></thing-add-set-ting-panel>
    </el-dialog>
  </div>
</template>
<script>
import { getDeviceInfo } from "@/api/subsystem/envir-monitoring/envir-monitoring.js";

import NewAlarm from "./NewAlarmDialog.vue";
import ThingAddSetTingPanel from "@/components/ThingAddSetTingPanel";
import EnvirMonitoringEqptDetail from "./EnvirMonitoringEqptDetail";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  components: {
    NewAlarm,
    ThingAddSetTingPanel,
    EnvirMonitoringEqptDetail,
  },
  mixins: [TableListMixin],
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "deviceId",
      tableHeight: 0, // 表格高度
      title: "全部", // 标题
      dialogVisible2: false, // 设置弹框显示
      queryParams: {
        regionId: 0, //区域id
        deviceName: "", //设备名称
        isStatus: "", //设备状态
        pageNum: 1,
        pageSize: 10,
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
      addInof: {}, // 新增告警
      // 接口集合
      interface: {
        getTableList: getDeviceInfo,
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
    this.$set(this.addInof, "deviceTypeId", 51);
  },
  methods: {
    // 关闭弹窗
    closes() {
      this.$refs.addFunc.panelBtn(0);

      this.form = {
        equipmentType: "",
        equipmentName: "",
        remarks: "",
      };
    },

    // 接收 告警设置-告警设置 新增 面板的显示/隐藏 数据
    receiveComponents(data) {
      this.dialogVisible2 = false;
    },

    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 350;
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
              "/environment/export",
              {},
              `设备数据_${new Date().getTime()}.xlsx`
            );
          } else {
            _this.download(
              "/environment/export",
              { dataIds: _this.selectedRowKeys },
              `设备数据_${new Date().getTime()}.xlsx`
            );
          }
        })
        .catch(() => {});
    },
    //查看详情
    viewdetailsClick(row, type) {
      if (type == 0) {
        this.dialogVisible2 = true;
      } else {
        if (type == 1) {
          this.$refs.equipmentDetail.dialogTitle = "设备详情";
          this.$refs.equipmentDetail.equipment(row);
        } else if (type == 2) {
          this.$refs.equipmentDetail.dialogTitle = "监测数据";
          this.$refs.equipmentDetail.monitor(row);
        }
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
