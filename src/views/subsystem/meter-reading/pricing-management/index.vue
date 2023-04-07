<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-15 08:57:05
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-26 17:52:38
-->
<template>
  <div class="pricing-management-box">
    <div class="assembly-table-main">
      <!-- 查询选项 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :rules="queryFormRules"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="方案名称" prop="schemeName">
          <el-input
            v-model="queryParams.schemeName"
            placeholder="请输入方案名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
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
            icon="el-icon-plus"
            :disabled="false"
            @click="handleUpdate(0)"
          >
            新增
          </el-button>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table
        :height="tableHeight"
        v-loading="loading"
        :data="tableList"
        border
      >
        <el-table-column label="方案名称" align="center" prop="schemeName" />
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            <span>{{
              scope.row.type == 1
                ? "水费"
                : scope.row.type == 2
                ? "电费"
                : scope.row.type == 3
                ? "燃气"
                : scope.row.type == 4
                ? "热能"
                : "空调流量"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="单价" align="center" width="100" prop="price" />
        <el-table-column
          label="创建日期"
          width="200"
          align="center"
          prop="createTime"
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
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id)"
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
    </div>
    <!-- 添加或修改计价方案对话框 -->
    <pricing-edit
      ref="pricingDialog"
      :pricing-options="pricingOptions"
      @ok="modalFormOk"
    ></pricing-edit>
  </div>
</template>
<script>
import {
  getMeterReadingList,
  deleteVideoViewDelete,
} from "@/api/subsystem/meter-reading/pricing-management.js";
import { TableListMixin } from "@/mixins/TableListMixin";
import PricingEdit from "./PricingEdit"
export default {
  mixins: [TableListMixin],
  components: {
    PricingEdit,
  },
  data() {
    return {
      tableHeight: 0, //表格高度
      title: "全部", //标题
      pricingOptions: [], //计价类型数组
      queryParams: {
        schemeName: "",
        pageNum: 1,
        pageSize: 10,
      },
      // 检索验证
      queryFormRules: {
        schemeName: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
      interface: {
        getTableList: getMeterReadingList,
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
    //获取计价方案类型数据
    this.getDicts("pricing_management_type").then((res) => {
      this.pricingOptions = res.data.map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue,
        };
      });
    });
  },
  methods: {
    //删除
    handleDelete(id) {
      let msg = "是否删除该方案？";
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteVideoViewDelete(id).then((res) => {
            if (res.code === 200) {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.getList();
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
              return;
            }
          });
        })
        .catch(() => {});
    },
    //点击新增||修改
    handleUpdate(row) {
      this.$refs.pricingDialog.edit(row)
    },
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 400;
    },
  },
};
</script>
<style lang="scss" scoped>
.pricing-management-box {
  background-color: #eee;
  padding: 20px;
  box-sizing: border-box;
}

// 内容
.assembly-table-main {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 20px;
}
</style>
