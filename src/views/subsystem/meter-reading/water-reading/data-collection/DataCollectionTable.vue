<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-14 08:37:47
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-26 17:59:37
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
        :rules="queryFormRules"
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
        <el-form-item label-width="100px" label="设备状态" prop="status">
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
        :row-key="rowKey"
        :height="tableHeight"
        v-loading="loading"
        :data="regioninfoList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="仪表ID" width="80" align="center" prop="id" />
        <el-table-column
          label="仪表名称"
          width="200"
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
          width="200"
          align="center"
          prop="meterPosition"
        />
        <el-table-column label="在线状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 0"> 在线</el-tag>
            <el-tag type="danger" v-else>离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上次抄表读数" width="100" align="center">
          <template slot="header"> 上次抄表读数 <br />立方米 </template>
          <template slot-scope="scope">
            <span>{{ scope.row.oldValue }} </span>
          </template>
        </el-table-column>
        <el-table-column label="本次抄表读数" width="100" align="center">
          <template slot="header"> 本次抄表读数 <br />立方米 </template>
          <template slot-scope="scope">
            <span>{{ scope.row.curValue }} </span>
          </template>
        </el-table-column>
        <el-table-column label="用量" width="100" align="center" prop="value">
          <template slot="header"> 用量 <br />立方米 </template>
          <template slot-scope="scope">
            <span>{{ scope.row.value }} </span>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="120" align="center">
          <template slot="header"> 单价 <br />元/立方米 </template>
          <template slot-scope="scope">
            <span>{{ scope.row.unitPrice }} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="消费金额"
          width="120"
          align="center"
          prop="price"
        >
          <template slot="header"> 消费金额 <br />元 </template>
          <template slot-scope="scope">
            <span>{{ scope.row.price }} 元</span>
          </template>
        </el-table-column>
        <el-table-column label="计价方式" align="center" prop="schemeName" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              plain
              @click="viewdetailsClick(scope.row.id)"
              >详情</el-button
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
    <collection-detail ref="collectionDetailClick"></collection-detail>
  </div>
</template>

<script>
import { getMeterreadList } from "@/api/subsystem/meter-reading/pricing-management.js";
import { TableListMixin } from "@/mixins/TableListMixin";
import printJS from "print-js";
import CollectionDetail from "./CollectionDetail";

export default {
  mixins: [TableListMixin],
  components: {
    CollectionDetail,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "id",
      tableHeight: 0, //表格高度
      title: "全部", //标题
      regioninfoList: [], //table数据
      printData: [], // 打印的数据
      queryParams: {
        regionId: 0, //区域id
        meterType: "远程抄表系统-水表",
        meterName: "",
        status: "", //在线0  不在线1
        pageNum: 1,
        pageSize: 10,
      },
      // 检索验证
      queryFormRules: {
        meterName: [],
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
      if (this.selectedRowKeys.length == 0) {
        msg = "是否确认导出全部数据？";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (_this.selectedRowKeys.length == 0) {
            _this.download(
              "/meterread/data/export",
              data,
              `抄表数据_${new Date().getTime()}.xlsx`
            );
          } else {
            _this.download(
              "/meterread/data/exportMost",
              { ids: _this.selectedRowKeys },
              `抄表数据_${new Date().getTime()}.xlsx`
            );
          }
        })
        .catch(() => {});
    },

    // 打印
    print() {
      printJS({
        printable: this.printData,
        properties: [
          { field: "id", displayName: "仪表ID" },
          { field: "meterName", displayName: "仪表名称" },
          { field: "meterType", displayName: "仪表类型" },
          { field: "meterPosition", displayName: "仪表位置" },
          { field: "status", displayName: "状态" },
          { field: "oldValueUnit", displayName: "上次抄表读数" },
          { field: "curValueUnit", displayName: "本次抄表读数" },
          { field: "valueUnit", displayName: "用量" },
          { field: "unitPriceUnit", displayName: "单价" },
          { field: "price", displayName: "消费金额" },
          { field: "schemeName", displayName: "计价方式" },
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
    //查看详情
    viewdetailsClick(id) {
      this.$refs.collectionDetailClick.edit(id);
    },
    // table数据请求
    getList() {
      this.loading = true;
      getMeterreadList(this.queryParams).then((response) => {
        this.total = response.total;
        this.regioninfoList = response.rows;
        this.printData = response.rows.map((item) => {
          let {
            id,
            meterName,
            meterType,
            meterPosition,
            status,
            oldValue,
            unit,
            curValue,
            value,
            unitPrice,
            price,
            schemeName,
          } = item;

          return {
            id,
            meterName,
            meterType,
            meterPosition,
            status: status == "0" ? "在线" : "离线",
            oldValueUnit: oldValue == null ? "0" + unit : oldValue + unit,
            curValueUnit: curValue == null ? "0" + unit : curValue + unit,
            valueUnit: value == null ? "0" + unit : value + unit,
            unitPriceUnit:
              unitPrice == null ? "0" + "/元" + unit : unitPrice + "/元" + unit,
            price: price + "元",
            schemeName,
          };
        });
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
</style>
