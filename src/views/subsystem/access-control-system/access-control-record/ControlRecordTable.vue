<template>
  <el-card class="min-height-124">
    <!-- 标题 -->
    <div class="table-title">{{ tableTitle }}</div>

    <!-- 查询选项 -->
    <el-form
      :inline="true"
      :model="queryParams"
      ref="queryForm"
      :rules="queryFormRules"
      v-show="showSearch"
    >
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="personName">
        <el-input
          v-model="queryParams.personName"
          placeholder="请输入用户姓名"
          clearable
          @keyup.enter.native="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          maxlength="11"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="crossTime">
        <el-date-picker
          v-model="queryParams.dateRange"
          :editable="false"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="datePicker"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="handleQuery"
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
          icon="el-icon-download"
          :disabled="false"
          @click="exportss"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="false" @click="print" icon="el-icon-printer">
          打印
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- table表格 -->
    <el-table
      v-loading="loading"
      :data="tableList"
      :row-key="rowKey"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" label="设备名称" prop="deviceName">
      </el-table-column>

      <el-table-column align="center" prop="personName" label="姓名">
      </el-table-column>
      <el-table-column align="center" prop="mobile" label="手机号">
      </el-table-column>
      <el-table-column align="center" prop="roomNo" label="卡号">
      </el-table-column>
      <el-table-column align="center" prop="recordType" label="记录类型">
      </el-table-column>
      <el-table-column align="center" prop="eventType" label="开门方式">
      </el-table-column>
      <el-table-column align="center" prop="crossTime" label="时间">
      </el-table-column>
      <!-- pictureFile -->
      <el-table-column align="center" label="开门抓拍">
        <template slot-scope="scope">
          <el-button icon="el-icon-view" @click="seePictureFiles(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 图片查看窗 -->
    <el-dialog :visible.sync="dialogVisible" width="40%" title="抓拍图片">
      <div class="flex-row-cc">
        <el-image class="images" :src="imageUrl" v-if="imageUrl"></el-image>
        <el-empty description="无进出记录图片" :image-size="400" v-else></el-empty>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import {
  getAccessRecord,
  getImageUrl,
} from "@/api/subsystem/access-control-system/accessControlRecord";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  name: "ControlRecordTable",
  mixins: [TableListMixin],
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "id",
      tableTitle: "全部", //标题
      // 请求列表参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        personName: "",
        deviceName: "",
        regionId: 0,
        mobile: "",
        crossTime: [],
        dateRange: [],
      },
      // 检索验证
      queryFormRules: {
        personName: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
        deviceName: [
          //   {
          //     validator: this.validateQueryFormRules,
          //     trigger: ["blur", "change"],
          //   },
        ],
        mobile: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
      // 字典
      ibmsDeviceState: [],
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getAccessRecord,
      },
      dialogVisible: false,
      imageUrl: "",
    };
  },

  methods: {
    // 导出
    exportss() {
      if (this.selectedRowKeys) {
        this.download(
          "/access/record/export",
          { ids: this.selectedRowKeys.toString() },
          "门禁出入记录.xlsx"
        );
      } else {
        this.$message({
          message: "至少选择一条数据",
          type: "warning",
        });
        return false;
      }
    },

    // 打印
    print() {
      printJS({
        printable: this.tableList,
        properties: [
          { field: "deviceName", displayName: "设备名称" },
          { field: "personName", displayName: "姓名" },
          { field: "mobile", displayName: "手机号" },
          { field: "roomNo", displayName: "房号" },
          { field: "eventType", displayName: "开门方式" },
          { field: "crossTime", displayName: "时间" },
        ],
        type: "json",
        gridStyle: "border: 1px solid #3971A5; text-align: center",
        gridHeaderStyle: "border: 1px solid #3971A5;",
        scanStyles: false, // 不适用默认样式
        repeatTableHeader: false, // 打印json表头只显示在第一页
        style: "@page{size: auto; margin: 0cm 1cm 0cm 1cm;}", // 去除页眉页脚
        // scanStyles: false,
      });
    },
    // 选定日期（清空/确定）
    datePicker(e) {
      this.queryParams.crossTime = [];
      this.queryParams.dateRange = e;
      if (e == null) {
        this.getList();
      } else {
        e.forEach((item) => {
          this.queryParams.crossTime.push(
            this.parseTime(item, "{y}-{m}-{d} {h}:{i}:{s}")
          );
        });
      }
    },
    seePictureFiles(row) {
      let data = {
        svrIndexCode:row.svrIndexCode,
        pictureFile:row.pictureFile
      }
      getImageUrl(data).then(res=>{
        this.imageUrl = res.data
        this.dialogVisible = true;
      })
      
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
</style>