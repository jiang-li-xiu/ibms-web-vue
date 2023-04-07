<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-06 17:13:10
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-10 10:41:30
-->

<template>
  <div class="container">
    <div class="parking-lot-charging-rules">
      <el-form
        :inline="true"
        ref="queryForm"
        :model="queryParams"
        class="demo-form-inline"
      >
        <el-form-item label="停车库名称" prop="parkName">
          <el-input
            v-model="queryParams.parkName"
            placeholder="请输入停车库名称"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="缴费车辆类型" prop="vehicleType">
          <el-select
            v-model="queryParams.vehicleType"
            placeholder="请选择缴费车辆类型"
            clearable
          >
            <el-option
              v-for="item in vehicleTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收费规则类型" prop="chargeRuleType">
          <el-select
            v-model="queryParams.chargeRuleType"
            placeholder="请选择收费规则类型"
            clearable
          >
            <el-option
              v-for="item in chargeRuleTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="是否按天封顶" prop="dayLimitFlag">
          <el-select
            v-model="queryParams.dayLimitFlag"
            placeholder="请选择是否按天封顶"
            clearable
          >
            <el-option
              v-for="item in dayLimitFlagList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
        :row-key="rowKey"
      >
        <el-table-column type="selection" header-align="center" align="center">
        </el-table-column>
        <el-table-column
          label="停车库名称"
          prop="parkName"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <!-- 缴费车辆类型  -1：不区分车辆类型 0：其他车；1：小型车；2：大型车；3：摩托车 -->
        <el-table-column
          label="缴费车辆类型"
          prop="vehicleType"
          header-align="center"
          align="center"
          :formatter="vehicleTypeFormat"
        >
        </el-table-column>
        <!--收费规则类型 0:按单位时段收费  1:按总计时长收费 2:按次收费 3:日夜组合收费 4:按停车时间收费 -->
        <el-table-column
          label="收费规则类型"
          prop="chargeRuleType"
          header-align="center"
          align="center"
          :formatter="chargeRuleTypeFormat"
        >
        </el-table-column>
        <el-table-column
          label="收费编码"
          prop="chargeRuleSyscode"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="收费规则名称"
          prop="chargeRuleName"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <!-- 0-不启用，1-启用 -->
        <el-table-column
          label="是否按天封顶"
          prop="dayLimitFlag"
          header-align="center"
          align="center"
          :formatter="dayLimitFlagFormat"
        >
        </el-table-column>
        <el-table-column
          label="按天封顶费用"
          prop="dayLimitFee"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button icon="el-icon-view" @click="handleDetail(scope.row)"
              >详情</el-button
            >
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
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      title="停车场收费规则详情"
      :visible.sync="dialogDetailVisible"
      width="30%"
    >
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
// API
import {
  getChargeRules,
  getDetailParkingChargingRules,
} from "@/api/subsystem/parking-system/parking-lot-charging-rules.js";

// 混入
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  data() {
    return {
      // 唯一标识
      rowKey: "id",
      // 表单数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parkSyscode: null, //停车库唯一标识
        parkName: "",
        vehicleType: null, //缴费车辆名称
        chargeRuleName: "",
        chargeRuleType: null, //收费规则类型
        dayLimitFee: "",
        dayLimitFlag: null,
        chargeRuleDetail: "", //收费规则详情
      },
      // 是否显示弹窗
      dialogDetailVisible: false,
      // 缴费车辆类型列表
      vehicleTypeList: [],
      // 收费规则类型列表
      chargeRuleTypeList: [],
      // 是否按天封顶
      dayLimitFlagList: [],
      // 表格数据
      tableList: [],
      // 详情弹窗
      details: [],

      interface: {
        // 获取表格列表
        getTableList: getChargeRules,
      },
    };
  },
  created() {
    // 获取收费规则类型字典
    this.getDicts("charging_rules_type").then((res) => {
      this.chargeRuleTypeList = res.data;
    });
    // 获取缴费车辆类型列表
    this.getDicts("vehicle_type").then((res) => {
      this.vehicleTypeList = res.data;
    });
    // 获取是否按天封顶
    this.getDicts("is_according_days_caps").then((res) => {
      this.dayLimitFlagList = res.data;
    });
  },
  methods: {
    // 打开详情弹窗
    handleDetail(row) {
      getDetailParkingChargingRules(row.id).then(({ data }) => {
        let newData = [],
          template = {
            chargeRuleName: "	收费规则名称",
            chargeRuleSyscode: "	收费编码",
            chargeRuleType: "	收费规则类型",
            dayLimitFee: "按天封顶费用",
            dayLimitFlag: "是否按天封顶",
            parkName: "	停车库名称",
            parkSyscode: "停车库唯一标识码",
            vehicleType: "缴费车辆类型",
          },
          i = 1;

        for (let key in template) {
          if (key == "vehicleType") {
            data[key] = this.vehicleTypeFormat(data);
          } else if (key == "chargeRuleType") {
            data[key] = this.chargeRuleTypeFormat(data);
          } else if (key == "dayLimitFlag") {
            data[key] = this.dayLimitFlagFormat(data);
          }
          newData.push({
            id: i,
            title: template[key],
            value: data[key],
          });
          i++;
        }
        this.details = newData;
        this.dialogDetailVisible = true;
      });
    },

    // 变量数据类型字典翻译 缴费车辆类型
    vehicleTypeFormat(row, column) {
      return this.selectDictLabel(this.vehicleTypeList, row.vehicleType);
    },
    // 变量数据类型字典翻译 收费规则类型
    chargeRuleTypeFormat(row, column) {
      return this.selectDictLabel(this.chargeRuleTypeList, row.chargeRuleType);
    },
    // 是否按天封顶
    dayLimitFlagFormat(row) {
      return this.selectDictLabel(this.dayLimitFlagList, row.dayLimitFlag);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  padding: 1em;

  .parking-lot-charging-rules {
    min-height: calc(100vh - 124px);
    background-color: #fff;
    padding: 0.7em;
    border-radius: 0.2em;
  }
}

.title-value-item {
  display: flex;

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
}

.title-value-item:first-child {
  border-top: 1px solid #777;
}

.title-value-item > div {
  padding: 0.3em 0;
  border-bottom: 1px solid #777;
  border-left: 1px solid #777;
}
</style>
