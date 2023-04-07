<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-14 08:37:47
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 16:32:18
-->
<template>
  <div>
    <div class="assembly-table-title">{{ title }}</div>
    <div class="assembly-table-main">
      <!-- 查询选项 -->
      <el-form
        v-show="showSearch"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="仪表名称" prop="meterName">
          <el-input
            v-model="queryParams.meterName"
            placeholder="请输入仪表名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备状态" prop="status" label-width="100px">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择设备状态"
            clearable
          >
            <el-option label="在线" value="0" />
            <el-option label="离线" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label=" " label-width="100px">
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
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <!-- table表格 -->
      <el-table
        v-loading="loading"
        :data="regioninfoList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="仪表ID" width="80" align="center" prop="id" />
        <el-table-column
          label="仪表名称"
          width="150"
          align="center"
          prop="meterName"
        />
        <el-table-column
          label="仪表类型"
          width="80"
          align="center"
          prop="meterType"
        />
        <el-table-column
          label="仪表位置"
          width="150"
          align="center"
          prop="meterPosition"
        />
        <el-table-column label="状态" width="60" align="center">
          <template slot-scope="scope">
            <span
              class="state"
              :class="scope.row.status == '0' ? 'onstate' : 'unstate'"
              >{{ scope.row.status == "0" ? "在线" : "离线" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="上次抄表读数 流量(m³/h)"
          width="100"
          align="center"
        >
          <template slot="header"> 上次抄表读数 <br />流量(m³/h) </template>
          <template slot-scope="scope">
            <span>{{ scope.row.oldValue }} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="本次抄表读数 流量(m³/h)"
          width="100"
          align="center"
        >
          <template slot="header"> 本次抄表读数 <br />流量(m³/h) </template>
          <template slot-scope="scope">
            <span>{{ scope.row.curValue }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" align="center" prop="value">
          <template slot="header"> 用量 <br />流量(m³/h) </template>
          <template slot-scope="scope">
            <span>{{ scope.row.value }} </span>
          </template>
        </el-table-column>
        <el-table-column label="单价 元/流量(m³/h)" width="120" align="center">
          <template slot="header"> 单价 <br />元/流量(m³/h) </template>
          <template slot-scope="scope">
            <span>{{ scope.row.unitPrice }} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="消费金额 元"
          width="120"
          align="center"
          prop="price"
        >
          <template slot="header"> 消费金额 <br />元 </template>
          <template slot-scope="scope">
            <span>{{ scope.row.price }} </span>
          </template>
        </el-table-column>
        <el-table-column label="计价方式" align="center" prop="schemeName" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-view"
              @click="viewdetailsClick(scope.row.id)"
              >查看历史详情</el-button
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
    </div>
    <!-- 查看详情-弹框 -->
    <el-dialog title="抄表历史记录" :visible.sync="dialogVisible" width="40%">
      <el-table :data="formData" border style="width: 100%">
        <el-table-column label="仪表名称" align="center" prop="meterName" />
        <el-table-column label="上次抄表读数" align="center" prop="oldValue" />
        <el-table-column label="本次抄表读数" align="center" prop="curValue" />
        <el-table-column
          label="抄表日期"
          width="200"
          align="center"
          prop="createTime"
        />
      </el-table>
      <div class="collection-dialog"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMeterreadList,
  getOneByDataId,
} from "@/api/subsystem/meter-reading/pricing-management.js";

export default {
  props: {
    treeNode: Object,
  },
  data() {
    return {
      showSearch: true, // 显示搜索条件
      tableHeight: 0, //表格高度
      loading: "", //加载
      title: "全部", //标题
      ids: [], //多选后获取到的id
      dialogVisible: false, //弹框显示
      formData: [], //弹出框数据，
      regioninfoList: [], //table数据
      total: 0, //数据量
      queryParams: {
        regionId: 0, //区域id
        meterType: "远程抄表系统-空调表",
        meterName: "",
        status: "", //在线0  不在线1
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
    this.getList();
  },
  methods: {
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 350;
    },
    //导出
    bindingClick() {
      const _this = this;
      let msg = "是否确认导出选中数据？";
      let data = {
        regionId: this.queryParams.regionId,
        meterType: this.queryParams.meterType,
      };
      if (this.ids.length == 0) {
        msg = "是否确认导出全部数据？";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (_this.ids.length == 0) {
            _this.download(
              "/meterread/data/export",
              data,
              `抄表数据_${new Date().getTime()}.xlsx`
            );
          } else {
            _this.download(
              "/meterread/data/exportMost",
              { ids: _this.ids },
              `抄表数据_${new Date().getTime()}.xlsx`
            );
          }
        })
        .catch(() => {});
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
    },
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    //查看详情
    viewdetailsClick(id) {
      getOneByDataId({ id }).then((response) => {
        this.formData = response.rows;
        this.dialogVisible = true;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    //table数据请求
    getList() {
      this.loading = true;
      getMeterreadList(this.queryParams).then((response) => {
        this.total = response.total;
        this.regioninfoList = response.rows;
        this.loading = false;
      });
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
.onstate {
  color: #95f204;
}
.unstate {
  color: #d9001b;
}
</style>
