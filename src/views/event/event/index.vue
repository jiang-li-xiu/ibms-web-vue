<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="插件名称" prop="serviceName">
        <el-input
          v-model="queryParams.serviceName"
          placeholder="请输入插件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备代码" prop="deviceCode">
        <el-input
          v-model="queryParams.deviceCode"
          placeholder="请输入设备代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="事件名称" prop="eventName">
        <el-input
          v-model="queryParams.eventName"
          placeholder="请输入事件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="事件类型" prop="eventType">
        <el-select
          v-model="queryParams.eventType"
          placeholder="请选择事件类型"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="告警级别" prop="eventType">
        <el-select
          v-model="queryParams.eventGrade"
          placeholder="请选择告警级别"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>

      <el-form-item label="触发时间" prop="triggerTime">
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.triggerTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择触发时间"
        >
        </el-date-picker>
      </el-form-item>
      <!--     <el-form-item label="删除标识 0-未删除，1-已删除" prop="deleted">
        <el-input
          v-model="queryParams.deleted"
          placeholder="请输入删除标识 0-未删除，1-已删除"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['event:event:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['event:event:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['event:event:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['event:event:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="eventList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="插件名称" align="center" prop="serviceName" />
      <el-table-column label="设备代码" align="center" prop="deviceCode" />
      <el-table-column label="事件名称" align="center" prop="eventName" />
      <el-table-column label="事件类型" align="center" prop="eventType" />
      <el-table-column
        label="触发时间"
        align="center"
        prop="triggerTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.triggerTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据" align="center" prop="recordData" />
      <el-table-column label="事件描述" align="center" prop="remark" />
      <!--      <el-table-column label="删除标识 0-未删除，1-已删除" align="center" prop="deleted" />-->
      <!--      <el-table-column label="版本号" align="center" prop="version" />-->
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
            @click="handleDetail(scope.row)"
            v-hasPermi="['event:event:edit']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['event:event:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['event:event:remove']"
            >删除</el-button
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

    <!-- 添加或修改事件记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        :disabled="isDisabled"
      >
        <el-form-item label="插件名称" prop="serviceName">
          <el-input v-model="form.serviceName" placeholder="请输入插件名称" />
        </el-form-item>
        <el-form-item label="设备唯一代码" prop="deviceCode">
          <el-input
            v-model="form.deviceCode"
            placeholder="请输入设备唯一代码"
          />
        </el-form-item>
        <el-form-item label="事件名称" prop="eventName">
          <el-input v-model="form.eventName" placeholder="请输入事件名称" />
        </el-form-item>
        <el-form-item label="事件类型" prop="eventType">
          <el-select v-model="form.eventType" placeholder="请选择事件类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="触发时间" prop="triggerTime">
          <el-date-picker
            clearable
            size="small"
            v-model="form.triggerTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择触发时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="数据" prop="recordData">
          <el-input
            v-model="form.recordData"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="事件描述" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <!--        <el-form-item label="删除标识 0-未删除，1-已删除" prop="deleted">
          <el-input v-model="form.deleted" placeholder="请输入删除标识 0-未删除，1-已删除" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号" />
        </el-form-item>-->
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
  getEventList,
  getEventDetail,
  delEvent,
  addEvent,
  editEvent,
} from "@/api/common-config/event-manage/event";

export default {
  name: "Event",
  components: {},
  data() {
    return {
      // 设置表单是否禁用
      isDisabled: false,
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
      // 事件记录表格数据
      eventList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serviceName: null,
        deviceCode: null,
        eventName: null,
        eventGrade: null,
        eventType: null,
        triggerTime: null,
        recordData: null,
        deleted: null,
        version: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询事件记录列表 */
    getList() {
      this.loading = true;
      getEventList(this.queryParams).then((response) => {
        this.eventList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        serviceName: null,
        deviceCode: null,
        eventName: null,
        eventType: null,
        eventGrade: null,
        triggerTime: null,
        recordData: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleted: null,
        version: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加事件记录";
      this.isDisabled = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getEventDetail(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改事件记录";
        this.isDisabled = false;
      });
    },
    /**详情按钮*/
    handleDetail(row) {
      this.reset();
      const id = row.id || this.ids;
      this.title = row.serviceName + ":事件记录";
      getEventDetail(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = this.form.serviceName + ":事件记录";
        this.isDisabled = true;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            editEvent(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEvent(this.form).then((response) => {
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
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除事件记录编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delEvent(ids);
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
        "event/event/export",
        {
          ...this.queryParams,
        },
        `event_event.xlsx`
      );
    },
  },
};
</script>
