<template>
  <div>
    <div class="assembly-table-title">
      {{ tableTitle }}<span>停车情况</span>
    </div>
    <div class="assembly-table-main">
      <!-- 查询选项 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :rules="queryFormRules"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input
            v-model="queryParams.plateNumber"
            placeholder="请输入车牌号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="入场时间" prop="inTime">
          <el-date-picker
            v-model="queryParams.inTime"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车位编号" prop="parkingNumber">
          <el-input
            v-model="queryParams.parkingNumber"
            placeholder="请输入车牌号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="车位状态" prop="state">
          <el-select v-model="queryParams.state" placeholder="请选择">
            <el-option
              v-for="(item, index) in ['未停', '已停']"
              :key="item.value"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
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
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="车牌号码" align="center" prop="plateNumber" />
        <el-table-column label="车牌颜色" align="center" prop="plateColor" />
        <el-table-column label="入场时间" align="center" prop="inTime" />
        <el-table-column label="楼层" align="center" prop="floorName" />
        <el-table-column label="车位编号" align="center" prop="parkingNumber" />
        <el-table-column label="车位类型" align="center" prop="parkingType" />
        <el-table-column label="车位状态" align="center" prop="state">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state ? 'warning' : 'success'">{{
              scope.row.state ? "已停" : "未停"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" align="center" prop="inDeviceName" />
        <el-table-column
          label="车辆图片"
          align="center"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.state == 1"
              icon="el-icon-view"
              plain
              @click="handleDetail(scope.row)"
              >查看</el-button
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
    <parking-detail ref="modelForm"></parking-detail>
  </div>
</template>
<script>
import { getParkinglotNow } from "@/api/subsystem/parking-system/parking-system.js";
import { TableListMixin } from "@/mixins/TableListMixin";
import ParkingDetail from "./ParkingDetail";

export default {
  mixins: [TableListMixin],
  components: {
    ParkingDetail,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      //标题
      tableTitle: "全部",
      //多选后获取到的id
      ids: [],
      queryParams: {
        regionId: 0, //区域
        plateNumber: "", //车牌号
        inTime: [], //入场时间
        pageNum: 1,
        pageSize: 10,
        // parkingNumber: "",
      },
      // 检索验证
      queryFormRules: {
        plateNumber: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getParkinglotNow,
      },
    };
  },
  created() {},
  methods: {
    //导出
    bindingClick() {
      this.download(
        "/parkinglot/device/export",
        {
          ids: this.ids,
        },
        "停车场场内记录.xlsx"
      );
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
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
  span {
    margin-left: 5px;
  }
}
// 内容
.assembly-table-main {
  padding: 20px;
}
</style>
