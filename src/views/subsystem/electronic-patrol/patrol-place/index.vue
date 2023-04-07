<!--
 * @Descripttion: 
 * @version: 
 * @Author: CenMingGuang
 * @LastEditors: RobertFan
 * @Date: 2021-09-15 11:06:53
 * @LastEditTime: 2022-05-31 16:12:21
-->
<template>
  <div class="main-box">
    <el-card class="min-height-124">
      <!-- 头部查询 -->
      <el-form :model="queryParams" ref="queryForm" :rules="queryFormRules" inline v-show="showSearch">

        <el-form-item label="地点名称" prop="positionName">
          <el-input v-model="queryParams.positionName" placeholder="请输入地点名称" clearable
            @keyup.enter.native="handleQuery"></el-input>
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 打印按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button :disabled="false" @click="print" icon="el-icon-printer">
            打印
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableList" border :height="830">
        <el-table-column align="center" label="地点名称" prop="positionName"></el-table-column>
        <el-table-column align="center" label="在线状态" prop="patrolStatus">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.patrolStatus == 1">启用</el-tag>
            <el-tag type="danger" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="地点图片" prop="image">
          <template slot-scope="scope">
            <el-image style="width: 50px; height: 50px" :src="scope.row.image" :preview-src-list="[...scope.row.image]">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页 -->
      <pagination class="pagination" v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script>
import { getPatrolPositionList } from "@/api/subsystem/envir-monitoring/patrol-eqpt/index.js";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  components: {
  },
  mixins: [TableListMixin],
  data() {
    return {
      // 查询区域的高度
      height: "0px",
      queryElHeight: 0,
      queryParams: {
        positionName: "",
        pageNum: 1,
        pageSize: 10,
      },
      // 检索验证
      queryFormRules: {
        positionName: [
          // {
          //   validator: this.validateQueryFormRules,
          //   trigger: ["blur", "change"],
          // },
        ],
      },
      interface: {
        // 获取表格接口
        getTableList: getPatrolPositionList,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableElHeight();
    });
    // 监听查询区域的高度
    window.addEventListener("resize", this.getTableElHeight);
    this.getList();
  },
  beforeDestroy() {
    // 取消监听
    window.removeEventListener("resize", this.getTableElHeight);
  },
  methods: {
    getTableElHeight() {
      const innerHeight = window.innerHeight;
      this.queryElHeight = this.$refs.queryRef.offsetHeight + 205;
      this.height = innerHeight - this.queryElHeight + 10 + "px";
    },

    // 打印
    print() {
      printJS({
        printable: this.tableList,
        properties: [
          { field: "positionName", displayName: "地点名称" },
          { field: "positionDept", displayName: "所在部门" },
          { field: "longitude", displayName: "经度" },
          { field: "latitude", displayName: "纬度" },
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
  },
};
</script>

<style lang="scss" scoped>
.assembly-container {
  height: calc(100vh - 84px);
  background-color: #eee;
}
</style>
