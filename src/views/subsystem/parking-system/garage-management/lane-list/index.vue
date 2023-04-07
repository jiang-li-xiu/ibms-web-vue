<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-07 11:22:41
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-10 10:09:03
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
        <el-form-item label="车道名称" prop="roadwayName">
          <el-input
            v-model="queryParams.roadwayName"
            placeholder="请输入车道名称"
            clearable
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="车道类型" prop="roadwayType">
          <el-select
            v-model="queryParams.roadwayType"
            placeholder="请选择车道类型"
            clearable
          >
            <el-option
              v-for="item in roadWayList"
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
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
        :row-key="rowKey"
      >
        <el-table-column type="selection" header-align="center" align="center">
        </el-table-column>
        <el-table-column
          label="车道名称"
          prop="roadwayName"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="车道类型"
          prop="roadwayType"
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
      title="车道信息详情"
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
  getRoadWayList,
  getDetail,
} from "@/api/subsystem/parking-system/garage-management/lane-list.js";
// 混入
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  data() {
    return {
      // 唯一标识
      rowKey: "roadwayIndexCode",
      // 表单数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roadwayName: "", //车道名称
        roadwayType: "", //车道类型
        // createTime: null, //创建时间
        // updateTime: null, //更新时间
      },
      // 表格数据
      tableList: [],
      dialogDetailVisible: false,
      details: [],
      // 车道类型
      roadWayList: [],
      interface: {
        // 获取车道列表
        getTableList: getRoadWayList,
      },
    };
  },
  created() {
    // 获取车道类型字典
    this.getDicts("road_way_type").then((res) => {
      this.roadWayList = res.data;
    });
  },
  methods: {
    // 打开详情弹窗
    handleDetail(row) {
      console.log(row);
      getDetail(row.roadwayIndexCode).then(({ data }) => {
        let newData = [],
          template = {
            roadwayName: "车道名称",
            roadwayType: "车道类型",
            createTime: "创建时间",
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
