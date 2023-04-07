<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-07 11:22:41
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-08 18:38:23
-->

<template>
  <div class="container">
    <div class="container-record">
      <el-form
        :inline="true"
        ref="queryForm"
        :model="queryParams"
        class="demo-form-inline"
      >
        <el-form-item label="出入口名称" prop="entranceName">
          <el-input
            v-model="queryParams.entranceName"
            placeholder="请选择出入口名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="车道数" prop="roadNum">
          <el-input
            v-model="queryParams.roadNum"
            placeholder="请选择车道数"
            clearable
          ></el-input>
        </el-form-item>

        <!-- <el-form-item label="创建时间：" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
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
        :row-key="rowKey"
      >
        <el-table-column type="selection" header-align="center" align="center">
        </el-table-column>
        <el-table-column
          label="出入口名称"
          prop="entranceName"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="车道数"
          prop="roadNum"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          label="创建时间"
          prop="createTime"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="updateTime"
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
      title="停车场出入口详情"
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
  getInAndOutList,
  getDetail,
} from "@/api/subsystem/parking-system/garage-management/inward-and-outward.js";
// 混入
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  data() {
    return {
      // 唯一标识
      rowKey: "parkIndexCodes",
      // 表单数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        entranceName: "", //出入口名称
        roadNum: "", //车道数
        createTime: null, //创建时间
        updateTime: null, //更新时间
      },
      dialogDetailVisible: false,
      details: [],
      // 表格数据
      tableList: [],
      interface: {
        // 获取出入口列表
        getTableList: getInAndOutList,
      },
    };
  },
  methods: {
    // 打开详情弹窗
    handleDetail(row) {
      console.log(row);
      getDetail(row.entranceIndexCode).then(({ data }) => {
        let newData = [],
          template = {
            createTime: "创建时间",
            entranceName: "出入口名称",
            // chargeRuleType: "",
            roadNum: "车道数",
            updateTime: "更新时间",
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

  .container-record {
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
