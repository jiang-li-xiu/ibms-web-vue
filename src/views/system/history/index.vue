<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <!--
           <el-form-item label="记录id" prop="alarmHistoryId">
              <el-input
                v-model="queryParams.alarmHistoryId"
                placeholder="请输入记录id"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="设备id" prop="deviceId">
              <el-input
                v-model="queryParams.deviceId"
                placeholder="请输入设备id"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="告警id" prop="alarmId">
              <el-input
                v-model="queryParams.alarmId"
                placeholder="请输入告警id"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
        -->
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
      <el-form-item label="处理状态" prop="arrangeStatus">
        <el-select
          v-model="queryParams.arrangeStatus"
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
      <el-form-item label="告警时间" prop="alarmTime">
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.alarmTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择告警时间"
        >
        </el-date-picker>
      </el-form-item>

      <!--
            <el-form-item label="删除位" prop="deleted">
              <el-input
                v-model="queryParams.deleted"
                placeholder="请输入删除位"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
      -->

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

    <el-row :gutter="10" class="mb8">
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="primary"-->
      <!--          plain-->
      <!--          icon="el-icon-plus"-->
      <!--          size="mini"-->
      <!--          @click="handleAdd"-->
      <!--          v-hasPermi="['system:history:add']"-->
      <!--        >新增</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:history:edit']"
          >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:history:remove']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:history:export']"
          >导出
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="historyList"
      @selection-change="handleSelectionChange"
      highlight-current-row="true"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="记录id" align="center" prop="alarmHistoryId" />

      <el-table-column label="设备id" align="center" prop="deviceId">
        <!--        <template slot-scope="scope">-->
        <!--          <span type="info">{{scope.row.deviceId}}:{{scope.row.deviceName}}</span>-->
        <!--        </template>-->
      </el-table-column>

      <el-table-column label="设备名称" align="center" prop="deviceName" />

      <el-table-column label="告警id" align="center" prop="alarmId" />

      <el-table-column label="告警名称" align="center" prop="alarmName" />
      <el-table-column
        label="告警等级"
        align="center"
        prop="alarmLevel"
        :formatter="alarmLevelFormat"
      >
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.alarmLevel === '3'">提醒</el-tag>
          <el-tag type="warning" v-if="scope.row.alarmLevel === '2'"
            >警告</el-tag
          >
          <el-tag type="danger" v-if="scope.row.alarmLevel === '1'"
            >严重</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column
        label="处理状态"
        align="center"
        prop="arrangeStatus"
        :formatter="arrangeStatusFormat"
      >
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.arrangeStatus === '0'"
            >未处理</el-tag
          >
          <el-tag type="success" v-if="scope.row.arrangeStatus === '1'"
            >已处理</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column
        label="告警时间"
        align="center"
        prop="alarmTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.alarmTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remarks" />
      <!--      <el-table-column label="删除位" align="center" prop="deleted" />-->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:history:edit']"
            >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:history:remove']"
            >删除
          </el-button>
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

    <!-- 添加或修改告警记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备id" prop="deviceId">
          <!--          <el-input v-model="form.deviceId" placeholder="请输入设备id" />-->
          <el-select v-model="form.deviceId" placeholder="请输入设备id">
            <el-option
              v-for="(item, index) in arrangeDevice"
              :key="index"
              :label="item.device_id + ':' + item.device_name"
              :value="item.device_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="alarmName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="告警id" prop="alarmId">
          <!--          <el-input v-model="form.alarmId" placeholder="请输入告警id" />-->
          <el-select v-model="form.alarmId" placeholder="请输入设备id">
            <el-option
              v-for="(item, index) in alarminfoOptions"
              :key="index"
              :label="item.alarm_id + ':' + item.alarm_name"
              :value="item.alarm_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="告警名称" prop="alarmName">
          <el-input v-model="form.alarmName" placeholder="请输入告警名称" />
        </el-form-item>
        <el-form-item label="告警等级" prop="alarmLevel">
          <el-select v-model="form.alarmLevel" placeholder="请选择告警等级">
            <el-option
              v-for="dict in alarmLevelOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态" prop="arrangeStatus">
          <el-select v-model="form.arrangeStatus" placeholder="请选择处理状态">
            <el-option
              v-for="dict in arrangeStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警时间" prop="alarmTime">
          <el-date-picker
            clearable
            size="small"
            v-model="form.alarmTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择告警时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="form.remarks"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <!--        <el-form-item label="删除位" prop="deleted">-->
        <!--          <el-input v-model="form.deleted" placeholder="请输入删除位" />-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listHistory,
  getAlarmRecordDetail,
  delHistory,
  addHistory,
  updateHistory,
  deiceList,
  alarminofList,
} from "@/api/common-config/event-manage/alarm";

export default {
  name: "History",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 告警记录表格数据
      historyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 告警等级字典
      alarmLevelOptions: [],
      //报警信息
      alarminfoOptions: [],
      // 处理状态字典
      arrangeStatusOptions: [],
      //设备信息
      arrangeDevice: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        alarmHistoryId: null,
        deviceId: null,
        alarmId: null,
        alarmName: null,
        deviceName: null,
        alarmLevel: null,
        arrangeStatus: null,
        alarmTime: null,
        remarks: null,
        deleted: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
    this.getDicts("manager_level").then((response) => {
      this.alarmLevelOptions = response.data;
    });
    this.getDicts("arrange_status").then((response) => {
      this.arrangeStatusOptions = response.data;
    });
    this.handleAlarminofList();
    this.handleDevice();
  },
  methods: {
    /** 查询告警记录列表 */
    getList() {
      this.loading = true;
      listHistory(this.queryParams).then((response) => {
        this.historyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 告警等级字典翻译
    alarmLevelFormat(row, column) {
      return this.selectDictLabel(this.alarmLevelOptions, row.alarmLevel);
    },
    // 处理状态字典翻译
    arrangeStatusFormat(row, column, cellValue) {
      return this.selectDictLabel(this.arrangeStatusOptions, row.arrangeStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        alarmHistoryId: null,
        deviceId: null,
        alarmId: null,
        alarmName: null,
        alarmLevel: null,
        arrangeStatus: null,
        alarmTime: null,
        remarks: null,
        deleted: null,
      };
      this.resetForm("form");
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
      this.ids = selection.map((item) => item.alarmHistoryId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加告警记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const alarmHistoryId = row.alarmHistoryId || this.ids;
      getAlarmRecordDetail(alarmHistoryId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.alarmHistoryId != null) {
            updateHistory(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHistory(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const alarmHistoryIds = row.alarmHistoryId || this.ids;
      this.$confirm(
        '是否确认删除告警记录编号为"' + alarmHistoryIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delHistory(alarmHistoryIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/history/export",
        {
          ...this.queryParams,
        },
        `system_history.xlsx`
      );
    },
    /** 请求设备信息*/
    handleDevice() {
      deiceList().then((response) => {
        this.arrangeDevice = response;
      });
    },
    /** 请求报警信息*/
    handleAlarminofList() {
      alarminofList().then((response) => {
        this.alarminfoOptions = response;
      });
    },

    /**
     * 匹配id，显示设备名称
     * */
    handleMatchIdAndName(ids) {
      if (this.arrangeDevice.concat(ids)) {
        for (let item in this.arrangeDevice) {
          console.log(item.device_id + ":" + item.device_name);

          if (item.device_id === ids) {
            return item.device_name;
          }
        }
      }
    },
  },
};
</script>
