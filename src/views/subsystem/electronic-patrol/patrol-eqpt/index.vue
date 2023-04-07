<!--
 * @Descripttion: 
 * @version: 
 * @Author: CenMingGuang
 * @LastEditors: RobertFan
 * @Date: 2021-09-15 09:49:34
 * @LastEditTime: 2022-05-31 16:13:31
-->
<template>
  <div class="app-container assembly-container">
    <el-card>
      <!-- 头部查询 -->
      <div class="query" ref="queryRef">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :rules="queryFormRules"
          inline
        >
          <el-form-item label="设备名称：" prop="deviceName">
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入设备名称"
              clearable
              @keyup.enter.native="handleQuery"
            ></el-input>
          </el-form-item>
          <el-form-item label=" " label-width="100px">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery"
              >查询</el-button
            >
            <el-button @click="resetQuery" icon="el-icon-refresh"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <div>
        <!-- 打印按钮 -->
        <el-row>
          <el-col>
            <el-button
              :disabled="false"
              @click="print"
              type="primary"
              icon="el-icon-printer"
            >
              打印
            </el-button>
          </el-col>
        </el-row>

        <div class="patrol-eqpt-table">
          <div
            class="container"
            :style="{ height: `calc(100vh - ${queryElHeight}px)` }"
          >
            <!-- 表格 -->
            <el-table
              class="table"
              :data="tableList"
              border
              :max-height="height"
            >
              <el-table-column
                align="center"
                label="设备名称"
                prop="deviceName"
              ></el-table-column>
              <el-table-column
                align="center"
                label="设备号"
                prop="deviceCode"
              ></el-table-column>
              <el-table-column
                align="center"
                label="所在区域"
                prop="regionName"
              ></el-table-column>
              <el-table-column
                align="center"
                label="描述"
                prop="deviceDesc"
              ></el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination
              class="pagination"
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getPatrolDeviceList } from "@/api/subsystem/envir-monitoring/patrol-eqpt/index.js";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  components: {},
  mixins: [TableListMixin],
  props: {},
  data() {
    return {
      // 查询区域的高度
      height: "0px",
      queryParams: {
        deviceName: "", // 设备名称
        pageNum: 1, //页码
        pageSize: 10, //每页多少条
      },
      // 表格数据
      tableList: [],
      queryElHeight: 0,
      // 检索验证
      queryFormRules: {
        deviceName: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
      
        interface: {
        // 获取表格接口
        getTableList: getPatrolDeviceList,
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
      this.queryElHeight = this.$refs.queryRef.offsetHeight + 210;
      this.height = innerHeight - this.queryElHeight + 10 + "px";
    },

    // 打印
    print() {
      printJS({
        printable: this.tableList,
        properties: [
          { field: "deviceName", displayName: "设备名称" },
          { field: "deviceCode", displayName: "设备号" },
          { field: "regionName", displayName: "所在区域" },
          { field: "deviceDesc", displayName: "描述" },
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
.patrol-eqpt-table {
  margin-top: 1.5em;
}
.pagination {
  margin-top: 5px;
}
</style>
