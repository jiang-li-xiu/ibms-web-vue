<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-08-02 17:44:04
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-06-06 08:47:22
-->
<template>
  <div class="districttable">
    <div class="assembly-table-title">{{ title }}</div>

    <!-- 搜索 -->
    <el-form
      class="assembly-margin"
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="设备类型" prop="deviceTypeId">
        <el-select
          v-model="deviceTypeValue"
          placeholder="请选择设备类型"
          filterable
          clearable
          @change="handleSelect"
        >
          <el-option
            v-loading="selectLoading"
            v-for="item in deviceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备编码" prop="deviceCode">
        <el-input
          v-model="queryParams.deviceCode"
          placeholder="请输入设备编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="isStatus">
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-connection"
          :disabled="bindingTitle != null ? false : true"
          @click="bindingClick"
        >
          绑定
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-crop"
          @click="handleUpdate"
          :disabled="multiple"
        >
          解绑
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-upload
          :action="uploadFileUrl"
          :before-upload="beforeUpload"
          :on-error="handleUploadError"
          :on-success="handleUploadSuccess"
          :file-list="fileList"
          :limit="limit"
          :show-file-list="false"
          :headers="headers"
          ref="upload"
        >
          <el-button icon="el-icon-upload" type="primary">导入</el-button>
        </el-upload>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-bottom" @click="exportFil"
          >导出</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="downloadTemplate"
          >下载模板</el-button
        >
      </el-col>
    </el-row>

    <el-table
      :height="tableHeight"
      v-loading="loading"
      :data="regioninfoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="设备ID"
        width="150"
        align="center"
        prop="deviceId"
      />
      <el-table-column
        label="设备编码"
        width="150"
        align="center"
        prop="deviceCode"
      />
      <el-table-column
        label="设备类型"
        width="150"
        align="center"
        prop="deviceTypeName"
      />
      <el-table-column label="设备区域" align="center" prop="regionName" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <span
            class="state"
            :class="scope.row.isStatus == 0 ? 'onstate' : 'unstate'"
            >{{ scope.row.isStatus == 0 ? "在线" : "离线" }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-view"
            @click="viewdetailsClick(scope.row)"
            >查看详情</el-button
          >
          <el-button
            type="info"
            icon="el-icon-crop"
            @click="handleUpdate(scope.row)"
            >解绑</el-button
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

    <!-- 绑定-弹框 -->
    <el-dialog
      :title="bindingTitle + '绑定设备'"
      width="1100px"
      :visible.sync="boundBulletframe"
    >
      <el-form
        :model="bindingDevice"
        ref="queryForm2"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="bindingDevice.deviceName"
            placeholder="请输入设备名称"
            clearable
            size="small"
            @keyup.enter.native="bindinghandleQuery"
          />
        </el-form-item>
        <el-form-item label="设备编码" prop="deviceCode">
          <el-input
            v-model="bindingDevice.deviceCode"
            placeholder="请输入设备ID"
            clearable
            size="small"
            @keyup.enter.native="bindinghandleQuery"
          />
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceTypeId">
          <el-select
            v-model="bindingDevice.deviceTypeId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in deviceTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            plain
            @click="bindinghandleQuery"
            >查询</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-refresh"
            size="mini"
            plain
            @click="bindingresetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="bindingList"
        height="350"
        @selection-change="multipleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="设备编码" align="center" prop="deviceCode" />
        <el-table-column label="设备名称" align="center" prop="deviceName" />
        <el-table-column
          label="设备类型"
          align="center"
          prop="deviceTypeName"
        />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <span
              class="state"
              :class="scope.row.isStatus == 0 ? 'onstate' : 'unstate'"
              >{{ scope.row.isStatus == 0 ? "在线" : "离线" }}</span
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="bindingtotal > 0"
        :total="bindingtotal"
        :page.sync="bindingDevice.pageNum"
        :limit.sync="bindingDevice.pageSize"
        @pagination="bindingClick"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="boundBulletframe = false">取 消</el-button>
        <el-button type="primary" @click="multipleSelectionBinding"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../../../utils/bus.js";
import {
  getAreaDevice,
  putBindingAndUnbinding,
  getNoBindingList,
} from "@/api/device/districtManagement";

import { getInfoByFileType } from "@/api/system/template";
import { getToken } from "@/utils/auth";
import { getDeviceType } from "@/api/device/deviceInfo";

export default {
  name: "DistrictTable",
  data() {
    return {
      // 文件列表
      fileList: [],
      // 上传的图片服务器地址
      uploadFileUrl:
        process.env.VUE_APP_BASE_API + "/device/regioninfo/importData",
      // 最大可上传文件个数
      limit: 5,
      // 设置上传的请求头部
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      regionId: [],

      title: "全部", //标题路径
      // 表格高度
      tableHeight: 0,
      // table遮罩层
      loading: "",
      multiple: true,
      regioninfoList: [], //table数据
      bindingList: [], //弹框-table数据
      ids: [], //多选后获取到的id
      selectionArr2: [], //弹框-多选数组
      total: 0,
      bindingtotal: 0, //弹框total
      boundBulletframe: false, //弹框显示判断
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        regionId: 0, //区域id
        deviceName: null, //设备名称
        deviceCode: null, //设备编码
        isStatus: null, //状态
        deviceTypeId: null, //设备类型id
      },
      bindingTitle: null,
      // 电梯前厅绑定设备-弹框 0在线 1离线
      bindingDevice: {
        pageNum: 1,
        pageSize: 10,
        deviceName: null, //设备名称
        deviceCode: null, //设备编码
        deviceTypeId: null, //设备类型id
      },
      deviceTypeOptions: [], //弹框-下拉列表
      deviceTypeValue: "", //下拉点击后绑定的数据
      selectLoading: true, //下拉选择遮罩层
      regionId: null, // 区域ID
    };
  },
  created() {
    // 获取表格数据
    this.getList();
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
  },
  mounted() {
    // 获取设备类型下拉数据
    this.getType();
    // 获取树形组件回传的数据、子组件互相传值
    bus.$on("busMethod", (data) => {
      console.log(data);
      this.title = data.label;
      this.regionId = data.regionId;
      this.acceptList(data);
    });
  },
  beforeDestroy() {
    bus.$off("busMethod", this.acceptList); // 组件销毁时关闭监听
  },

  methods: {
    beforeUpload(file) {
      // 上传前 文件校验
      this.files = file;
      const xls = file.name.split(".")[1] === "xls";
      const xlsx = file.name.split(".")[1] === "xlsx";
      if (xls || xlsx) {
        return true;
      }
      this.$message.error("请上传正确的文件格式：xls、xlsx");
      return false;
    },

    // 上传成功回调
    handleUploadSuccess(res, file) {
      console.log("res:", res);
      console.log("code:", res.code);
      console.log(file);

      bus.$emit("busMethod", {});
      this.$message.success("上传成功");
    },

    // 上传失败
    handleUploadError(err) {
      this.$message.error("上传失败，请重试:", err);
    },

    // 导出
    exportFil() {
      console.log(this.regionId);
      this.download(
        "/device/deviceinfo/export",
        { regionIds: this.regionId },
        "区域管理.xlsx"
      );
    },

    // 下载
    downloadTemplate() {
      getInfoByFileType({ fileType: 1 }).then((res) => {
        this.handleDownload(res.data.url);
      });
    },
    // 下载操作
    handleDownload(url) {
      let link = document.createElement("a"); // 创建a标签
      link.style.display = "none";
      link.href = url; // 设置下载地址
      link.setAttribute("download", ""); // 添加downLoad属性
      document.body.appendChild(link);
      link.click();
    },

    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 550;
    },
    //接收左边树形组件传来的id
    acceptList(data) {
      this.queryParams.regionId = data.regionId; // id
      this.bindingTitle = data.regionName; // 弹框标题
      this.getList();
    },
    //table数据请求
    getList() {
      this.loading = true;
      getAreaDevice(this.queryParams).then((response) => {
        this.total = response.total;
        this.regioninfoList = response.rows;
        console.log("table数据请求:", response.rows);
        this.loading = false;
      });
    },

    // 弹框-获取设备类型
    getType() {
      this.selectLoading = true;
      this.deviceTypeOptions = [];
      getDeviceType().then((response) => {
        response.data.forEach((item) => {
          this.deviceTypeOptions.push({
            value: item.deviceTypeId,
            label: item.deviceTypeName,
          });
        });
        this.selectLoading = false;
      });
    },

    // 设备类型选择
    handleSelect(value) {
      this.queryParams.deviceTypeId = value;
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.ids = selection.map((item) => item.deviceId);
      this.regionId = selection.map((item) => item.regionId);
      this.multiple = !selection.length;
    },

    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.deviceTypeValue = "";
      this.resetForm("queryForm");
      this.getList();
    },

    /* 操作-解绑 */
    handleUpdate(row) {
      let deviceId = row.deviceId || this.ids;
      if (deviceId.constructor === Number) {
        deviceId = [deviceId];
      }
      let data = {
        bindingStatus: 1,
        deviceIds: deviceId,
        regionId: this.queryParams.regionId,
      };
      this.$confirm("是否解绑设备?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.BindingAndUnbindingfunction(data);
        })
        .catch(() => {});
    },

    // 绑定解绑请求
    BindingAndUnbindingfunction(data) {
      putBindingAndUnbinding(data).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$message({
            message: "操作成功！",
            type: "success",
          });
        } else {
          this.$message.error("操作失败！请重试！");
        }
      });
    },

    /* 绑定弹框 */
    bindingClick() {
      this.bindingDevice.regionId = this.regionId;
      getNoBindingList(this.bindingDevice).then((res) => {
        this.bindingList = res.rows;
        this.bindingtotal = res.total;
      });
      this.getType();
      this.boundBulletframe = true;
    },

    // 查看详情
    viewdetailsClick(row) {
      let data = {
        deviceId: row.deviceId,
        deviceName: row.deviceName,
        deviceTypeName: row.deviceTypeName,
        deviceCode: row.deviceCode,
        onlyIdentity: row.onlyIdentity,
        isStatus: row.isStatus,
        path: "/systemFun/device/districtmanagement",
      };
      this.$router.push({
        name: "DeviceDetail",
        params: {
          deviceData: data,
        },
      });
    },

    /* =========弹框========= */
    //弹框多选选中
    multipleSelectionChange(selection) {
      this.selectionArr2 = selection;
    },
    /** 弹框-查询按钮操作 */
    bindinghandleQuery() {
      getNoBindingList(this.bindingDevice).then((res) => {
        this.bindingList = res.rows;
        this.bindingtotal = res.total;
      });
    },
    /** 弹框-重置按钮操作 */
    bindingresetQuery() {
      this.resetForm("queryForm2");
      this.bindinghandleQuery();
    },

    //弹框-多选绑定
    multipleSelectionBinding() {
      let data = {
        bindingStatus: 0,
        deviceIds: [],
        regionId: this.queryParams.regionId,
      };
      for (let item of this.selectionArr2) {
        data.deviceIds.push(item.deviceId);
      }
      this.BindingAndUnbindingfunction(data);
      this.boundBulletframe = false;
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
};
</script>
<style scoped lang="scss">
.assembly-table-title {
  letter-spacing: 2px;
  font-weight: 600;
  padding: 10px;
  font-size: 18px;
  border-bottom: 1px solid #d6d6d6;
}
.districttable {
  width: 84%;
  background: #fff;
  padding: 0 20px 20px;
}
.state {
  position: relative;
}
.state::before {
  content: "";
  position: absolute;
  top: 25%;
  left: -15px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.onstate::before {
  background: #95f204;
}
.unstate::before {
  background-color: #d9001b;
}
.assembly-margin {
  margin-top: 15px;
}
</style>
