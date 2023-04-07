<template>
  <div class="app-container assembly-container">
    <el-card class="card-container">
      <!-- 查询 -->
      <div class="query" ref="queryRef">
        <!-- 表单 -->
        <el-form
          label-suffix="："
          :model="queryFormParam"
          inline
          @keyup.enter.native="handleQuery"
        >
          <el-form-item label="设备名称" prop="equipmentName">
            <!-- <el-input
              v-model="queryFormParam.equipmentName"
              placeholder="请输入设备名称"
              clearable
              size="small"
              class="form-width"
            ></el-input> -->
            <el-select
              v-model="queryFormParam.equipmentName"
              placeholder="请输入设备名称"
              clearable
            >
              <el-option
                v-for="item in equipmentNames"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="告警类型" prop="alarmType">
            <!-- <el-input
              v-model="queryFormParam.alarmType"
              placeholder="请输入告警类型"
              clearable
              size="small"
              class="form-width"
            ></el-input> -->
            <el-select
              v-model="queryFormParam.alarmType"
              placeholder="请输入告警类型"
              clearable
            >
              <el-option
                v-for="item in alarmTypes"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="告警时间" prop="time">
            <el-date-picker
              v-model="queryFormParam.time"
              type="datetimerange"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >查询</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 导出 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              size="mini"
              type="warning"
              plain
              icon="el-icon-download"
              @click="exports"
              >导出</el-button
            >
          </el-col>
        </el-row>
      </div>

      <!-- 表格 -->
      <div class="table-container">
        <el-table
          :data="tableData"
          border
          :height="tableHeight"
          @selection-change="handleSelectionChange"
          class="overflow_y_scroll overflow_y_scroll_0"
        >
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column
            align="center"
            label="设备名称"
            prop="equipmentName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="设备ID"
            prop="equipmentId"
          ></el-table-column>
          <el-table-column
            align="center"
            label="设备位置"
            prop="location"
          ></el-table-column>
          <el-table-column align="center" label="告警类型" prop="alarmType">
            <template #default="scope">
              <span style="color: #b8008e">{{ scope.row.alarmType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="告警原因"
            prop="alarmReason"
          ></el-table-column>
          <el-table-column align="center" label="告警时间" prop="time"></el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <pagination
        class="pagination"
        v-show="total > 0"
        :total="total"
        :page.sync="queryFormParam.pageNum"
        :limit.sync="queryFormParam.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
import { getAlarmRecordList } from "@/api/subsystem/machine-room";
export default {
  components: {},
  data() {
    return {
      tableHeight: 0, //表格高度
      // 查询区域的高度
      queryElHeight: 84,
      // 加载
      loading: "",
      //总记录数
      total: 0,
      //table数据
      tableData: [],
      //选中id
      ids: [],
      canClick: true,
      // 多选后获取到的id
      ids: [],
      // 查询参数
      queryFormParam: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: null,
        alarmType: "",
        time: "",
      },
      alarmTypes: ["正常", "复位", "通讯正常", "无告警", "关闭", "开启"],
      equipmentNames: ["环境采集器", "UPS", "列头柜", "配电柜", "空调1", "空调2"],
    };
  },
  created() {
    this.getList();
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
  },
  mounted() {
    // 监听查询区域的高度
    this.$nextTick(() => {
      this.setQueryElHeight();
    });
    window.addEventListener("resize", this.setQueryElHeight);
  },
  beforeDestroy() {
    // 取消监听
    window.removeEventListener("resize", this.setQueryElHeight);
    // 关闭表格高度监听
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 400;
    },

    setQueryElHeight() {
      this.queryElHeight = this.$refs.queryRef.offsetHeight;
    },
    //导出
    bindingClick() {},
    /** 查询按钮操作 */
    handleQuery() {
      this.queryFormParam.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm("queryFormParam");
      (this.queryFormParam = {
        pageNum: 1,
        pageSize: 10,
        equipmentName: null,
        alarmType: "",
        time: "",
      }),
        this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
    },
    //table数据请求
    getList() {
      this.loading = true;
      getAlarmRecordList(this.queryFormParam).then((response) => {
        console.log(response.rows);
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表格多选
    handleSelectionChange(event) {
      this.ids = event.map((item) => {
        return item.id;
      });
    },
    // 导出
    exports() {
      if (!this.ids.length) {
        this.$message({
          message: "请至少选择一条数据",
          type: "warning",
        });
        return false;
      }

      if (this.canClick) {
        this.canClick = false;
        this.download(
          "/powerenv/powerenv/export",
          { ids: this.ids },
          "机房设备告警记录.xlsx"
        );
        setTimeout(() => {
          this.canClick = true;
        }, 3000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.assembly-container {
  height: calc(100vh - 84px);
  background-color: #eee;
}
.card-container {
  height: calc(100vh - 124px);
}
.query {
  // padding: 0 20px;
}
// 设置滚动条
.overflow_y_scroll {
  overflow-y: scroll;
}

// 隐藏滚动条
.overflow_y_scroll_0::-webkit-scrollbar {
  width: 0 !important;
}
</style>
