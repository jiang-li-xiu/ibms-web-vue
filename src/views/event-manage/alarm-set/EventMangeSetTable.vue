<!--
 * @Author: MJ
 * @Date: 2021-07-20 11:15:23
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-27 10:13:01
 * @Description:
-->

<template>
  <el-card class="min-height-124">
    <!-- 标题 -->
    <div class="table-title">{{ tableTitle }}</div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="告警名称" prop="alarmName">
        <el-input
          v-model="queryParams.alarmName"
          placeholder="请输入告警名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="告警等级" prop="alarmLevel">
        <el-select
          v-model="queryParams.alarmLevel"
          placeholder="请选择告警等级"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in alarmLevelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择处理状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in arrangeStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click.stop="handleAdd" icon="el-icon-plus"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="deviceAlarmList" border>
      <el-table-column
        prop="alarmName"
        label="警告名称"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
      ></el-table-column>

      <el-table-column label="运行状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">启用</el-tag>
          <el-tag type="danger" v-else>停用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="告警等级" align="center">
        <template slot-scope="scope">
          {{ milestoneStatusFormat(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="350">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click.stop="handleDelete(scope.row.id)"
            >删除</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-circle-close"
            v-if="scope.row.status == 0"
            @click.stop="editStatusSetTing(scope.row)"
            >停用</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-circle-check"
            v-else
            @click.stop="editStatusSetTing(scope.row)"
            >启用</el-button
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

    <thing-edit-set-ting-panel
      @receiveComponents="receiveComponents"
      ref="modelForm"
      :alarmLevelOptions="alarmLevelOptions"
    ></thing-edit-set-ting-panel>
  </el-card>
</template>

<script>
import {
  getDeviceAlarmList,
  deleteDeviceAlarm,
  putDeviceAlarmStatusUpdate,
} from "@/api/device/deviceClasses";
import ThingEditSetTingPanel from "./component/ThingEditSetTingPanel";
import { TableListMixin } from "@/mixins/TableListMixin";

export default {
  mixins: [TableListMixin],
  name: "ThingDetails",
  components: {
    ThingEditSetTingPanel,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      tableTitle: "全部",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        alarmName: null,
        alarmLevel: null,
        status: "",
        subsystemCode: null,
        deviceTypeId: null,
        regionId: "",
      },
      alarmLevelOptions: [],
      arrangeStatusOptions: [],
      // 告警设置列表
      deviceAlarmList: [],
      interface: {
        delList: deleteDeviceAlarm,
      },
    };
  },

  mounted() {
    /*获取字典*/
    this.getDicts("manager_level").then((response) => {
      this.alarmLevelOptions = response.data;
    });
    this.getDicts("ibms_active_status").then((response) => {
      this.arrangeStatusOptions = response.data;
    });
  },
  methods: {
    // 字典翻译
    milestoneStatusFormat(row) {
      return this.selectDictLabel(this.alarmLevelOptions, row.alarmLevel);
    },

    // 接收 告警设置-告警设置 新增 面板的显示/隐藏 数据
    receiveComponents(data) {
      if (data.type == "triggers") {
        this.getList();
      }
    },

    // 告警设置-告警设置-修改状态
    editStatusSetTing(row) {
      let obj = { ...row };
      obj.status = obj.status == 0 ? 1 : 0;
      putDeviceAlarmStatusUpdate(obj).then((response) => {
        if (response.code == 200) {
          this.getList();
          this.$message({
            type: "success",
            message: "修改成功!",
          });
        }
      });
    },

    // 获取告警设置列表
    getList() {
      this.loading = true;
      getDeviceAlarmList(this.queryParams).then((response) => {
        let {
          data: { records, total },
        } = response;
        this.deviceAlarmList = records;
        this.total = total;
        this.loading = false;
      });
      //重置
      this.queryParams.deviceTypeId = null;
      this.queryParams.subsystemCode = null;
    },
  },
  watch: {
    treeNode: {
      handler(newVal) {
        let code = newVal.code;
        let index = code == null ? -1 : code.indexOf("&");
        if (index !== -1) {
          this.queryParams.deviceTypeId = newVal.code.substring(
            index + 1,
            newVal.code.length
          );
        } else {
          this.queryParams.subsystemCode = code;
        }
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
