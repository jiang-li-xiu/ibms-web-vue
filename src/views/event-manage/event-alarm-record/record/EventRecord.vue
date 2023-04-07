<template>
  <div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="未处理" name="1"></el-tab-pane>
        <el-tab-pane label="已处理" name="0"></el-tab-pane>
        <el-tab-pane label="已忽略" name="2"></el-tab-pane>
      </el-tabs>

      <!-- <el-form-item label="设备代码" prop="deviceCode">
        <el-input
          v-model="queryParams.deviceCode"
          placeholder="请输入设备代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="事件名称" prop="eventName">
        <el-input
          v-model="queryParams.eventName"
          placeholder="请输入事件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="事件等级" prop="eventGrade">
        <el-select
          v-model="queryParams.eventGrade"
          placeholder="请选择事件等级"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in eventLevel"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="触发时间" prop="triggerTime">
        <el-date-picker
          v-model="queryDateArray"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          align="right"
          @change="changeQueryTime"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['event:event:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" align="center" />
      <!--      <el-table-column label="主键" align="center" prop="id" v-show="false"/>-->
      <el-table-column label="事件名称" align="center" prop="eventName" />
      <el-table-column label="事件级别" align="center" prop="eventGrade">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.eventGrade == 3">提醒</el-tag>
          <el-tag type="warning" v-if="scope.row.eventGrade == 2">警告</el-tag>
          <el-tag type="danger" v-if="scope.row.eventGrade == 1">严重</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="事件类型" align="center" prop="eventType">
        <template slot-scope="scope">
          <span>{{ eventTypeNameComputed(scope.row.eventType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="插件服务名称" align="center" prop="serviceName" />
      <!-- <el-table-column label="设备代码" align="center" prop="deviceCode" /> -->
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column
        label="发生时间"
        align="center"
        prop="triggerTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>
            {{ parseTime(scope.row.triggerTime, "{y}-{m}-{d} {h}:{i}:{s}") }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="处理状态" align="center" prop="mode">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.mode == '0'">已处理</span>
          <span v-if="scope.row.mode == '1'">未处理</span>
          <span v-if="scope.row.mode == '2'">已忽略</span> -->
          <el-tag type="success" v-if="scope.row.mode == '0'">已处理</el-tag>
          <el-tag type="danger" v-if="scope.row.mode == '1'">未处理</el-tag>
          <el-tag type="success" v-if="scope.row.mode == '2'">已忽略</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="数据"
        align="center"
        prop="recordData"
        v-if="false"
      />
      <el-table-column
        label="事件描述"
        align="center"
        prop="remark"
        v-if="false"
      />

      <!-- 事件确认状态 -->
      <el-table-column label="确认状态" align="center" prop="confirmStatus">
        <template slot-scope="scope">
          <span>
            <el-tag type="waring" v-if="scope.row.confirmStatus == false"
              >未确认</el-tag
            >
            <el-tag v-else type="success">已确认</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="queryParams.mode == 1"
            type="text"
            icon="el-icon-edit"
            @click="ignore(scope.row)"
            >忽略</el-button
          >

          <el-button
            size="mini"
            v-if="queryParams.mode == 1"
            type="text"
            icon="el-icon-edit"
            @click="handleDeal(scope.row)"
            >处理</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            v-hasPermi="['event:event:edit']"
            >查看详情</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="changeStatus(scope.row)"
            >{{ scope.row.confirmStatus ? "取消确认" : "确认" }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!--  查看详情   -->
    <div>
      <el-dialog :title="title" :visible.sync="isDialogDetail" width="400px">
        <div class="properties_panel_box">
          <div
            class="properties_panel_item"
            v-for="item in detailsData"
            :key="item.id"
          >
            <div v-text="item.title"></div>
            <div>{{ item.value }}</div>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- 处理告警框 -->
    <el-dialog
      :title="title"
      :visible.sync="isStarted"
      width="500px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="processingRecord"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="处理人" prop="processingRen">
          <el-input
            v-model="processingRecord.processingRen"
            placeholder="请输入处理人"
          />
        </el-form-item>
        <el-form-item label="处理方式" prop="processingMethod" required>
          <el-select
            v-model="processingRecord.processingMethod"
            placeholder="请输入处理方式"
          >
            <el-option
              v-for="(item, index) in planList"
              :key="index"
              :label="item.planName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="processingRecord.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRecord">保存</el-button>
        <el-button @click="cancelRecord">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEventList,
  getEventDetail,
  delEvent,
  addEvent,
  editEvent,
  processEvent,
  ignoreEvent,
  editConfirmStatus,
} from "@/api/common-config/event-manage/event";
import { listPlan } from "@/api/common-config/event-manage/plan";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  name: "Event",
  components: {},
  data() {
    return {
      rowKey: "id",
      isStarted: false,
      activeName: "1",
      // 事件类型
      eventType: [],
      //事件等级
      eventLevel: [],
      // 处理级别
      alarmLevel: [],
      // 事件类型字典
      allPlugEvent: [],

      // 设置表单是否禁用
      isDisabled: false,
      // 选中数组
      selectedRowKeys: [],
      dialogTableVisible: false,
      // 事件记录表格数据
      tableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      // open: false,
      // 时间
      queryDateArray: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serviceName: null,
        deviceCode: null,
        eventName: null,
        eventGrade: null,
        eventType: null,
        triggerTime: null,
        recordData: null,
        mode: 1,
        deleted: null,
        version: null,
        startTime: "",
        endTime: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        processingMethod: [
          { required: true, message: "处理方式不能为空", trigger: "blur" },
        ],
      },
      detailsData: [],
      isDialogDetail: false,
      processingRecord: {
        eventRecordId: null,
        processingRecordId: null,
        processingType: null,
        processingRen: null,
        processingMethod: null,
        alarmHistoryId: null,
        remark: null,
      },
      planList: null,
      planQuery: {
        planStarts: 0, // 可用的预案
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      interface: {
        getTableList: getEventList,
      },
    };
  },
  created() {
    this.getDicts("manager_level").then((response) => {
      this.eventLevel = response.data;
      console.log(this.eventLevel);
    });
    this.getDicts("arrange_status").then((response) => {
      this.alarmLevel = response.data;
    });
    this.getDicts("plug_service_event_type").then((response) => {
      console.log("获取插件事件：", response.data);
      this.allPlugEvent = response.data;
    });

    // this.handleClick();
  },
  mounted() {
    this.getList();
  },
  computed: {
    //计算事件类型
    eventTypeNameComputed() {
      return function (type) {
        for (let i = 0; i < this.allPlugEvent.length; i++)
          if (this.allPlugEvent[i].dictValue == type)
            return this.allPlugEvent[i].dictLabel;
        return type;
      };
    },
    eventGradeComputed() {
      return function (type) {
        for (let i = 0; i < this.eventLevel.length; i++)
          if (this.eventLevel[i].dictValue === type)
            return this.eventLevel[i].dictLabel;
        return type;
      };
    },
  },
  methods: {
    changeQueryTime() {
      this.queryParams.startTime = this.queryDateArray[0];
      this.queryParams.endTime = this.queryDateArray[1];
    },

    // 忽略
    ignore(row) {
      this.$confirm("是否确认忽略", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ignoreEvent(row.id)
            .then((response) => {
              this.$message({
                message: "请求成功",
                type: "success",
              });

              this.getList();
            })
            .catch((err) => {
              // this.$message.error("请求失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    /** 处理事件记录*/
    submitRecord() {
      processEvent(
        this.processingRecord,
        this.processingRecord.eventRecordId
      ).then((response) => {
        this.getList();
      });
      this.isStarted = false;
      this.processingRecord = {
        processingRecordId: null,
        processingType: null,
        processingRen: null,
        processingMethod: null,
        alarmHistoryId: null,
        remark: null,
      };
    },
    /* 弹出框 */
    handleDeal(row) {
      this.isStarted = true;
      this.processingRecord.eventRecordId = row.id;
      this.processingRecord.processingType = 1;
      listPlan(this.planQuery).then((response) => {
        this.planList = response.rows;
      });
    },
    handleClick(tab, event) {
      if (this.activeName == 1) {
        this.queryParams.mode = 1;
      } else if (this.activeName == 0) {
        this.queryParams.mode = 0;
      } else if (this.activeName == 2) {
        this.queryParams.mode = 2;
      }
      this.getList();
    },

    cancelRecord() {
      this.isStarted = !this.isStarted;
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        serviceName: null,
        deviceCode: null,
        eventName: null,
        eventType: null,
        eventGrade: null,
        triggerTime: null,
        recordData: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleted: null,
        version: null,
      };
      this.resetForm("form");
    },

    /**详情按钮*/
    handleDetail(row) {
      this.reset();
      const id = row.id || this.selectedRowKeys;
      this.title = "事件记录：";
      getEventDetail(id).then((response) => {
        this.form = response.data;
        let templateDesc = {
            serviceName: "插件名称",
            deviceCode: "设备代码",
            eventName: "事件名称",
            eventType: "事件类型",
            eventGrade: "事件等级",
            triggerTime: "触发时间",
            recordData: "数据",
            remark: "事件描述",
          },
          newData = [],
          i = 1;
        for (const key in templateDesc) {
          if (Object.hasOwnProperty.call(templateDesc, key)) {
            let value = row[key];
            if (key === "eventType") {
              value = this.eventTypeNameComputed(row[key]);
            } else if (key === "eventGrade") {
              value = this.eventGradeComputed(row[key]);
              console.log(this.eventLevel);
            }
            newData.push({
              id: (i += 1),
              title: templateDesc[key],
              value: value,
            });
          }
        }

        this.detailsData = newData;
        this.isDialogDetail = true;
      });
    },
    changeStatus(row) {
      console.log(row);
      if (row.confirmStatus == false) {
        this.$confirm("是否修改为确认状态?", "提醒", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "success",
        }).then(() => {
          let data = {
            id: row.id,
            confirmStatus: true,
          };
          editConfirmStatus(data).then((res) => {
            console.log(res);
            this.$message.success("状态修改成功");
            this.getList();
          });
        });
      } else {
        this.$confirm("是否修改为未确认状态?", "提醒", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let data = {
            id: row.id,
            confirmStatus: false,
          };
          editConfirmStatus(data).then((res) => {
            console.log(res);
            this.$message.success("状态修改成功");
            this.getList();
          });
        });
      }
    },
    
    /** 删除按钮操作 */
    handleDelete(row) {
      const selectedRowKeys = row.id || this.selectedRowKeys;
      this.$confirm(
        '是否确认删除事件记录编号为"' + selectedRowKeys + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delEvent(selectedRowKeys);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "event/event/export",
        { selectedRowKeys: this.selectedRowKeys },
        "事件记录.xlsx"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.detail_box {
  border: 1px solid #999;
}

.detail_item {
  border-bottom: 1px solid #999;
}

.detail_item:last-child {
  border-bottom: 0;
}

.detail_item > span {
  display: inline-block;
  width: 50%;
  padding: 1.5vh 0;
  text-align: center;
}

.detail_item > span:first-child {
  background-color: #ddd;
  border-right: 1px solid #999;
}

.table_is_status_00ff00::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #00ff00;
  display: inline-block;
  margin-right: 5px;
}

.table_is_status_ff0000::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ff0000;
  display: inline-block;
  margin-right: 5px;
}

.icon_box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container_details_box {
  width: 99%;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  padding: 10px 20px;
  box-sizing: border-box;
}

.margin_left_10 {
  margin-left: 10px;
}

.margin_top_1 {
  margin-top: 1vh;
}

.margin_top_2 {
  margin-top: 2vh;
}

.cursor_pointer {
  cursor: pointer;
}

.color_blue {
  color: #0000ff;
}

/* 弹窗（start） */
.properties_panel_box {
  margin: 0 auto;
}

.properties_panel_item {
  display: flex;
  border-bottom: 1px solid #999;
}

.properties_panel_item:first-child {
  border-top: 1px solid #999;
}

.properties_panel_item > div {
  border-left: 1px solid #999;
  text-align: center;
  padding: 1vh 0;
}

.properties_panel_item > div:first-child {
  width: 50%;
  background-color: #eee;
}

.properties_panel_item > div:last-child {
  width: 50%;
  border-right: 1px solid #999;
}

/* 弹窗（end） */

.setting_btn {
  color: #0000ff;
  padding: 2px 10px;
  margin: 0 6px;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
