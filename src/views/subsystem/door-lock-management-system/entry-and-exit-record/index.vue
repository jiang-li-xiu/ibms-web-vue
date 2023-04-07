<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 15:57:40
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-17 11:56:49
-->
<template>
  <div class="container">
    <div class="container-record">
      <!-- 查询 -->
      <el-form
        :inline="true"
        ref="queryForm"
        :model="queryParams"
        class="demo-form-inline"
      >
        <el-form-item label="门锁名称" prop="dormitoryName">
          <el-input
            v-model="queryParams.dormitoryName"
            placeholder="请输入门锁名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="操作人员" prop="studentName">
          <el-input
            v-model="queryParams.studentName"
            placeholder="请输入操作人员"
          ></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery"
            >查询
          </el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>

        <!-- 按钮 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <!-- <el-button
              type="warning"
              icon="el-icon-download"
              @click="handleExport"
              v-hasPermi="['bigdata:scriptManager:export']"
            >
              导出
            </el-button> -->
          </el-col>
        </el-row>

        <!-- 表格 -->
        <el-table
          v-loading="loading"
          :data="tableList"
          @selection-change="handleSelectionChange"
          border
          :row-key="rowKey"
        >
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="门锁名称"
            prop="dormitoryName"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="状态"
            prop="status"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="操作人员"
            prop="studentName"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <!-- <el-table-column
            label="操作详情"
            prop="opt"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column> -->
          <!-- <el-table-column
            label="开门类型"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="state"
                >{{
                  scope.row.openType == 0
                    ? "刷卡"
                    : scope.row.openType == 1
                    ? "指纹"
                    : "密码"
                }}
              </span>
            </template>
          </el-table-column> -->
          <el-table-column
            label="更新时间"
            prop="updateTimeDate"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            width="200"
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
      </el-form>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      title="人员进出记录详情"
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
import {
  getPeopletList,
  getDetail,
} from "@/api/subsystem/door-lock-management-system/entryAndExitRecord.js";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  props: {
    treeNode: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      // 表格唯一标识
      rowKey: "id",
      // 标题
      title: "全部",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dormitoryName: "", //门锁名称
        status: "", //状态
        studentName: "", //操作人员
        opt: "", //操作详情
        updateTimeDate: null,
      },
      dialogDetailVisible: false,
      // 详情
      details: [],
      interface: {
        // 获取人员出入记录列表
        getTableList: getPeopletList,
      },
    };
  },
  methods: {
    /** 导出按钮操作 */
    handleExport() {
      this.download("/", this.queryParams, `人员出入记录.xlsx`);
    },

    // 打开详情弹窗
    handleDetail(row) {
      console.log(row);
      getDetail(row.id).then(({ data }) => {
        let newData = [],
          template = {
            dormitoryName: "门锁名称",
            status: "状态",
            studentName: "操作人员",
            opt: "操作详情",
            updateTimeDate: "更新时间",
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
  watch: {
    treeNode: {
      handler(newVal) {
        this.title = newVal.regionName;
        this.getList();
      },
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
