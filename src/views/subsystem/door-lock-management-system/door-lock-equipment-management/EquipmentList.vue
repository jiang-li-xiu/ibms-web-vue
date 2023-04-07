<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 14:33:38
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-21 09:24:33
-->
<template>
  <el-card class="min-height-124">
    <!-- 标题 -->
    <div class="table-title">{{ tableTitle }}</div>

    <el-form
      :inline="true"
      ref="queryForm"
      :model="queryParams"
      class="demo-form-inline"
    >
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="设备状态" prop="isStatus">
        <el-select
          v-model="queryParams.isStatus"
          placeholder="请输入设备状态"
          clearable
        >
          <el-option label="在线" :value="0"></el-option>
          <el-option label="离线" :value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="">
        <el-button icon="el-icon-search" type="primary" @click="handleQuery"
          >查询
        </el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>

      <!-- 按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <!-- <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['bigdata:scriptManager:export']">
            导出
          </el-button> -->
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
        :row-key="rowKey"
      >
        <el-table-column type="selection" header-align="center" align="center">
        </el-table-column>
        <el-table-column
          label="设备名称"
          prop="deviceName"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="在线状态"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              class="state"
              :class="scope.row.isStatus == 0 ? 'onstate' : 'unstate'"
              >{{ scope.row.isStatus == 0 ? "在线" : "离线" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="updateTime"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="400"
        >
          <template slot-scope="scope">
            <!-- <el-button
              type="primary"
              icon="el-icon-s-tools"
              @click="handleSet(scope.row)"
              >设置
            </el-button> -->
            <el-button
              type="primary"
              plain
              icon="el-icon-key"
              @click="handleLock(scope.row, 1)"
              >开门
            </el-button>
            <el-button type="success" plain @click="handleLock(scope.row, 2)"
              >常开
            </el-button>
            <el-button type="warning" plain @click="handleLock(scope.row, 3)"
              >常闭
            </el-button>
            <el-button
              type="primary"
              plain
              @click="handleEditPassword(scope.row)"
              >修改密码
            </el-button>
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
    </el-form>

    <!-- 打开设备弹窗 -->
    <equipment-set-dialog
      ref="modelSet"
      @refresh="getList"
    ></equipment-set-dialog>

    <!-- 打开修改密码弹窗 -->
    <change-password-dialog  ref="changePassword"/>
  </el-card>
</template>

<script>
// API
import {
  getEquipmentList,
  getControlLock,
} from "@/api/subsystem/door-lock-management-system/doorLockEquipmentManagement.js";
// 混入
import { TableListMixin } from "@/mixins/TableListMixin";
// 组件
import EquipmentSetDialog from "./EquipmentSetDialog";
import ChangePasswordDialog from './ChangePasswordDialog'
export default {
  mixins: [TableListMixin],
  components: { EquipmentSetDialog,ChangePasswordDialog },
  props: {
    treeNode: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      // 表格唯一标识
      rowKey: "id",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        regionId: "", //	区域id
        deviceName: "", //设备名称
        equipmentId: "", //设备ID
        isStatus: null, //在线状态
        updataTime: null, //门锁更新时间
        // equipmentType: "", //设备类型
        // equipmentLoction: "", //设备位置
        // address: "", //网关地址
        // code: "", //网关码
      },
      //标题
      tableTitle: "全部",
      interface: {
        // 获取门锁设备列表
        getTableList: getEquipmentList,
      },
    };
  },
  methods: {
    // 打开设置弹窗
    handleSet(row) {
      this.$refs.modelSet.openSet(row);
    },

    // 点击开锁  mode 1：开门，2常开，3常闭
    handleLock(row, mode) {
      console.log(row, mode);
      getControlLock(row.deviceCode, mode).then(({ code, msg }) => {
        if (code == 200) {
          this.$message.success(msg);
        } else {
          this.$message.warning(msg);
        }
      });
    },

    // 修改密码
    handleEditPassword(row) {
      this.$refs.changePassword.edit(row)
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download("/", this.queryParams, `门锁设备管理.xlsx`);
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

<style></style>
