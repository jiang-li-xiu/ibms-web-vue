<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="服务名" prop="serviceName">
        <el-input
          v-model="queryParams.serviceName"
          placeholder="请输入服务名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实例ID" prop="instanceId">
        <el-input
          v-model="queryParams.instanceId"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务健康状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" filterable clearable>
          <el-option
            v-for="(status, i) of serviceOptions"
            :key="i"
            :label="status.dictLabel"
            :value="status.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['subsystem-mgr:record:remove']"
          >删除</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click="handleClean"
          v-hasPermi="['subsystem-mgr:record:clean']"
          >清空</el-button
        >
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-row  v-if="tableList.length">
      <el-col>
        <el-table
          :row-key="rowKey"
          :height="tableHeight"
          v-loading="loading"
          :data="tableList"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="ID" align="center" prop="id" />
          <el-table-column
            label="实例ID"
            align="center"
            prop="instanceId"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="服务名"
            align="center"
            prop="serviceName"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="服务地址"
            align="center"
            prop="serviceUrl"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="发生时间"
            align="center"
            prop="occurrenceTime"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="服务健康状态"
            align="center"
            prop="status"
            :formatter="statusFormat"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="handleDetails(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      </el-col>
    </el-row>

    <record-details ref="recordDetails" v-if="open" />
  </div>
</template>

<script>
import { queryPage, delBatch, clean } from "@/api/service/record";
import RecordDetails from "./details";
import { TableListMixin } from "@/mixins/TableListMixin"

export default {
  mixins: [TableListMixin],
  name: "NoticeConfig",
  components: { RecordDetails },
  data() {
    return {
      rowKey:"id",
      tableHeight: 0, //表格高度
      // 遮罩层
      // loading: true,
      // 选中数组
      // selectedRowKeys: [],
      // 非单个禁用
      // single: true,
      // 非多个禁用
      // multiple: true,
      // 显示搜索条件
      // showSearch: true,
      // 总条数
      // total: 0,
      // 公告表格数据
      // tableList: [],
      serviceOptions: [],
      // 是否显示弹出层
      open: false,
      height: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serviceName: null,
        instanceId: "",
        status: null,
      },
    };
  },
  created() {
    if (this.$route.query.serviceName) {
      this.queryParams.serviceName = this.$route.query.serviceName;
    }

    this.getDicts("healthy_status").then((res) => {
      this.serviceOptions = res.data;
    });
  },
  mounted() {
    // this.getList();
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },

  methods: {
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 320;
      console.log(this.tableHeight);
    },

    statusFormat(row, column) {
      return this.selectDictLabel(this.serviceOptions, row.status);
    },
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      queryPage(this.queryParams)
        .then((response) => {
          this.tableList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.selectedRowKeys = selection.map((item) => item.id);
    //   console.log(this.selectedRowKeys);
    //   this.single = selection.length != 1;
    //   this.multiple = !selection.length;
    // },
    /** 修改按钮操作 */
    handleDetails(row) {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.recordDetails.init({
          form: row,
          options: this.serviceOptions,
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.selectedRowKeys;
      this.$confirm('是否确认删除子系统服务编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delBatch(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm("是否确认清空所有服务记录日志数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return clean();
        })
        .then(() => {
          this.getList();
          this.msgSuccess("清空成功");
        })
        .catch(() => {});
    },
  },
};
</script>
