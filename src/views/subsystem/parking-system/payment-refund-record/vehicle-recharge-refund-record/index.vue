<!--
 * @Author: MJ
 * @Date: 2021-11-09 17:40:47
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-11 16:37:05
 * @Description: 
-->
<template>
  <div class="vehicle-payment-record-box">
    <div class="vehicle-payment-record">
      <el-form :inline="true" ref="ruleForm" :model="from" class="demo-form-inline">
        <el-form-item label="车牌号" prop="plateNo">
          <el-input v-model="from.plateNo" placeholder="请输入车牌号" clearable></el-input>
        </el-form-item>

        <el-form-item  label="交易类型" prop="tradeType">
          <el-select v-model="from.tradeType" clearable placeholder="请选择交易类型">
            <el-option
              v-for="item in optionsType"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  label="交易方式" prop="tradeWay">
          <el-select v-model="from.tradeWay" clearable placeholder="请选择交易方式">
            <el-option
              v-for="item in optionsWays"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  label="交易时间" prop="tradeTime">
          <el-date-picker
            v-model="from.tradeTime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item  label="操作员" prop="operator">
          <el-input v-model="from.operator" placeholder="请输入操作员名称" clearable></el-input>
        </el-form-item>

        <el-form-item  label="">
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
        <el-table-column label="卡号" header-align="center" align="center">
          <template slot-scope="scope">{{ scope.row.cardNo }}</template>
        </el-table-column>
        <el-table-column
          label="车牌号"
          prop="plateNo"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="交易类型"
          prop="tradeType"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="交易方式"
          prop="tradeWay"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column label="交易金额" prop="fee" header-align="center" align="center">
        </el-table-column>
        <el-table-column
          label="交易时间"
          prop="tradeTime"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作员"
          prop="operator"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button  icon="el-icon-view"  @click="openDetail(scope.row)"
              >详情
            </el-button>
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
    </div>

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
  getParkinglotCarCharge,
  getParkinglotCarChargeTradeTypes,
  getParkinglotCarChargeTradeWays,
  getParkinglotCarChargeId,
} from "@/api/subsystem/parking-system/payment-refund-record/index";

export default {
  data() {
    return {
      from: {
        pageNum: 1,
        pageSize: 10,
        plateNo: "",
        tradeType: "",
        tradeWay: "",
        tradeTime: null,
        operator: "",
      },
      total: 0,
      dataTable: [],
      tableHeight: 0,
      optionsType: [],
      optionsWays: [],
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
    this.getParkinglotCarChargeTradeTypess();
    this.getParkinglotCarChargeTradeWayss();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight, true);
  },

  methods: {
    // 获取表格数据
    async getList() {
      let { rows, total } = await getParkinglotCarCharge(this.from);
      this.dataTable = rows;
      this.total = total;
    },

    // 获取交易类型
    async getParkinglotCarChargeTradeTypess() {
      let { data } = await getParkinglotCarChargeTradeTypes();
      this.optionsType = data;
    },

    // 获取交易方式数据
    async getParkinglotCarChargeTradeWayss() {
      let { data } = await getParkinglotCarChargeTradeWays();
      this.optionsWays = data;
    },

    // 获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 520;
    },

    // 详情痰喘
    openDetail(row) {
      getParkinglotCarChargeId(row.id).then(({ data }) => {
        let newData = [],
          template = {
            cardNo: "卡号",
            plateNo: "车牌号",
            tradeType: "交易类型",
            tradeWay: "交易方式",
            fee: "交易金额",
            tradeTime: "交易时间",
            operator: "操作员",
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
          "/parkinglot/carCharge/export",
          { ids: this.selectionId },
          "车辆充值退款记录.xlsx"
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
      from.pageNum = 1;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.vehicle-payment-record-box {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  padding: 1em;
}

.vehicle-payment-record {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 0.7em;
  border-radius: 0.2em;
}

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
