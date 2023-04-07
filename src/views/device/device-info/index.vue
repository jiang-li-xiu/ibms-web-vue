<template>
  <div class="app-container deviceinfo">
    <!-- 顶部设备新 -->
    <div class="deviceinfo-top">
      <el-row type="flex" class="row-bg align-center" justify="space-between">
        <el-col :span="4">
          <el-select v-model="deviceTypeValue" placeholder="请选择" filterable clearable @change="handleSelect">
            <el-option v-loading="selectLoading" v-for="item in deviceTypeOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col v-loading="totalLoading" :span="10" class="flex-row-csb">
          <div class="text-center">
            <p>全部设备</p>
            <p>{{ deviceTotal.allCount }}</p>
          </div>
          <div class="text-center">
            <p class="state onstate">在线</p>
            <p>{{ deviceTotal.onlineCount }}</p>
          </div>
          <div class="text-center">
            <p class="state unstate">离线</p>
            <p>{{ deviceTotal.noOnlineCount }}</p>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="refresh el-icon-refresh" @click="resetAll" title="更新全部"></div>
        </el-col>
      </el-row>
    </div>

    <div class="deviceinfo-table">
      <!-- 搜索行 -->
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>

        <el-form-item label="设备编码" prop="deviceCode">
          <el-input v-model="queryParams.deviceCode" placeholder="请输入设备编码" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>

        <el-form-item label="厂家" prop="deviceFactory">
          <el-input v-model="queryParams.deviceFactory" placeholder="请输入厂家" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>

        <el-form-item label="品牌" prop="deviceBrand">
          <el-input v-model="queryParams.deviceBrand" placeholder="请输入品牌" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>

        <el-form-item label="状态" prop="isStatus">
          <el-select v-model="queryParams.isStatus" placeholder="请选择状态" clearable size="small">
            <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 按钮行 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-link" @click="handleSync">同步</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-upload :action="uploadFileUrl" :before-upload="beforeUpload" :on-error="handleUploadError"
            :on-success="handleUploadSuccess" :file-list="fileList" :limit="limit" :show-file-list="false"
            :headers="headers" ref="upload">
            <el-button icon="el-icon-upload" type="primary">导入</el-button>
          </el-upload>
        </el-col>

        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-bottom" @click="exportFil">导出</el-button>
        </el-col>

        <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            
            icon="el-icon-plus"
            
            @click="handleAdd"
            v-hasPermi="['device:deviceinfo:add']"
            >新增</el-button
          >
        </el-col> -->

        <el-col :span="1.5">
          <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['device:deviceinfo:remove']">批量删除</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" @click="downloads">下载模板</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" :disabled="multiple" @click="handleSet">批量新增参数</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table :height="tableHeight" v-loading="loading" :data="deviceinfoList"
        @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="设备Id" align="center" prop="deviceId" /> -->

        <!-- <el-table-column label="设备编码" align="center" prop="deviceCode" /> -->
        <el-table-column label="设备名称" align="center" prop="deviceName" />
        <el-table-column label="设备类型" align="center" prop="deviceTypeName" />
        <el-table-column label="设备标识" align="center" prop="unityModelId" />
        <el-table-column label="厂家" align="center" prop="deviceFactory" />
        <el-table-column label="品牌" align="center" prop="deviceBrand" />

        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isStatus == 0">在线</el-tag>
            <el-tag type="danger" v-else>离线</el-tag>
          </template>
        </el-table-column>

        <el-table-column width="400" fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button icon="el-icon-view" @click="handleCheck(scope.row)">查看详情</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['device:deviceinfo:edit']">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"
              v-hasPermi="['device:deviceinfo:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" @close="closes">
        <el-form-item label="设备类型" prop="deviceTypeId">
          <el-select v-model="form.deviceTypeId" :disabled="title == '修改设备' ? true : false" placeholder="请选择"
            filterable>
            <el-option v-loading="selectLoading" v-for="item in deviceTypeOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>

        <el-form-item label="设备编码" prop="deviceCode">
          <el-input v-model="form.deviceCode" :disabled="title == '修改设备' ? true : false" placeholder="请输入设备编码" />
        </el-form-item>

        <el-form-item label="3d模型类型">
          <el-select v-model="form.unityType" :disabled="title == '修改设备' ? true : false" placeholder="请选择3d模型类型">
            <el-option v-for="dict in unityTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>

        <el-form-item label="厂家" prop="deviceFactory">
          <el-input v-model="form.deviceFactory" placeholder="请输入厂家" />
        </el-form-item>

        <el-form-item label="品牌" prop="deviceBrand">
          <el-input v-model="form.deviceBrand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="功率（W）" prop="planePower">
          <el-input-number v-model="form.planePower" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="寿命（年）" prop="planeLife">
          <el-input-number v-model="form.planeLife" controls-position="right"></el-input-number>
        </el-form-item>

        <el-form-item label="开始使用时间" prop="installTime">
          <el-date-picker v-model="form.installTime" type="date" placeholder="请选择开始日期" value-format="yyyy-MM-dd"
            clearable>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 同步设备类型弹窗 -->
    <el-dialog title="同步设备" :visible.sync="syncOpen" width="200" append-to-body @close="syncForms"
      :close-on-click-modal="false">
      <div v-show="!isConflict">
        <el-form ref="syncForm" :model="syncForm" :rules="syncRules">
          <!-- 子系统 -->
          <el-form-item label="子系统" prop="subsystemCode">
            <el-select v-model="syncForm.subsystemCode" placeholder="请选择子系统" @change="selectSubsystem">
              <el-option v-loading="selectLoading" v-for="item in subsystemSubSystemsV1ListData" :key="item.id"
                :label="item.title" :value="item.code"></el-option>
            </el-select>
          </el-form-item>

          <!-- 子插件 -->
          <el-form-item label="子插件" prop="subPluginCode">
            <el-select v-model="syncForm.subPluginCode" placeholder="请选择子插件" @change="selectSubPlugin"
              :disabled="syncForm.subsystemCode ? false : true">
              <el-option v-loading="selectLoading" v-for="item in subPluginData" :key="item.id" :label="item.title"
                :value="item.code"></el-option>
            </el-select>
          </el-form-item>

          <!-- 物模型 -->
          <el-form-item label="物模型" prop="objectModelModelId">
            <el-select v-model="syncForm.objectModelModelId" placeholder="请选择物模型"
              :disabled="syncForm.subPluginCode ? false : true">
              <el-option v-loading="selectLoading" v-for="item in objectModel" :key="item.id" :label="item.name"
                :value="item.modelId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" v-show="!isConflict">
        <el-button type="primary" @click="submitSync">确 定</el-button>
      </div>

      <div class style="width: 100%" v-show="isConflict">
        <div class="conflict_fuse_box">
          <div class="conflict_fuse_title_btn_box" style="margin-right: 6px">
            <span class="conflict_fuse_title">数据冲突</span>
            <el-button type="primary" @click="synchronizationConfict('conflict')">同 步</el-button>
          </div>

          <div class="conflict_fuse_title_btn_box" style="margin-left: 6px">
            <span class="conflict_fuse_title">数据不冲突</span>
            <el-button type="primary" @click="synchronizationConfict('fuse')">同步</el-button>
          </div>
        </div>

        <div class="conflict_fuse_box" style="height: 37vh">
          <el-table style="margin-right: 12px" height="90%" :data="conflictData" tooltip-effect="dark"
            @selection-change="selectionChange($event)">
            <el-table-column fixed align="center" type="selection" width="55"></el-table-column>
            <el-table-column label="设备名" prop="deviceName"></el-table-column>
            <el-table-column label="品牌" prop="deviceBrand"></el-table-column>
            <el-table-column label="设备编码" prop="deviceCode"></el-table-column>
            <el-table-column label="厂家" prop="deviceFactory"></el-table-column>
            <el-table-column label="状态" prop="isStatus">
              <template slot-scope="scope">
                {{ scope.row.isStatus == 0 ? "在线" : "离线" }}
              </template>
            </el-table-column>
            <el-table-column label="设备类型" prop="deviceTypeId">
              <template slot-scope="scope">
                <el-select v-model="scope.row.deviceTypeId" placeholder="请选择设备类型">
                  <el-option v-for="items in matchingSynchronization" :key="items.deviceTypeId"
                    :label="items.deviceTypeName" :value="items.deviceTypeId"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>

          <el-table style="margin-left: 12px" height="90%" :data="fuseData" tooltip-effect="dark"
            @selection-change="selectFuseChec($event)">
            <el-table-column fixed align="center" type="selection" width="55"></el-table-column>
            <el-table-column label="设备名" prop="deviceName"></el-table-column>
            <el-table-column label="品牌" prop="deviceBrand"></el-table-column>
            <el-table-column label="设备编码" prop="deviceCode"></el-table-column>
            <el-table-column label="厂家" prop="deviceFactory"></el-table-column>
            <el-table-column label="状态" prop="isStatus">
              <template slot-scope="scope">
                {{ scope.row.isStatus == 0 ? "在线" : "离线" }}
              </template>
            </el-table-column>
            <el-table-column label="设备类型" prop="deviceTypeId">
              <template slot-scope="scope">
                <el-select v-model="scope.row.deviceTypeId" placeholder="请选择设备类型">
                  <el-option v-for="items in matchingSynchronization" :key="items.deviceTypeId"
                    :label="items.deviceTypeName" :value="items.deviceTypeId"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div style="text-align: right" v-if="isConflict">
        <el-button @click="conflictPreservation">保 存</el-button>
      </div>

      <el-dialog title="设备类型" :visible.sync="isMatches" :append-to-body="true" :show-close="false"
        :close-on-click-modal="false">
        <div style="height: 41.5vh">
          <el-table :data="matchingSynchronization" width="100%" height="90%" tooltip-effect="dark"
            highlight-current-row ref="singleTable" @current-change="handleCurrentChange">
            <el-table-column label="设备ID" prop="deviceTypeId"></el-table-column>
            <el-table-column label="设备名" prop="deviceTypeName"></el-table-column>
          </el-table>

          <div style="text-align: right; margin-top: 16px">
            <el-button @click.stop="cancels">取 消</el-button>
            <el-button type="primary" @click.stop="determine">确 定</el-button>
          </div>
        </div>
      </el-dialog>
    </el-dialog>

    <!-- 批量添加 -->
    <set-power ref="setPower" @ok="getList"></set-power>
  </div>
