<!--
 * @Author: your name
 * @Date: 2021-09-08 19:10:41
 * @LastEditTime: 2022-05-17 16:08:45
 * @LastEditors: PengXuanwei
 * @Description: In User Settings Edit
 * @FilePath: \ibms-web-vue\src\views\subsystem\parking-system\parking-equipment\assembly-table.vue
-->
<template>
  <div>
    <div class="assembly-table-title">{{ title }}</div>
    <div class="assembly-table-main">
      <!-- 查询选项 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :rules="queryFormRules"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="告警名称" prop="deviceTypeName">
          <el-input
            v-model="queryParams.deviceTypeName"
            placeholder="请输入告警名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label-width="100px" label="设备名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label-width="100px" label="报警时间" prop="time">
          <el-date-picker
            v-model="queryParams.time"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label-width="100px" label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 导出 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            :disabled="false"
            @click="bindingClick"
            icon="el-icon-download"
          >
            导出
          </el-button>
        </el-col>
      </el-row>

      <!-- table表格 -->
      <el-table
        :height="tableHeight"
        v-loading="loading"
        :data="regioninfoList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="告警区域"
          width="200"
          align="center"
          prop="deviceId"
        />
        <el-table-column
          label="告警名称"
          width="200"
          align="center"
          prop="deviceTypeName"
        />
        <el-table-column
          label="设备名称"
          width="150"
          align="center"
          prop="name"
        />
        <!-- <el-table-column
          label="设备ID"
          width="150"
          align="center"
          prop="deviceId"
        /> -->
        <el-table-column
          label="回路话"
          width="150"
          align="center"
          prop="deviceId"
        />
        <el-table-column label="创建时间" align="center" prop="creationTime" />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 查看详情-弹框 -->
    <el-dialog title="设备详情" :visible.sync="dialogVisible" width="40%">
      <div class="dialog-form" v-for="(item, index) in formData" :key="index">
        <div class="dialog-form-left">{{ item.name }}</div>
        <div class="dialog-form-right">{{ item.value }}</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  props: {
    treeNode: Object,
  },
  data() {
    return {
      tableHeight: 0, //表格高度
      loading: "", //加载
      title: "全部", //标题
      ids: [], //多选后获取到的id
      dialogVisible: false, //弹框显示
      formData: [], //弹出框数据
      regioninfoList: [
        {
          name: "1号出口",
          deviceId: 1002,
          deviceTypeName: "道闸",
          deviceName: "负一楼",
          isStatus: 1,
          creationTime: "2021年9月9日08:41:02",
        },
      ], //table数据
      total: 0, //数据量
      queryParams: {
        deviceTypeName: "",
        deviceName: "",
        isStatus: "0",
        time: [],
        pageNum: 1,
        pageSize: 10,
      },
      // 检索验证
      queryFormRules: {
        deviceTypeName: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
        deviceName: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
  },
  methods: {
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 520;
    },
    //导出
    bindingClick() {
      this.download(
        "/firealarm/firealarm/event/export",
        {
          ids: this.ids,
        },
        "消防告警记录.xlsx"
      );
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
    },
    //查看详情
    viewdetailsClick(row) {
      this.dialogVisible = true;
      console.log(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    //table数据请求
    getList() {
      this.loading = true;
    },
  },
  watch: {
    treeNode: {
      handler(newVal) {
        this.queryParams.regionId = newVal.regionId;
        this.tableTitle = newVal.regionName;
        this.getList();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.assembly-table-title {
  letter-spacing: 2px;
  font-weight: 600;
  padding: 10px;
  font-size: 18px;
  border-bottom: 1px solid #d6d6d6;
}
// 内容
.assembly-table-main {
  padding: 10px;
}
/* 弹框 */
.dialog-form {
  display: flex;
  div {
    flex: 1;
    border: 1px solid #bfbfbf;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-bottom: 0;
  }
  .dialog-form-left {
    background-color: #f2f2f2;
  }
}
.dialog-form:last-child {
  border-bottom: 1px solid #bfbfbf;
}
</style>
