<!--
 * @Author: MJ
 * @Date: 2021-11-09 14:56:41
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-11 16:38:53
 * @Description: 
-->
<template>
  <div class="main-box">
    <el-card class="min-height-124">
      <el-form :inline="true" ref="ruleForm" :model="from" >
        <el-form-item label="车牌号" prop="plateNo">
          <el-input v-model="from.plateNo" placeholder="请输入车牌号" clearable></el-input>
        </el-form-item>

        <el-form-item label="卡号" prop="cardNo">
          <el-input v-model="from.cardNo" placeholder="请输入卡号" clearable></el-input>
        </el-form-item>

        <el-form-item label="收费来源" prop="chargeSource">
          <el-select v-model="from.chargeSource" placeholder="请选择收费来源" clearable>
            <el-option
              v-for="item in optionChargeSource"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收费时间" prop="payTime">
          <el-date-picker
            v-model="from.payTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收费方式" prop="chargeType">
          <el-select v-model="from.chargeType" placeholder="请选择收费方式" clearable>
            <el-option
              v-for="item in optionChargeType"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        

        <el-form-item label="">
          <el-button icon="el-icon-search" type="primary" @click="onSubmit"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetForm('ruleForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-row>
        <el-col :span="2">
          <el-button icon="el-icon-download" type="primary" @click="exports"
            >导出</el-button
          >
        </el-col>
      </el-row>

      <el-table
        :height="tableHeight"
        :data="dataTable"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" header-align="center" align="center">
        </el-table-column>
        <el-table-column
          label="车库名称"
          prop="parkName"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          label="车牌号"
          prop="plateNo"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="卡号" prop="cardNo" header-align="center" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="收费规则"
          prop="chargeRuleName"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="减免金额"
          prop="deduceCost"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="应收金额"
          prop="supposeCost"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="实收金额"
          prop="cost"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="账单总金额"
          prop="totalCost"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="异常收费规则名称"
          prop="exceptionRuleName"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="优惠规则名称"
          prop="reductRuleName"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="优惠类型"
          prop="reductType"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="收费来源"
          prop="chargeSource"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="收费方式"
          prop="chargeType"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="缴费时间"
          prop="payTime"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center" width="120">
          <template slot-scope="scope">
            <el-button icon="el-icon-view" @click="openDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="from.pageNum"
        :limit.sync="from.pageSize"
        @pagination="getList"
      />
    </el-card>

    <el-dialog title="车辆缴费记录详情" :visible.sync="dialogTableVisible" width="30%">
      <div class="title-value-box">
        <div class="title-value-item" v-for="item in details" :key="item.id">
          <div class="title-box">{{ item.title }}</div>
          <div class="value-box">{{ item.value }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getParkinglotCost,
  getParkinglotCostChargeSources,
  getParkinglotCostChargeTypes,
  getParkinglotCostId,
} from "@/api/subsystem/parking-system/payment-refund-record/index";

export default {
  data() {
    return {
      from: {
        pageNum: 1,
        pageSize: 10,
        plateNo: "",
        cardNob: "",
        chargeSource: "",
        chargeType: "",
        payTime: null,
      },
      optionChargeSource: [],
      optionChargeType: [],
      total: 0,
      dataTable: [],
      tableHeight: 0,
      dialogTableVisible: false,
      details: [],
      selectionId: [],
      canClick: true,
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight, true);
    this.getList();
    this.getParkinglotCostChargeSourcess();
    this.getParkinglotCostChargeTypess();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight, true);
  },

  methods: {
    // 获取表格数据
    async getList() {
      let { rows, total } = await getParkinglotCost(this.from);
      this.total = total;
      this.dataTable = rows;
    },

    // 收费来源
    async getParkinglotCostChargeSourcess() {
      let { data } = await getParkinglotCostChargeSources();
      this.optionChargeSource = data;
    },

    // 收费方式
    async getParkinglotCostChargeTypess() {
      let { data } = await getParkinglotCostChargeTypes();
      this.optionChargeType = data;
    },

    // 获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 420;
    },

    // 详情痰喘
    openDetail(row) {
      getParkinglotCostId(row.id).then(({ data }) => {
        let newData = [],
          template = {
            parkName: "车库名称",
            plateNo: "车牌号",
            cardNo: "卡号",
            chargeRuleName: "收费规则",
            deduceCost: "减免金额",
            supposeCost: "应收金额",
            cost: "实收金额",
            totalCost: "账单总金额",
            exceptionRuleName: "异常收费规则名称",
            reductRuleName: "优惠规则名称",
            reductType: "优惠类型",
            chargeSource: "收费来源",
            chargeType: "收费方式",
            payTime: "缴费时间",
          },
          i = 1;

        for (let key in template) {
          newData.push({
            id: i,
            title: template[key],
            value: data[key],
          });
          i++;
        }
        this.details = newData;
        this.dialogTableVisible = true;
      });
    },

    // 表格多选
    handleSelectionChange(event) {
      this.selectionId = event.map((item) => {
        return item.id;
      });
    },

    // 导出
    exports() {
      if (!this.selectionId.length) {
        this.$message({
          message: "请至少选择一条数据",
          type: "warning",
        });
        return false;
      }

      if (this.canClick) {
        this.canClick = false;
        this.download(
          "/parkinglot/cost/export",
          { ids: this.selectionId },
          "车辆缴费记录.xlsx"
        );
        setTimeout(() => {
          this.canClick = true;
        }, 3000);
      }
    },

    // 查询
    onSubmit() {
      this.getList();
    },
    

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.from.pageNum = 1;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">

.title-value-item {
  display: flex;
}

.title-value-item:first-child {
  border-top: 1px solid #777;
}

.title-value-item > div {
  padding: 0.3em 0;
  border-bottom: 1px solid #777;
  border-left: 1px solid #777;
}

.title-box {
  background-color: #eee;
  text-align: center;
  flex: 1;
}

.value-box {
  text-align: center;
  flex: 2;
  border-right: 1px solid #777;
}
</style>