</template>

<script>
import {
  countDeviceinfo,
  listDeviceinfo,
  getDeviceinfo,
  delDeviceinfo,
  addDeviceinfo,
  updateDeviceinfo,
  getDeviceType,
  getSystemData,
  getSubsystemSubPluginsV1List,
  getSubsystemThingModelsV1List,
  getDeviceinfoSynchronousSet,
  getDeviceDeviceinfoSynchronousGet,
  getDeviceDeviceinfoSynchronousGetDeviceType,
  getDeviceDeviceinfoSynchronousSaveDeviceInfo,
} from "@/api/device/deviceInfo";
import { getInfoByFileType } from "@/api/system/template";
import { getToken } from "@/utils/auth";
import SetPower from "./SetPower.vue";

export default {
  name: "DeviceInfo",
  components: { SetPower },
  data() {
    return {
      // 文件列表
      fileList: [],
      // 上传的图片服务器地址
      uploadFileUrl:
        process.env.VUE_APP_BASE_API + "/device/deviceinfo/importData",
      // 最大可上传文件个数
      limit: 5,
      // 设置上传的请求头部
      headers: {
        Authorization: "Bearer " + getToken(),
      },

      // 表格自适应高度
      tableHeight: 0,
      // 设备同步遮罩层
      // syncLoading: false,
      // 设备选择下拉框数据
      deviceTypeOptions: [],
      // 设备类型获取遮罩层
      selectLoading: true,
      // 设备类型：用于数据刷新
      deviceTypeValue: "",
      // 设备类型:用于数据同步
      deviceTypeId: null,
      // 控制同步弹窗
      syncOpen: false,
      // 设备状态下拉选择数据
      state: [
        {
          value: "0",
          label: "在线",
        },
        {
          value: "1",
          label: "离线",
        },
      ],
      // 设备在线离线数遮罩层
      totalLoading: true,
      // 遮罩层
      loading: true,
      // 选中数组id
      ids: [],
      // 选择设备编码
      // codes: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备表格数据
      deviceinfoList: [],
      // 顶部设备在线离线数
      deviceTotal: {},
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceName: null,
        deviceCode: null,
        deviceFactory: null,
        isStatus: null,
        connectionAgreement: null,
        deviceBrand: null,
        ipAddress: null,
        registrationTime: null,
        lastOnlineTime: null,
        deviceAttributeId: null,
        remarks: null,
        deviceTypeId: null,
        regionId: null,
        deleted: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceTypeId: [
          { required: true, message: "请选择设备类型", trigger: "blur" },
        ],
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        deviceCode: [
          { required: true, message: "设备编码不能为空", trigger: "blur" },
        ],
      },

      // 同步表单
      syncForm: {
        // 子系统
        subsystemCode: "",
        subsystemTitle: "",
        // 子插件
        subPluginCode: "",
        subPluginTitle: "",
        // 物模型
        objectModelModelId: "",
        objectModelName: "",
      },
      // 同步表单验证
      syncRules: {
        subsystemCode: [
          // { required: true, message: "请选择子系统", trigger: "blur" },
          { required: true, message: "请选择子系统", trigger: "change" },
        ],
        subPluginCode: [
          // { required: true, message: "请选择子插件", trigger: "blur" },
          { required: true, message: "请选择子插件", trigger: "change" },
        ],
        objectModelModelId: [
          // { required: true, message: "请选择物模型", trigger: "blur" },
          { required: true, message: "请选择物模型", trigger: "change" },
        ],
      },
      // 所有子系统
      subsystemSubSystemsV1ListData: [],
      // 根据 子系统 的 code 获取子插件
      subPluginData: [],
      // 根据 子插件 的 code 获取物模型
      objectModel: [],
      isConflict: false,
      // 冲突的数据
      conflictData: [],
      // 融合的数据
      fuseData: [],
      // 选择的数据冲突
      selectConflict: [],
      // 选择的数据不冲突
      selectFuse: [],
      // 匹配同步数据
      matchingSynchronization: [],
      isMatches: false,
      matchingSynchronizationVal: "",
      isConflictFuse: null,
      objRadio: null,
      unityTypeOptions: [],
    };
  },

  created() {
    this.getHeight();
    // 获取设备在线数
    this.getOnline();
    // 获取table列表
    this.getList();
    // 获取设备类型
    this.getType();
    window.addEventListener("resize", this.getHeight);
    // 获取所有子系统
    this.getSystemData();
    // 字典
    this.getDicts("UNITY_TYPE").then((response) => {
      this.unityTypeOptions = response.data;
    });
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

      if (res.code == 500) {
        return this.$message.error("上传失败，存在重复编码，请联系管理员！");
      }
      this.getList();
      this.$message.success("上传成功");
    },

    // 上传失败
    handleUploadError(err) {
      this.$message.error("上传失败，请重试:", err);
    },

    // 导出
    exportFil() {
      console.log(159);
      console.log(this.download);
      this.download(
        "/device/deviceinfo/export",
        { deviceIds: this.ids },
        "设备管理.xlsx"
      );
    },

    // 同步弹窗关闭
    syncForms() {
      this.$refs["syncForm"].clearValidate();
      this.$refs["syncForm"].resetFields();
      this.conflictData = [];
      this.fuseData = [];
      this.isConflict = false;
    },

    // 根据子插件的 code 获取物模型
    selectSubPlugin(subPluginCode) {
      getSubsystemThingModelsV1List(subPluginCode).then((response) => {
        this.objectModel = response.data;
        console.log("物模型：", this.objectModel);
      });

      this.subPluginData.forEach((item) => {
        if (subPluginCode == item.code) {
          this.syncForm.subPluginTitle = item.title;
        }
      });
    },

    // 根据子系统的 code 获取子插件
    selectSubsystem(subsystemCode) {
      getSubsystemSubPluginsV1List(subsystemCode).then((response) => {
        this.subPluginData = response.data;
        console.log("获取子插件:", this.subPluginData);
      });

      this.subsystemSubSystemsV1ListData.forEach((item) => {
        if (subsystemCode == item.code) {
          this.syncForm.subsystemTitle = item.title;
        }
      });
      console.log(this.syncForm);
    },

    // 获取所有子系统
    getSystemData() {
      getSystemData().then((response) => {
        this.subsystemSubSystemsV1ListData = response.data;
        console.log("获取所有子系统:", this.subsystemSubSystemsV1ListData);
      });
    },

    // 获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 470;
    },
    // 获取设备在线数
    getOnline() {
      this.totalLoading = true;
      countDeviceinfo({ deviceTypeId: this.deviceTypeId || "" }).then((res) => {
        console.log("获取设备在线数:", res);
        this.deviceTotal = res.data;
        this.totalLoading = false;
      });
    },
    // 获取设备类型
    getType() {
      this.selectLoading = true;
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
    /** 查询设备列表 */
    getList() {
      this.loading = true;
      listDeviceinfo(this.queryParams).then((response) => {
        this.deviceinfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 刷新全部数据
    resetAll() {
      this.queryParams.deviceTypeId = null;
      this.deviceTypeId = null;
      this.deviceTypeValue = "";
      this.deviceTypeOptions = [];
      this.queryParams.pageNum = 1;
      this.getOnline();
      this.getList();
      this.getType();
    },
    // 新增或修改弹窗取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        deviceId: null,
        deviceName: null,
        deviceCode: null,
        deviceFactory: null,
        isStatus: "0",
        connectionAgreement: null,
        deviceBrand: null,
        ipAddress: null,
        registrationTime: null,
        lastOnlineTime: null,
        deviceAttributeId: null,
        remarks: null,
        devicetypeModelId: null,
        deviceTypeId: null,
        regionId: null,
        deleted: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
      };
      this.resetForm("form");
    },
    // 设备类型选择
    handleSelect(value) {
      this.queryParams.pageNum = 1;
      this.deviceTypeId = value;
      this.queryParams.deviceTypeId = value;
      this.getList();
      this.getOnline();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      // this.codes = selection.map((item) => item.deviceCode);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备";
    },
    // 查看详情
    handleCheck(row) {
      let data = {
        deviceId: row.deviceId,
        deviceName: row.deviceName,
        deviceTypeName: row.deviceTypeName,
        deviceCode: row.deviceCode,
        isStatus: row.isStatus,
        
        path: "/systemFun/device/deviceinfo",
        // path: "/commonConfiguration/device/deviceinfo",
      };
      this.$router.push({ name: "DeviceDetail", params: { deviceData: data } });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const deviceId = row.deviceId || this.ids;
      getDeviceinfo(deviceId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备";
      });
    },

    // 弹窗关闭
    closes() {
      this.$refs["form"].clearValidate();
      this.$refs["form"].resetFields();
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.deviceId != null) {
            updateDeviceinfo(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.getOnline();
              this.$refs["form"].clearValidate();
              this.$refs["form"].resetFields();
            });
          } else {
            addDeviceinfo(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              this.getOnline();
              this.$refs["form"].clearValidate();
              this.$refs["form"].resetFields();
            });
          }
        }
      });
    },

    // 数据不冲突多选
    selectFuseChec(data) {
      this.selectFuse = data;
    },

    // 确定
    determine(row) {
      if (this.isConflictFuse == "conflict") {
        this.selectConflict.forEach((item) => {
          this.conflictData[item.index].deviceTypeId =
            this.objRadio.deviceTypeId;
        });
      } else if (this.isConflictFuse == "fuse") {
        this.selectFuse.forEach((item, i) => {
          console.log("objRadio.deviceTypeId:", this.objRadio.deviceTypeId);
          this.fuseData[i].deviceTypeId = this.objRadio.deviceTypeId;
        });
      }

      this.$refs.singleTable.setCurrentRow(row);
      this.isMatches = false;
    },

    // 数据冲突/数据不冲突 保存
    conflictPreservation() {
      let that = this;
      that
        .$confirm("此操作将改会变数据库内容", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          getDeviceDeviceinfoSynchronousSaveDeviceInfo([
            ...that.conflictData,
            ...that.fuseData,
          ])
            .then((response) => {
              loading.close();
              that.syncOpen = false;
              that.$message.success("保存成功");
              that.isConflictFuse = null;
            })
            .catch(() => {
              loading.close();
            });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消",
          });
          that.isConflictFuse = null;
        });
    },

    // 关闭设备类型弹窗
    cancels(row) {
      this.$refs.singleTable.setCurrentRow(row);
      this.isMatches = false;
    },

    // 获取设备类型
    getEquipmentType() {
      let that = this;
      getDeviceDeviceinfoSynchronousGetDeviceType(
        that.syncForm.objectModelModelId
      ).then((response) => {
        console.log("response:", response);
        that.matchingSynchronization = response.data;
      });
    },

    // 匹配数据多选
    matchingSelectionChange(data) {
      console.log(data);
    },

    // 数据冲突多选
    selectionChange(data) {
      this.selectConflict = data;
    },

    // 打开 数据冲突/数据不冲突 设备弹窗
    synchronizationConfict(val) {
      this.isConflictFuse = val;
      if (this.isConflictFuse == "conflict") {
        if (!this.selectConflict.length)
          return this.$message.warning("至少选择一条数据");
      } else if (this.isConflictFuse == "fuse") {
        if (!this.selectFuse.length)
          return this.$message.warning("至少选择一条数据");
      }

      this.isMatches = true;
    },

    // 单选
    handleCurrentChange(val) {
      this.objRadio = val;
    },

    // 打开同步弹窗
    handleSync() {
      // 获取所有子系统
      this.getSystemData();
      this.syncOpen = true;
    },

    // 获取数据冲突/数据不冲突
    submitSync() {
      let that = this;
      that.$refs["syncForm"].validate((valid) => {
        if (valid) {
          const loading = that.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          getDeviceinfoSynchronousSet({
            subSystem: that.syncForm.subsystemCode,
            subPlug: that.syncForm.subPluginCode,
            modeId: that.syncForm.objectModelModelId,
          })
            .then((response) => {
              if (response.code == 200) {
                getDeviceDeviceinfoSynchronousGet(0)
                  .then((response) => {
                    console.log("conflict:", response);
                    that.conflictData = response.data.map((item, i) => {
                      item.index = i;
                      return item;
                    });
                  })
                  .then(() => {
                    getDeviceDeviceinfoSynchronousGet(1).then((response) => {
                      console.log("fuse:", response);
                      that.fuseData = response.data;
                      loading.close();
                      that.isConflict = true;
                      that.getEquipmentType();
                    });
                  });
              }
            })
            .catch(() => {
              loading.close();
            });
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const deviceIds = row.deviceId || this.ids;
      this.$confirm("是否确认删除设备?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delDeviceinfo(deviceIds);
        })
        .then(() => {
          this.getList();
          this.getOnline();
          this.msgSuccess("删除成功");
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "device/deviceinfo/export",
        {
          ...this.queryParams,
        },
        `device_deviceinfo.xlsx`
      );
    },

    // 下载
    downloads() {
      getInfoByFileType({ fileType: 0 }).then((res) => {
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

    handleSet() {
      this.$refs.setPower.add(this.ids);
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
};
</script>

<style scoped lang="scss">
.overflow_y_scroll {
  overflow-y: scroll;
}

.overflow_y_scroll_0::-webkit-scrollbar {
  width: 0 !important;
}

.deviceinfo {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}

.deviceinfo-top {
  background-color: #fff;
  padding: 20px;
}

.deviceinfo-table {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
}

.el-icon-refresh {
  cursor: pointer;
  font-size: 30px;
  color: #7f7f7f;
  transition: 2s;
}

.refresh:hover {
  color: #1890ff;
  transform: rotate(-360deg);
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

// --------------------------------------------------------------------------------------------------------------------------------------------
.conflict_fuse_box {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}

.conflict_fuse_title_btn_box {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 16px;
}

.conflict_fuse_title {
  font-weight: 600;
  font-size: 20px;
  margin-right: 10px;
}

// --------------------------------------------------------------------------------------------------------------------------------------------
</style>