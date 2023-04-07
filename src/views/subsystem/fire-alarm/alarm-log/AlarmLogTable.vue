<!--
 * @Author: MJ
 * @Date: 2021-10-28 15:26:30
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 16:13:26
 * @Description: 
-->
<template>
  <div>
    <div class="assembly-table-title">{{ title }}</div>

    <div class="assembly-table-main">
      <!-- 查询选项 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :rules="queryFormRules"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item label="告警名称：" prop="alarmName">
          <el-select
            v-model="queryParams.alarmName"
            placeholder="请输入告警名称"
            clearable
            filterable
          >
            <el-option
              v-for="items in alarmNameList"
              :key="items.dictValue"
              :label="items.dictLabel"
              v-model="items.dictLabel"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="设备名称：" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备名称"
            clearable
            size="small"
          />
        </el-form-item>

        <el-form-item label="报警时间：" prop="times">
          <el-date-picker
            v-model="times"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :change="change()"
          >
          </el-date-picker>
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
        :height="tableHeight"
        v-loading="loading"
        :row-key="rowKey"
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="告警区域"
          align="center"
          prop="regionName"
          show-overflow-tooltip
        />
        <el-table-column
          label="告警名称"
          align="center"
          prop="eventName"
          show-overflow-tooltip
        />
        <el-table-column
          label="设备名称"
          align="center"
          prop="deviceName"
          show-overflow-tooltip
        />
        <el-table-column
          label="设备ID"
          align="center"
          prop="deviceCode"
          show-overflow-tooltip
        />
        <el-table-column
          label="回路号"
          align="center"
          prop="eventLoop"
          show-overflow-tooltip
        />
        <el-table-column
          label="告警时间"
          align="center"
          prop="triggerTime"
          show-overflow-tooltip
        />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { getAlarmLog } from "@/api/subsystem/alarm-eqpt/index.js";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  props: {
    treeNode: Object,
  },
  data() {
    return {
      rowKey: "id",
      tableHeight: 0, //表格高度
      title: "全部", //标题
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        regionId: 0,
        alarmName: "",
        deviceName: "",
        startTime: null,
        endTime: null,
      },
      times: [],
      // 检索验证
      queryFormRules: {
        alarmName: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
        deviceName: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
      alarmNameList: [],
      // 接口集合
      interface: {
        getTableList: getAlarmLog,
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
    // 字典
    this.getDicts("firealarm_alarm_type").then((response) => {
      this.alarmNameList = response.data;
    });
  },

  methods: {
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 380;
    },
    change() {
      if (this.times) {
        this.queryParams.startTime = this.times[0];
        this.queryParams.endTime = this.times[1];
      }
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        regionId: 0,
        alarmName: "",
        deviceName: "",
        startTime: null,
        endTime: null,
      };
      this.getList();
    },
    //导出
    bindingClick() {
      if (this.selectedRowKeys.length > 0) {
        this.download(
          "/firealarm/firealarm/event/export",
          {
            ids: this.selectedRowKeys,
          },
          "消防告警记录.xlsx"
        );
      } else {
        this.$message({
          message: "由于记录数据过大，请选择需要导出的数据",
          type: "warning",
        });
      }
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
}
// 内容
.assembly-table-main {
  padding: 10px;
}
/* 弹框 */
.dialog-form {
  display: flex;
  div {
    flex: 1;
    border: 1px solid #bfbfbf;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-bottom: 0;
  }
  .dialog-form-left {
    background-color: #f2f2f2;
  }
}
.dialog-form:last-child {
  border-bottom: 1px solid #bfbfbf;
}
.onstate {
  color: #95f204;
}
.unstate {
  color: #d9001b;
}
</style>
