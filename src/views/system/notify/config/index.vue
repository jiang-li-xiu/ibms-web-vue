<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="配置名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入配置名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['notice:config:save']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['notice:config:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['notice:config:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-tabs
      v-model="queryParams.type"
      tab-position="left"
      @tab-click="tabClick"
      :style="{ height: height + 'px' }"
    >
      <el-tab-pane
        v-for="(notice, i) in typeOptions"
        :key="i"
        :name="notice.dictValue"
        :label="notice.dictLabel"
      >
        <el-table
          v-loading="loading"
          :data="configList"
          :height="height"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="序号" align="center" prop="id" width="225%" />
          <el-table-column
            label="通知名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="通知类型"
            align="center"
            prop="type"
            :formatter="typeFormat"
            width="100"
          />
          <el-table-column
            label="服务提供商"
            align="center"
            prop="serviceProvider"
            :formatter="serviceFormat"
            width="150%"
          />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="info"
                icon="el-icon-s-promotion"
                v-hasPermi="['notice:template:type:service']"
                @click="handleDebug(scope.row)"
                >调试</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-view"
                v-hasPermi="['notice:history:list']"
                @click="handleHistory(scope.row)"
                >记录</el-button
              >
              <el-button
                type="success"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['notice:config:edit']"
                >修改</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['notice:config:remove']"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-download"
                @click="handleDownload(scope.row)"
                v-hasPermi="['notice:config:download']"
                >下载配置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <add-or-edit ref="addOrEdit" v-if="open" @refreshList="getList" />
    <notifier-send ref="notifierSend" v-if="openNotifier" />
    <notice-history ref="noticeHistory" v-if="openHistory" />
  </div>
</template>

<script>
import { pageList, delNoticeConfig } from "@/api/system/notify";
import Editor from "@/components/Editor";
import AddOrEdit from "./components/addOrEdit";
import NotifierSend from "./components/notifySend";
import NoticeHistory from "./components/noticeHistory";

export default {
  name: "NoticeConfig",
  components: {
    Editor,
    AddOrEdit,
    NotifierSend,
    NoticeHistory,
  },
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
      // 公告表格数据
      configList: [],
      // 是否显示弹出层
      open: false,
      openNotifier: false,
      openHistory: false,
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      serviceProviderOptions: [],
      noticeOptions: [],
      height: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        type: "all",
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("notice_type").then((res) => {
      this.typeOptions = res.data;
    });
    this.getDicts("service_provider").then((res) => {
      this.serviceProviderOptions = res.data;
    });
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;

      pageList(this.queryParams)
        .then((response) => {
          this.configList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 通知类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 服务商字典翻译
    serviceFormat(row, column) {
      return this.selectDictLabel(
        this.serviceProviderOptions,
        row.type + "-" + row.serviceProvider
      );
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
    tabClick(tabId) {
      let { name } = tabId;
      this.queryParams.type = name;

      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.addOrEdit.init();
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true;
      const noticeId = row.id || this.ids;
      this.$nextTick(() => {
        this.$refs.addOrEdit.init(noticeId);
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除通知配置编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delNoticeConfig(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    handleDebug(row) {
      this.openNotifier = true;
      this.$nextTick(() => {
        this.$refs.notifierSend.init(row);
      });
    },
    handleHistory(row) {
      this.openHistory = true;
      this.$nextTick(() => {
        this.$refs.noticeHistory.init(row.id);
      });
    },
    handleDownload(row) {
      this.download(
        `/notice/noticeConfig/v1/download/${row.id}`,
        {
          ...this.queryParams,
        },
        `config_${new Date().getTime()}.json`
      );
    },
  },
  watch: {
    // height(val) {
    //   console.log(val)
    // },
  },
  mounted() {
    this.height = Math.floor(document.body.clientHeight * 0.7);

    window.onresize = () => {
      if (!this.timer) {
        this.height = Math.floor(document.body.clientHeight * 0.7);
        this.timer = true;
        let _this = this;
        setTimeout(function () {
          _this.timer = false;
        }, 500);
      }
    };
  },
};
</script>