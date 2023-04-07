<!--
 * @Author: MJ
 * @Date: 2021-08-17 16:29:08
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-07 14:36:17
 * @Description: 
-->
<template>
  <div>
    <div style="padding: 2vh 0.5vw">
      <el-button type="danger" @click="batchDelete">批量删除</el-button>
    </div>
    <el-table :data="seesData" stripe @selection-change="handleSelectionChange">
      <el-table-column align="center" width="100" type="selection">
      </el-table-column>
      <el-table-column align="center" prop="onlyIdentity"></el-table-column>
      <el-table-column
        align="center"
        label="设备名称"
        prop="deviceName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="设备类型"
        prop="deviceTypeName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="厂家"
        prop="deviceFactory"
      ></el-table-column>
      <el-table-column
        align="center"
        label="品牌"
        prop="deviceBrand"
      ></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.isStatus == 0 ? "在线" : "离线" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <span
            style="color: #0000ff; cursor: pointer"
            @click="deleteEquipment(scope.row)"
            >删除</span
          >
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: right; margin-top: 2vh; margin-right: 1vw">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10, 15, 30, 40, 50, 100, 200, 300]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getDeviceDevicetypeListDevice,
  deleteDeviceDeviceinfo,
} from "@/api/device/deviceClasses";

export default {
  name: "thingSees",
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        deviceTypeId: null,
      },
      seesData: [],
      total: 0,
      batchD: [],
    };
  },

  mounted() {
    if (this.$route.params.deviceTypeId == undefined) {
      this.query.deviceTypeId = Number(localStorage.getItem("deviceTypeId"));
    } else {
      localStorage.setItem("deviceTypeId", this.$route.params.deviceTypeId);
      this.query.deviceTypeId = Number(localStorage.getItem("deviceTypeId"));
    }

    this.getDeviceDevicetypeListDeviceS();
  },

  methods: {
    // 获取 设备 数据
    getDeviceDevicetypeListDeviceS() {
      getDeviceDevicetypeListDevice(this.query).then((response) => {
        let { total, rows } = response;
        this.total = total;
        this.seesData = rows;
      });
    },

    // 当前页
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getDeviceDevicetypeListDeviceS();
    },

    // 当前页数量
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getDeviceDevicetypeListDeviceS();
    },

    // 多选
    handleSelectionChange(e) {
      this.batchD = e.map((item) => item.deviceId);
    },

    // 批量删除
    batchDelete() {
      let deleteD = this.batchD;
      if (deleteD.length <= 0) return this.$message.info("请选择");

      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDeviceDeviceinfo(deleteD.toString()).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getDeviceDevicetypeListDeviceS();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 删除设备
    deleteEquipment(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDeviceDeviceinfo(row.deviceId).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getDeviceDevicetypeListDeviceS();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
