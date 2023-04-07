<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-10-08 15:43:17
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-27 09:34:56
-->
<template>
  <el-card class="min-height-124">
    <div class="table-title">{{ title }}</div>
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
      <el-form-item label="设备状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择设备状态"
          clearable
        >
          <el-option label="在线" value="1" />
          <el-option label="离线" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作方法 -->
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <!-- table表格 -->
    <el-table
      :height="tableHeight"
      v-loading="loading"
      :data="tableList"
      border
    >
      <el-table-column label="设备ID" align="center" prop="deviceCode" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备类型" align="center" prop="deviceType" />
      <el-table-column label="所属区域" align="center" prop="regionName" />
      <el-table-column label="在线状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == '在线'">{{
            scope.row.status
          }}</el-tag>
          <el-tag type="danger" v-else>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="danger"
            v-if="scope.row.isStop == 1"
            @click="switchChange(scope.row.deviceCode, 1)"
            >关闭</el-button
          >
          <el-button
            type="primary"
            v-else
            @click="switchChange(scope.row.deviceCode, 0)"
            >开启</el-button
          >

          <!-- <div class="state-switch">
              <el-switch
                v-if="scope.row.isStop == '1'"
                v-model="scope.row.isStop"
                class="switchStyle"
                active-color="#13ce66"
                inactive-color="#989898"
                active-text="正在播放"
                inactive-text="已停止"
                active-value="1"
                inactive-value="0"
                @change="switchChange(scope.row)"
              ></el-switch>
              <el-switch
                v-else-if="scope.row.isStop == '0'"
                v-model="scope.row.isStop"
                class="switchStyle"
                active-color="#13ce66"
                inactive-color="#989898"
                active-text="正在播放"
                inactive-text="已停止"
                active-value="1"
                inactive-value="0"
                @change="switchChange(scope.row)"
              ></el-switch> -->
          <!-- </div> -->
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
  </el-card>
</template>

<script>
import {
  getInfomationsList,
  getInfoSendControl,
} from "@/api/subsystem/information-release/information-release";
import { TableListMixin } from "@/mixins/TableListMixin";

export default {
  mixins: [TableListMixin],
  props: {
    treeNode: Object,
  },
  data() {
    return {
      title: "全部", //标题
      tableHeight: 0, //表格高度
      queryParams: {
        regionId: 0,
        pageNum: 1,
        pageSize: 10,
        deviceName: "", // 设备名称
        status: "", // 设备状态(1在线，0离线)
        isStop: "", //是否正在播放
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
      interface: {
        getTableList: getInfomationsList,
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
    //开关
    switchChange(deviceCode, isStop) {
      getInfoSendControl({
        deviceCode: deviceCode,
        isStop: isStop,
      }).then((response) => {
        this.getList();
        this.$message.success(response.message);
      });
    },
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 350;
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
