<!--
 * @Author: your name
 * @Date: 2021-09-08 19:10:41
 * @LastEditTime: 2022-05-17 16:47:54
 * @LastEditors: PengXuanwei
 * @Description: In User Settings Edit
 * @FilePath: \ibms-web-vue\src\views\subsystem\parking-system\parking-equipment\assembly-table.vue
-->
<template>
  <el-card class="min-height-124">
    <div class="table-title">{{ tableTitle }}</div>
    <!-- 查询选项 -->
    <el-form :model="queryParams" ref="queryForm" :rules="queryFormRules" :inline="true" v-show="showSearch">
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="设备状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择设备状态" clearable>
          <el-option label="在线" value="0" />
          <el-option label="离线" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 导出 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" :disabled="false" @click="bindingClick" icon="el-icon-download">
          导出
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" :disabled="multiple" icon="el-icon-edit" @click="handleEntry">
          批量录入账号/密码
        </el-button>
      </el-col>
    </el-row>

    <!-- table表格 -->
    <el-table v-loading="loading" :data="tableList" :row-key="rowKey" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <!-- <el-table-column label="设备ID" align="center" prop="deviceCode" /> -->
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
      <el-table-column label="账号/密码" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-view" @click="handleLook(scope.row)" plain>查看</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" @click="switchChange(scope.row, 1)">开门</el-button>
          <el-button type="success" @click="switchChange(scope.row, 2)">常开</el-button>
          <el-button type="info" @click="switchChange(scope.row, 3)">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 账号/密码组件 -->
    <account-password ref="accountPassword" @ok="modalFormOk"></account-password>
  </el-card>
</template>

<script>
import AccountPassword from "./AccountPassword";
import {
  getTableList,
  postSwitchOff,
  postSaveOrUpdate,
  getAccount,
} from "@/api/subsystem/visual-intercom/visitorsEqpt";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  components: { AccountPassword },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "deviceId",
      tableTitle: "全部", //标题
      ids: [], //多选后获取到的id
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // 区域ID
        regionId: 0,
        // 设备名称
        name: "",
        // 设备状态
        status: "",
      },
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getTableList,
      },
      // 检索验证
      queryFormRules: {
        name: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
      deviceCodes: [],
    };
  },

  methods: {
    // 批量添加账号/密码
    handleEntry() {
      this.$refs.accountPassword.add(this.deviceCodes);
    },

    // 查看单条数据账号/密码
    handleLook(record) {
      this.$refs.accountPassword.edit(record);
      this.$refs.accountPassword.title = "查看账号/密码";
    },

    // 多选框选中数据
    handleSelectionChange(row) {
      this.deviceCodes = row.map((item) => item.deviceCode);
      this.ids = row.map((item) => item.deviceId);
      this.multiple = !row.length;
    },

    // 导出
    bindingClick() {
      this.download(
        "/intercom/deviceExport",
        { ids: this.ids },
        "访客设备查看.xlsx"
      );
    },

    // 开门/关门
    switchChange(row, status) {
      this.$confirm("是否执行此操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        postSwitchOff({ id: row.deviceId, operation: status }).then(
          (response) => {
            if (response.code != 200)
              return this.$message.error(response.message);
            this.$message.success(response.message);
          }
        );
      })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
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

<style lang="scss">
</style>
