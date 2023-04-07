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

      <el-form-item label="告警名称" prop="alarmName">
        <el-input
          v-model="queryParams.alarmName"
          placeholder="请输入告警名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="告警等级" prop="alarmLevel">
        <el-select
          v-model="queryParams.alarmLevel"
          placeholder="请选择告警等级"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in alarmLevelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="处理状态" prop="arrangeStatus">
        <el-select
          v-model="queryParams.arrangeStatus"
          placeholder="请选择处理状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in arrangeStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
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
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置
        </el-button>
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
          v-hasPermi="['system:history:export']"
          >导出
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      :row-key="rowKey"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="告警名称" align="center" prop="alarmName" />
      <el-table-column
        label="告警等级"
        align="center"
        prop="alarmLevel"
        :formatter="alarmLevelFormat"
      >
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.alarmLevel === '3'">提醒</el-tag>
          <el-tag type="warning" v-if="scope.row.alarmLevel === '2'">警告</el-tag>
          <el-tag type="danger" v-if="scope.row.alarmLevel === '1'">严重</el-tag>

          <!-- <span v-if="scope.row.alarmLevel == '3'">提醒</span>
          <span v-if="scope.row.alarmLevel == '2'">警告</span>
          <span v-if="scope.row.alarmLevel == '1'">严重</span> -->
        </template>
      </el-table-column>
      <el-table-column label="告警区域" align="center" prop="regionName" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column
        label="发生时间"
        align="center"
        prop="alarmTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.alarmTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="处理状态"
        align="center"
        prop="arrangeStatus"
        :formatter="arrangeStatusFormat"
      >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.arrangeStatus == '0'">已处理</el-tag>
          <el-tag type="danger" v-if="scope.row.arrangeStatus == '1'">未处理</el-tag>
          <el-tag type="success" v-if="scope.row.arrangeStatus == '2'">已忽略</el-tag>

          <!-- <span v-if="scope.row.arrangeStatus == '0'">已处理</span>
          <span v-if="scope.row.arrangeStatus == '1'">未处理</span>
          <span v-if="scope.row.arrangeStatus == '2'">已忽略</span> -->
        </template>
      </el-table-column>

      <!-- <el-table-column label="记录id" align="center" prop="alarmHistoryId" v-if="false" /> -->

      <!-- <el-table-column label="告警id" align="center" prop="alarmId" v-if="false" /> -->

      <!-- <el-table-column label="备注" align="center" prop="remarks" /> -->
      <!--      <el-table-column label="删除位" align="center" prop="deleted" />-->
      <!-- 事件确认状态 -->
      <el-table-column label="确认状态" align="center" prop="confirmStatus">
        <template slot-scope="scope">
          <span>
            <el-tag type="waring" v-if="scope.row.confirmStatus == false">未确认</el-tag>
            <el-tag v-else type="success">已确认</el-tag>
          </span>
        </template>
      </el-table-column>
      
      <!-- 操作 -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-show="queryParams.arrangeStatus == 1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="ignore(scope.row)"
            >忽略
          </el-button>

          <el-button
            v-show="queryParams.arrangeStatus == 1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDeal(scope.row)"
            >处理
          </el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            v-hasPermi="['system:history:edit']"
            >查看详情
          </el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="changeStatus(scope.row)"
            >{{scope.row.confirmStatus ?'取消确认':'确认'}}
          </el-button>
          <!--
                <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="handleDelete(scope.row)"
                      v-hasPermi="['system:history:remove']"
                    >删除
                    </el-button>
          -->
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

    <!-- 添加或修改告警记录对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备id" prop="deviceId">
          <el-select v-model="form.deviceId" placeholder="请输入设备id">
            <el-option
              v-for="(item, index) in arrangeDevice"
              :key="index"
              :label="item.device_id + ':' + item.device_name"
              :value="item.device_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="alarmName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="告警id" prop="alarmId">
          <el-select v-model="form.alarmId" placeholder="请输入设备id">
            <el-option
              v-for="(item, index) in alarminfoOptions"
              :key="index"
              :label="item.alarm_id + ':' + item.alarm_name"
              :value="item.alarm_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="告警名称" prop="alarmName">
          <el-input v-model="form.alarmName" placeholder="请输入告警名称" />
        </el-form-item>
        <el-form-item label="告警等级" prop="alarmLevel">
          <el-select v-model="form.alarmLevel" placeholder="请选择告警等级">
            <el-option
              v-for="dict in alarmLevelOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态" prop="arrangeStatus">
          <el-select v-model="form.arrangeStatus" placeholder="请选择处理状态">
            <el-option
              v-for="dict in arrangeStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警时间" prop="alarmTime">
          <el-date-picker
            clearable
            size="small"
            v-model="form.alarmTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择告警时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="form.remarks"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->

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
            placeholder="请选择处理方式"
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
  getAlarmRecordList,
  getAlarmRecordDetail,
  delHistory,
  addHistory,
  updateHistory,
  deiceList,
  alarminofList,
  processingHistory,
  editConfirmStatus
} from "@/api/common-config/event-manage/alarm";
import {
  listPlan,
  postHistoryProcessing,
} from "@/api/common-config/event-manage/plan";
import { TableListMixin } from "@/mixins/TableListMixin";

