<template>
  <div class="app-container linkage-record">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="联动名称" prop="linkName">
        <el-input
          v-model="queryParams.linkName"
          placeholder="请输入联动名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="联动触发类型" prop="triggerMode">
        <el-select
          v-model="queryParams.triggerMode"
          placeholder="请选择联动触发类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in triggerModeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="联动查看状态" prop="checkStatus">
        <el-select v-model="queryParams.checkStatus" placeholder="请选择">
          <el-option key="0" label="未查看" value="0"> </el-option>
          <el-option key="1" label="已查看" value="1"> </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="联动触发时间" prop="triggerTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.triggerTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择联动触发时间">
        </el-date-picker>
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
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['subsystem:linkRecord:export']"
          >导出</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete()"
          v-hasPermi="['subsystem:linkRecord:remove']"
          >删除</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      class="table"
      :row-key="rowKey"
      v-loading="loading"
      :data="linkRecordList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="联动id" align="center" prop="id" />
      <el-table-column label="联动名称" align="center" prop="linkName" />
      <el-table-column
        label="联动触发类型"
        align="center"
        prop="triggerMode"
        :formatter="triggerModeFormat"
      />
      <el-table-column
        label="联动触发时间"
        align="center"
        prop="triggerTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.triggerTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联动查看状态"
        align="center"
        prop="checkStatus"
        width="180"
      >
        <template slot-scope="scope">
          <span>
            <el-tag v-if="scope.row.checkStatus == 0" type="warning"
              >未查看</el-tag
            >
            <el-tag v-else type="success">已查看</el-tag>
          </span>
        </template>
      </el-table-column>
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
            @click="handleDetail(scope.row.id)"
            v-hasPermi="['ruoyi-ibms-link:linkConfig:detail']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ruoyi-ibms-link:linkConfig:delete']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      class="pagination"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改联动记录对话框 -->
    <link-details
      ref="modelForm"
      @ok="modalFormOk"
    ></link-details>
  </div>
</template>

<script>
import {
  getLinkRecordList,
  delLinkRecord,
  addLinkRecord,
  updateLinkRecord,
} from "@/api/linkage/linkRecord";
import LinkDetails from "@/components/RecordTab/LinkDetails";

import { TableListMixin } from "@/mixins/TableListMixin";

export default {
  mixins: [TableListMixin],
  name: "LinkRecord",
  components: {
    LinkDetails,
  },
  data() {
    return {
      rowKey: "id",
      // 联动记录表格数据
      linkRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 联动触发类型字典
      triggerModeOptions: [],
      //操作符字典
      operatorOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        linkName: null,
        triggerMode: null,
        triggerTime: null,
        checkStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      dialogData: null,
      interface: {
        delList: delLinkRecord,
      },
    };
  },
  created() {
    this.getDicts("link_trigger_condition").then((response) => {
      this.triggerModeOptions = response.data;
    });
    this.getDicts("link_trigger_operator").then((response) => {
      this.operatorOptions = response.data;
    });
  },
  methods: {
    /** 查询联动记录列表 */
    getList() {
      this.loading = true;
      getLinkRecordList(this.queryParams).then((response) => {
        this.linkRecordList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 联动触发类型字典翻译
    triggerModeFormat(row, column) {
      return this.selectDictLabel(this.triggerModeOptions, row.triggerMode);
    },
    // 联动触发类型字典翻译
    operatorFormat(column) {
      return this.selectDictLabel(this.operatorOptions, column);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateLinkRecord(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLinkRecord(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/link/record/v1/export",
        this.queryParams,
        "联动记录.xlsx"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.linkage-record {
  height: calc(100vh - 20px - 59px - 28px);
  overflow-y: hidden;
  position: relative;
}
.table {
  height: calc(100% - 160px);
  overflow-y: auto;
}
.pagination {
  height: 60px;
  margin-bottom: 0;
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 40px;
  z-index: 99;
  background-color: #fff;
}
@media screen and (max-width: 1240px) {
  .table {
    padding-bottom: 30px;
  }
}
@media screen and (max-width: 689px) {
  .table {
    padding-bottom: 160px;
  }
}
</style>
