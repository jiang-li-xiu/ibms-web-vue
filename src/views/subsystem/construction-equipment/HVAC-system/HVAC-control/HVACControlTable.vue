<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-10-08 15:43:17
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-24 15:58:01
-->
<template>
  <el-card class="min-height-124">
    <div class="table-title">{{ tableTitle }}</div>
    
      <!-- 查询选项 -->
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="设备状态" prop="isStatus" >
          <el-select
            v-model="queryParams.isStatus"
            placeholder="请选择设备状态"
            clearable
          >
            <el-option label="在线" value="0" />
            <el-option label="离线" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" @click="bindingClick"
            >导出</el-button
          >
        </el-col> -->
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>
      <!-- table表格 -->
      <el-table :height="tableHeight" v-loading="loading" :data="tableList" border>
        <el-table-column label="设备名称" align="center" prop="deviceName" show-overflow-tooltip />
        <el-table-column label="设备位置" align="center" prop="regionName" show-overflow-tooltip />
        <el-table-column label="环境温度（℃）" align="center" prop="temp" />
        <el-table-column align="center" label="在线状态" prop="isStatus">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
          <el-tag type="danger" v-else>离线</el-tag>
        </template>
      </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="150"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
            icon="el-icon-coordinate"
            @click="handleDetail(scope.row)"
            >控制</el-button
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
    <control-detail ref="modelForm" @ok="modalFormOk"></control-detail>
  </el-card>
</template>

<script>
import {
  getTableList,
} from "@/api/subsystem/construction-equipment/HVAC-system/HVACControl.js";

import ControlDetail from "./ControlDetail"

import { TableListMixin } from "@/mixins/TableListMixin";

export default {
  mixins: [TableListMixin],
  components: {
    ControlDetail
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      tableTitle: "全部", //标题
      showSearch: true, // 显示搜索条件
      tableHeight: 0, //表格高度
      loading: "", //加载
      regioninfoList: [], //table数据
      total: 0, //数据量
      queryParams: {
        regionId: 0,
        pageNum: 1,
        pageSize: 10,
        deviceName: "", // 设备名称
        status: "", // 设备状态(1开启，0离线)
      },
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getTableList,
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    //温度条
    format(percentage) {
      return `${percentage}℃`;
    },
    // 导出
    bindingClick() {
      /*  const _this = this;
      let msg = "是否确认导出选中数据？";
      if (this.ids.length == 0) {
        msg = "是否确认导出数据？";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (_this.ids.length == 0) {
            _this.download(
              "/infomations/plan/export",
              this.queryParams,
              `抄表数据_${new Date().getTime()}.xlsx`
            );
          } else {
            let url = "/infomations/plan/exportMore/" + this.ids;
            _this.download(url, {}, `抄表数据_${new Date().getTime()}.xlsx`);
          }
        })
        .catch(() => {}); */
    },
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 350;
    },
  },
  watch: {
    treeNode: {
      handler(newVal) {
        this.queryParams.regionId = newVal.regionId
        this.tableTitle = newVal.regionName
        this.getList()
      },
    },
  },
};
</script>

<style lang="scss">
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
/* 开关 */
.state-switch {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.state-switch > div:last-child {
  margin-top: 10px;
}
.switchStyle {
  margin-top: 0 !important;
}
.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}

.switchStyle .el-switch__label--left {
  z-index: 9;
  left: 6px;
}

.switchStyle .el-switch__label--right {
  z-index: 9;
  left: -14px;
}

.switchStyle .el-switch__label.is-active {
  display: block;
}

.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 70px !important;
}
.onstate {
  color: #95f204;
}
.unstate {
  color: #aaaaaa;
}
</style>
