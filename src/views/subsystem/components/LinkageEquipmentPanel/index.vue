<!--
 * @Author: MJ
 * @Date: 2021-07-27 15:14:51
 * @LastEditors: MJ
 * @LastEditTime: 2021-08-06 16:20:15
 * @Description: 
-->
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @clear="clears"
          @input="inputs"
        />
      </el-form-item>

      <el-form-item label="设备类型" prop="deviceTypeId">
        <el-select
          v-model="queryParams.deviceTypeId"
          placeholder="请选择设备类型"
        >
          <el-option
            v-for="items in selectType"
            :key="items.deviceTypeId"
            :label="items.deviceTypeName"
            :value="items.deviceTypeId"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      class="margin_top_2"
      v-loading="loading"
      :data="testList"
      @row-click="getCurrentRow"
    >
      <el-table-column label="选择" width="55" align="center">
        <template slot-scope="scope">
          <img
            class="radio_img"
            :src="s_radio"
            v-if="scope.row.deviceId == submitData.deviceId"
          />
          <img class="radio_img" :src="radio" v-else />
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="deviceId" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备类型" align="center" prop="deviceTypeName" />
      <el-table-column
        label="注册时间"
        align="center"
        prop="registrationTime"
      />
      <el-table-column label="状态" align="center" prop="isStatus" />
    </el-table>

    <!-- <pagination
      class="margin_top_2"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <div style="text-align: right; margin-top: 2vh">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageNum"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <div class="margin_top_2 dis_r_fe">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="determine">确定</el-button>
    </div>
  </div>
</template>

<script>
import {
  getDeviceinfoList,
  getDevicetypeListNopage,
} from "@/api/subsystem/linkageAdministration";

export default {
  name: "Test",
  components: {},
  data() {
    return {
      // s_radio
      s_radio: require("@/assets/images/s_radio.png"),
      radio: require("@/assets/images/radio.png"),
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      testList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceName: "",
        deviceTypeId: "",
      },
      // 设备类型数据
      selectType: [],
      // 后端需要的数据
      submitData: {
        deviceId: null,
        deviceName: "",
        deviceCode: null,
        plugId: null,
      },
    };
  },

  created() {
    this.getList();
    this.getType();
  },

  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      getDeviceinfoList(this.queryParams).then((response) => {
        let { total, rows } = response;
        this.testList = rows;
        this.total = total;
        this.loading = false;
      });
    },

    // 页码大小
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize;
      this.getList();
    },

    // 当前页
    handleCurrentChange(page) {
      this.queryParams.pageNum = page;
      this.getList();
    },

    // 查询设备类型
    getType() {
      getDevicetypeListNopage().then((response) => {
        let { code, data } = response;
        if (code == 200) {
          this.selectType = data;
        }
      });
    },

    /** 搜索按钮 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 重置按钮 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        deviceName: "",
        deviceTypeId: "",
      };
      this.getList();
    },

    // 清除
    clears() {
      this.getList();
    },

    // 实时清除
    inputs(val) {
      if (val == "") {
        this.getList();
      }
    },

    // 单选
    getCurrentRow(row) {
      console.log(row);
      let { deviceCode, deviceName, plugId, deviceId } = row;

      this.submitData.deviceId = deviceId;
      this.submitData.deviceCode = deviceCode;
      this.submitData.deviceName = deviceName;
      this.submitData.plugId = plugId;
    },

    // 取消
    cancel() {
      this.$emit("trigger", {});
    },

    // 确定
    determine() {
      if (!this.submitData.deviceId) {
        this.$message({
          message: "请选择",
          type: "warning",
        });
        return false;
      }
      this.$emit("trigger", this.submitData);
    },
  },
};
</script>

<style lang="scss">
.dis_r_fe {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.margin_top_2 {
  margin-top: 2vh;
}

.radio_img {
  width: 20px;
  height: 20px;
}

// ::v-deep .pagination-container {
//   background-color: #fff !important;
// }
</style>