export default {
  mixins:[TableListMixin],
  name: "History",
  components: {},
  data() {
    return {
      rowKey: "alarmHistoryId",
      activeName: "1",
      isStarted: false,
      detailsData: [],
      isDialogDetail: false,
      // 选中数组
      selectedRowKeys: [],
      // 告警记录表格数据
      tableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 告警等级字典
      alarmLevelOptions: [],
      //报警信息
      alarminfoOptions: [],
      // 时间
      queryDateArray: [],
      // 处理状态字典
      arrangeStatusOptions: [],
      //设备信息
      arrangeDevice: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        alarmHistoryId: null,
        deviceId: null,
        alarmId: null,
        alarmName: null,
        deviceName: null,
        alarmLevel: null,
        arrangeStatus: "1",
        alarmTime: null,
        remarks: null,
        deleted: null,
        startTime: null,
        endTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        processingMethod: [
          { required: true, message: "处理方式不能为空", trigger: "blur" },
        ],
      },
      processingRecord: {
        processingRecordId: null,
        processingType: null,
        processingRen: null,
        processingMethod: null,
        alarmHistoryId: null,
        remark: null,
      },
      planList: null,
      planQuery: {
        planStarts: null,
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
      interface:{
        getTableList: getAlarmRecordList
      }
    };
  },
  created() {
    this.getDicts("manager_level").then((response) => {
      this.alarmLevelOptions = response.data;
    });
    this.getDicts("arrange_status").then((response) => {
      this.arrangeStatusOptions = response.data;
    });
    // this.handleAlarminofList();
    // this.handleDevice();
    // this.handleClick();
  },
  mounted(){
    this.getList();
  },
  computed: {
    //计算事件类型
    arrangeStatusComputed() {
      return function (type) {
        for (var i = 0; i < this.arrangeStatusOptions.length; i++) {
          if (this.arrangeStatusOptions[i].dictValue === type) {
            return this.arrangeStatusOptions[i].dictLabel;
          }
        }
        return type;
      };
    },
    alarmLevelComputed() {
      return function (type) {
        for (var i = 0; i < this.alarmLevelOptions.length; i++) {
          if (this.alarmLevelOptions[i].dictValue === type) {
            return this.alarmLevelOptions[i].dictLabel;
          }
        }
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
      console.log(row);
      this.$confirm("是否确认忽略", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          postHistoryProcessing(row.alarmHistoryId)
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

    /** 处理告警记录*/
    submitRecord() {
      console.log(this.processingRecord);
      processingHistory(
        this.processingRecord,
        this.processingRecord.alarmHistoryId
      ).then((response) => {
        this.getList();
      });
      this.isStarted = !this.isStarted;
      this.processingRecord = {
        processingRecordId: null,
        processingType: null,
        processingRen: null,
        processingMethod: null,
        alarmHistoryId: null,
        remark: null,
      };
    },
    /** 查询处理状态告警记录*/
    handleClick(tab, event) {
      if (this.activeName == "1") {
        this.queryParams.arrangeStatus = 1;
        this.planQuery.planStarts = 1;
      } else if (this.activeName == 0) {
        this.queryParams.arrangeStatus = 0;
        this.planQuery.planStarts = 1;
      } else if (this.activeName == 2) {
        this.queryParams.arrangeStatus = 2;
        this.planQuery.planStarts = 1;
      }
      this.getList();
    },
    /* 弹出框 */
    handleDeal(row) {
      this.isStarted = true;
      this.processingRecord.alarmHistoryId = row.alarmHistoryId;
      this.processingRecord.processingType = 1;
      listPlan(this.planQuery).then((response) => {
        this.planList = response.rows;
      });
    },
    cancelRecord() {
      this.isStarted = false;
    },
    // 告警等级字典翻译
    alarmLevelFormat(row, column) {
      return this.selectDictLabel(this.alarmLevelOptions, row.alarmLevel);
    },
    // 处理状态字典翻译
    arrangeStatusFormat(row, column, cellValue) {
      return this.selectDictLabel(this.arrangeStatusOptions, row.arrangeStatus);
    },
    // 取消按钮
    // cancel() {
    //   this.open = false;
    //   this.reset();
    // },
    // 表单重置
    reset() {
      this.form = {
        alarmHistoryId: null,
        deviceId: null,
        alarmId: null,
        alarmName: null,
        alarmLevel: null,
        arrangeStatus: null,
        alarmTime: null,
        remarks: null,
        deleted: null,
      };
      this.resetForm("form");
    },
    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   console.log(selection);
    //   this.ids = selection.map((item) => item.alarmHistoryId);
    //   console.log(ids);
    //   this.single = selection.length !== 1;
    //   this.multiple = !selection.length;
    // },

    /** 删除按钮操作 */
    handleDelete(row) {
      const alarmHistoryIds = row.alarmHistoryId || this.selectedRowKeys;
      this.$confirm(
        '是否确认删除告警记录编号为"' + alarmHistoryIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delHistory(alarmHistoryIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /**详情按钮*/
    handleDetail(row) {
      this.reset();
      getAlarmRecordDetail(row.alarmHistoryId).then((response) => {
        this.form = response.data;
        let templateDesc = {
            alarmName: "告警名称",
            deviceName: "设备名称",
            alarmLevel: "告警等级",
            arrangeStatus: "处理状态",
            alarmTime: "告警时间",
            remarks: "备注",
          },
          newData = [],
          i = 1;
        for (const key in templateDesc) {
          if (Object.hasOwnProperty.call(templateDesc, key)) {
            let value = row[key];
            if (key === "arrangeStatus") {
              value = this.arrangeStatusComputed(row[key]);
            } else if (key === "alarmLevel") {
              value = this.alarmLevelComputed(row[key]);
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
    changeStatus(row){
      console.log(row);
      if (row.confirmStatus == false) {
        this.$confirm("是否修改为确认状态?", '提醒',{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "success",
        }).then(()=>{
          let data = {
            alarmHistoryId:row.alarmHistoryId,
            confirmStatus:true,
          }
          editConfirmStatus(data).then((res)=>{
            this.$message.success("状态修改成功")
            this.getList()
          })
        });
      }else{
        this.$confirm("是否修改为未确认状态?",'提醒', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(()=>{
          let data = {
            alarmHistoryId:row.alarmHistoryId,
            confirmStatus:false,
          }
          editConfirmStatus(data).then((res)=>{
            this.$message.success("状态修改成功")
            this.getList()
          })
        });
      }
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "event/history/export",
        {
          selectedRowKeys: this.selectedRowKeys,
        },
        `告警记录导出.xlsx`
      );
    },
    /** 请求设备信息*/
    handleDevice() {
      deiceList().then((response) => {
        this.arrangeDevice = response;
      });
    },
    /** 请求报警信息*/
    handleAlarminofList() {
      alarminofList().then((response) => {
        this.alarminfoOptions = response;
      });
    },

    /**
     * 匹配id，显示设备名称
     * */
    handleMatchIdAndName(selectedRowKeys) {
      if (this.arrangeDevice.concat(selectedRowKeys)) {
        for (let item in this.arrangeDevice) {
          console.log(item.device_id + ":" + item.device_name);

          if (item.device_id === selectedRowKeys) {
            return item.device_name;
          }
        }
      }
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
  // margin-top: 20px;
  // margin-left: auto;
  // margin-right: auto;
  // padding: 10px 20px;
  background-color: #fff;
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
