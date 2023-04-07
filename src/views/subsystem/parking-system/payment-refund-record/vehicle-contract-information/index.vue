<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-06 17:07:37
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-10 17:39:39
-->
<template>
  <div class="container">
    <div class="vehicle-contract-information">
      <el-tabs v-model="currentTab" @tab-click="handleTabChange">
        <el-tab-pane label="包期列表" name="0"></el-tab-pane>
        <el-tab-pane label="取消列表" name="1"></el-tab-pane>
      </el-tabs>
      <el-form
        :inline="true"
        ref="queryForm"
        :model="queryParams"
        class="demo-form-inline"
      >
        <el-form-item label="车牌号码" prop="plateNo">
          <el-input
            v-model="queryParams.plateNo"
            placeholder="请输入车牌号码"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="车主名称" prop="personName">
          <el-input
            v-model="queryParams.personName"
            placeholder="请输入车主名称"
            clearable
          ></el-input>
        </el-form-item>

        <!-- <el-form-item  label="开始时间：" prop="startTime">
          <el-date-picker
            v-model="queryParams.startTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item> -->

        <el-form-item label="">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
        row-key="parkSyscode"
      >
        <el-table-column type="selection" header-align="center" align="center">
        </el-table-column>
        <el-table-column
          label="区域编号"
          prop="regionIndexCode"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="车牌号码"
          prop="plateNo"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="车主编号"
          prop="personId"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="车主名称"
          prop="personName"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="车辆分类名称"
          prop="categoryName"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="卡号"
          prop="cardNo"
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
            <el-button
              type="danger"
              icon="el-icon-circle-close"
              @click="handleClick(scope.row)"
              v-if="currentTab == '0'"
              >取消包期</el-button
            >
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

    <!-- 取消包期弹窗信息 -->
    <el-dialog
      title="请确认"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确认是否取消车辆包期？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOK">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog
      title="车辆包期信息详情"
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
  getCancelPackage,
  getCarPageList,
  getDetail,
  getCancelDetail,
  getCarPageCancelList
} from "@/api/subsystem/parking-system/vehicle-contract-information.js";
// 混入
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  data() {
    return {
      // 当前选择的tab页
      currentTab: "0",
      // 表单数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        vehicleId: null, //车辆编码
        personId: null, //车主编号
        parkSyscode: null, //停车库唯一标识
        categoryCode: null, //车辆分类标识
        plateNo: "",
        personName: "",
        parkName: "",
        // startTime: null, //开始时间
        // endTime: null, //结束时间
      },
      // 表格数据
      tableList: [],
      // 详情数据
      details: [],
      //是否显示包期弹窗
      dialogVisible: false,
      // 详情弹窗
      dialogDetailVisible: false,
      interface: {
        // 获取表格列表
        getTableList: getCarPageList,
      },

      // 保存车牌号码
      plateNo: "",
      // 不执行混入的mounted
      disableMixinMounted: true,
    };
  },
  mounted(){
    this.handleTabChange({ name: '0' })
  },
  methods: {
    // tabs切换
    handleTabChange({ name }) {
      // 恢复请求第一页
      this.queryParams.pageNum = 1;
      // 根据当前tab页请求对应数据
      // 包期列表
      if (name == "0") {
        this.interface.getTableList = getCarPageList;
        this.getList();
      } else {
        // 取消列表
        this.interface.getTableList = getCarPageCancelList;
        this.getList();
      }
    },
    // 打开取消车辆包期弹窗
    handleClick(row) {
      console.log(row);
      this.plateNo = row.plateNo;
      // 显示弹窗
      this.dialogVisible = true;
    },

    // 确认取消车辆包期
    handleOK() {
      getCancelPackage(this.plateNo).then((res) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
        this.$message.success(res.msg);
        this.getList();
        this.dialogVisible = false;
      });
    },

    // 取消关闭
    handleClose() {
      // 隐藏弹窗
      this.dialogVisible = false;
    },

    // 打开详情弹窗
    handleDetail(row) {
      const fn = this.currentTab == '0' ? getDetail : getCancelDetail
      fn(row.id).then(({ data }) => {
        let newData = [],
          template = {
            regionIndexCode: "区域编号",
            cardNo: "卡号",
            categoryCode: "车辆分类标识",
            categoryName: "车辆分类名称",
            personId: "车主编号",
            personName: "车主",
            plateNo: "车牌号码",
            vehicleId: "车辆编号",
            validityJson: "包期详情",
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
        this.dialogDetailVisible = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  padding: 1em;

  .vehicle-contract-information {
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
