<!--
 * @Author: MJ
 * @Date: 2021-07-27 15:14:51
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-19 08:49:18
 * @Description: 
-->
<template>
  <el-dialog title="请选择设备" :visible.sync="isEquipmentPanel" append-to-body>
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
          size="small"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      ref="refSelect"
      v-loading="loading"
      :data="testList"
      height="484"
      @select="selectRow"
      @select-all="selectAll"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column label="ID" align="center" width="100" prop="deviceId" />
      <el-table-column
        label="设备名称"
        align="center"
        width="300"
        prop="deviceName"
      />
      <el-table-column label="设备类型" align="center" prop="deviceTypeName" />
      <el-table-column
        label="注册时间"
        align="center"
        prop="registrationTime"
      />
      <el-table-column label="状态" align="center" prop="isStatus">
        <template slot-scope="scope">
          <span>{{ scope.row.isStatus == 0 ? "正常" : "下线" }}</span>
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

    <div slot="footer" class="dialog-footer" v-show="total > 0">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="determine">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getDeviceinfoList,
  getDevicetypeListNopage,
} from "@/api/linkage/linkageAdministration";

export default {
  name: "Test",
  components: {},
  data() {
    return {
      isEquipmentPanel: false,
      // s_radio
      s_radio: require("@/assets/images/s_radio.png"),
      radio: require("@/assets/images/radio.png"),
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      testList: [],
      selectList: [],
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

    // 查询设备类型
    getType() {
      getDevicetypeListNopage().then((response) => {
        let { data } = response;
        this.selectType = data;
      });
    },

    /** 搜索按钮 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 重置按钮 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 全选/反全选/单选
    selectAllInverseAllSelectionSingleChoice(row) {
      let arr = row.map((item) => {
          let { deviceId, deviceCode, deviceName, plugId, deviceTypeId } = item;
          return { deviceId, deviceCode, deviceName, plugId, deviceTypeId };
        }),
        deviceNames = [],
        deviceIds = [],
        deviceCodes = [];
      if (arr.length != 0) {
        arr.reduce((a, b) => {
          console.log("a:", a.deviceTypeId);
          console.log("b:", b.deviceTypeId);
          if (a.deviceTypeId != b.deviceTypeId) {
            arr = [];
            this.$refs.refSelect.clearSelection();
            return this.$message.warning("请选择相同的设备类型");
          }
          return b;
        });
      }

      console.log(arr);

      arr.forEach((item) => {
        deviceNames.push(item.deviceName);
        deviceIds.push(item.deviceId);
        deviceCodes.push(item.deviceCode);
      });
      this.submitData = {
        arr,
        deviceNames: deviceNames.toString(),
        deviceIds: deviceIds.toString(),
        deviceCodes: deviceCodes.toString(),
      };
    },

    // 全选/反全选
    selectAll(selection) {
      this.selectAllInverseAllSelectionSingleChoice(selection);
    },

    // 单行选中
    selectRow(row) {
      this.selectAllInverseAllSelectionSingleChoice(row);
    },

    // 单选
    getCurrentRow(row) {
      console.log(row);
      let { deviceId, deviceCode, deviceName, plugId } = row;
      this.submitData.deviceId = deviceId;
      this.submitData.deviceCode = deviceCode;
      this.submitData.deviceName = deviceName;
      this.submitData.plugId = plugId;
    },

    // 取消
    cancel() {
      this.isEquipmentPanel = false;
    },

    // 确定
    determine() {
      if (!this.submitData.deviceNames) {
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
</style>
