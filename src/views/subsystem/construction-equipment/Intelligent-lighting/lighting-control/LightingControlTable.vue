<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-10-08 15:43:17
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-24 14:54:05
-->
<template>
  <div>
    <div class="assembly-table-main">
      <div class="table-title table-title-head">{{ tableTitle }}</div>
      <!-- 查询选项 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        label-width="68px"
        v-show="showSearch"
      >
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="设备状态" prop="isStatus">
          <el-select
            v-model="queryParams.isStatus"
            placeholder="请选择设备状态"
            clearable
          >
            <el-option label="在线" value="0"></el-option>
            <el-option label="离线" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="bindingClick"
            >导出</el-button
          >
        </el-col> -->
        <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="switchBatchChange(1)"
            >批量开启</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="switchBatchChange(0)"
            >批量关闭</el-button
          >
        </el-col> -->
      <!-- </el-row> -->

      <!-- table表格 -->
      <el-table
        :height="tableHeight"
        v-loading="loading"
        :data="regioninfoList"
        border
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column label="设备ID" align="center" prop="deviceCode" /> -->
        <el-table-column type="selection" align="center"> </el-table-column>
        <el-table-column label="设备名称" align="center" prop="deviceName" show-overflow-tooltip />
        <el-table-column
          label="设备类型"
          align="center"
          prop="deviceTypeName"
          show-overflow-tooltip
        />
        <el-table-column label="设备位置" align="center" prop="regionName" show-overflow-tooltip />
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip />
        <el-table-column
          label="开关状态"
          align="center"
          prop="onOff"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.onOff == 1">开启</el-tag>
            <el-tag type="danger" v-else>关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="设备状态"
          align="center"
          prop="isStatus"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
            <el-tag type="danger" v-else>离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="250"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" @click="lightingBtn(scope.row, 1)"
              >开启</el-button
            >
            <el-button type="danger" @click="lightingBtn(scope.row, 0)"
              >关闭</el-button
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
  </div>
</template>

<script>
import {
  getDeviceList,
  getInfoSendControl,
  switchBatch,
  getInfoBtnControl,
} from "@/api/subsystem/floorcontrol/floorcontrol-lighting";

// import bus from "@/utils/bus.js";

export default {
  props: {
    treeNode: Object,
  },
  data() {
    return {
      // 选中数组
      ids: [],
      // 设备编码
      deviceCodes: [],
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
        isStatus: "", // 设备状态(1开启，0离线)
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
    this.getList();
  },
  mounted() {
    // 获取树形组件回传的数据、子组件互相传值
    // bus.$on("busMethod", (data) => {
    //   this.getTreeData(data);
    // });
  },
  beforeDestroy() {
    // bus.$off("busMethod"); // 组件销毁时关闭监听
  },
  methods: {
    lightingBtn(row, i) {
      // getInfoSendControl(row.deviceCode)
      //   .then((response) => {
      //     if (response.code === 200) {
      //       data.isStatus = response.data;
      //       this.$message({
      //         message: "操作成功",
      //         type: "success",
      //       });
      //     }
      //   })
      //   .catch((e) => {
      //     data.isStatus = this.isStatus;
      //   });
      getInfoBtnControl(row.unityModelId, i).then((response) => {
        this.$message.success(`操作成功，灯已${i == 1 ? "打开" : "关闭"}。`);
        this.getList(this.queryParams)
      });
    },
    // 多选
    handleSelectionChange(e) {
      this.ids = e.map((item) => item.deviceId);
      this.deviceCodes = e.map((item) => item.deviceCode);
    },

    // 导出
    bindingClick() {
      this.download(
        "/device/deviceinfo/exportBy",
        {
          subSystem: "sub-lighting",
          subPlug: "sub-floorcontrol-lighting",
          ids: this.ids,
        },
        "设备管理.xlsx"
      );
    },
    //开关
    switchChange(row) {
      getInfoSendControl(row.deviceCode)
        .then((response) => {
          if (response.code === 200) {
            row.isStatus = response.data;
          }
        })
        .catch((e) => {
          row.isStatus = this.isStatus;
        });
    },
    //批量开关
    switchBatchChange(isStatus) {
      if (this.deviceCodes.length == 0) {
        this.$message({
          message: "您未选择设备",
          type: "warning",
        });
        return;
      }

      switchBatch(isStatus, this.deviceCodes)
        .then((response) => {
          //刷新页面
          this.resetQuery();
        })
        .catch((e) => {
          console.log("e:", e);
        });
    },
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 350;
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.getList();
    },

    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    //获取树形组件回传的数据
    // getTreeData(data) {
    //   this.title = data.label;
    //   this.queryParams.regionId = data.regionId;
    //   this.resetQuery();
    // },
    // table数据请求
    getList() {
      this.loading = true;

      getDeviceList(this.queryParams)
        .then((response) => {
          let { total, rows } = response;
          this.total = total;
          this.regioninfoList = rows;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
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
</style>
