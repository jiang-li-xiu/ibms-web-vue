<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-06-09 14:23:48
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-06-15 18:18:01
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="40%"
    center
    append-to-body
    @close="reset"
  >
    <el-form ref="alarmDataList" :model="alarmDataList" label-width="80px">
      <el-form-item label="处理人">
        <el-input v-model="alarmDataList.handleBy" disabled></el-input>
      </el-form-item>
      <el-form-item label="处理时间">
        <el-input v-model="alarmDataList.handleTime" disabled></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="alarmDataList.handleRemarks" disabled></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="addCheckRecord" class="btn_box"
      >添加记录</el-button
    >
    <el-table :data="maintenanceList" style="width: 100%" height="250">
      <el-table-column prop="recordTime" label="处理时间"> </el-table-column>
      <el-table-column prop="recordName" label="记录名称"> </el-table-column>
      <el-table-column align="center" label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="primary" @click="checkRecord(scope.row)"
            >查看</el-button
          >
          <!-- <div style="display: inline-block;margin: 1px;" > -->
            <el-button
              type="danger"
              v-show="permiStatus == 3"
              v-hasPermi="['device:devicebreakdown:remove']"
              @click="deleteRecord(scope.row.recordId)"
              >删除</el-button
            >
          <!-- </div> -->
          <!-- <div style="display: inline-block;margin: 1px;" v-show="permiStatus == 1 || permiStatus == 2"> -->
            <el-button
              type="danger"
              v-show="permiStatus != 3"
              @click="deleteRecord(scope.row.recordId)"
              >删除</el-button
            >
          <!-- </div> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="recordList.pageNum"
      :limit.sync="recordList.pageSize"
      @pagination="checkPage"
    />
    <el-dialog
      :title="titleRecord"
      :visible.sync="dialogRecord"
      append-to-body
      width="30%"
      @close="closeDialog"
    >
      <el-form
        ref="recordListData"
        :model="recordListData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="记录名称" prop="recordName">
          <el-input
            v-model="recordListData.recordName"
            :readonly="readonly"
            :rules="rules.recordName"
          ></el-input>
        </el-form-item>
        <el-form-item label="记录内容" prop="recordContent">
          <el-input
            type="textarea"
            v-model="recordListData.recordContent"
            :readonly="readonly"
            :rules="rules.recordContent"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRecord = false">取消</el-button>
        <el-button type="primary" @click="submitRecord">确定</el-button>
      </span>
    </el-dialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getDetailList,
  getMaintenanceList,
  getRecordList,
  getRecordData,
  getRecordDataEdit,
  getRecordDataDelete,
} from "@/api/device/deviceBreakdown.js";
export default {
  name: "AlarmDetail",
  components: {},
  props: {},
  data() {
    return {
      // 弹出层标题
      title: "",
      total: 0,
      titleRecord: "",
      readonly: false, // 输入框只读
      dialogVisible: false,
      dialogRecord: false,
      permiStatus: "", // 获取当前状态
      alarmDataList: {}, // 弹出框处理信息数据
      maintenanceList: [], // 维修记录弹出框数据
      recordListData: {},
      recordList: {
        pageNum: 1,
        pageSize: 10,
        recordName: "",
        recordContent: "",
        faultId: "",
        recordId: "",
      }, // 维修记录详情
      form: {
        status: null,
      },
      rules: {
        recordName: [
          { required: true, message: "请输入记录名称", trigger: "blur" },
        ],
        recordContent: [
          { required: true, message: "请填写记录内容", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    edit(data) {
      this.reset();
      this.dialogVisible = true;
      this.permiStatus = data.status;
      getDetailList(data.faultId).then((res) => {
        this.alarmDataList = res.data;
        this.recordList.faultId = this.alarmDataList.faultId;
        getMaintenanceList(this.recordList).then((res) => {
          this.maintenanceList = res.rows;
          this.total = res.total;
        });
      });
    },
    deleteRecord(recordId) {
      getRecordDataDelete(recordId).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.recordList.faultId = this.alarmDataList.faultId;
          getMaintenanceList(this.recordList).then((res) => {
            this.maintenanceList = res.rows;
            this.total = res.total;
          });
        }
      });
    },
    checkRecord(row) {
      this.titleRecord = "维修记录信息";
      this.readonly = true;
      this.resetForm("recordListData");
      this.recordListData = {
        recordName: "",
        recordContent: "",
      };
      let id = row.recordId;
      this.dialogRecord = true;
      getRecordList({ recordId: id }).then((res) => {
        this.recordListData = res.data;
      });
    },
    addCheckRecord() {
      this.titleRecord = "添加维修记录信息";
      this.readonly = false;
      this.resetForm("recordListData");
      this.recordListData = {
        recordName: "",
        recordContent: "",
        recordId: "",
        faultId: this.alarmDataList.faultId,
      };
      this.dialogRecord = true;
    },
    submitRecord() {
      if (this.titleRecord == "添加维修记录信息") {
        let data = {
          faultId: this.alarmDataList.faultId,
          recordName: this.recordListData.recordName,
          recordContent: this.recordListData.recordContent,
        };
        this.$refs.recordListData.validate((valid) => {
          if (valid) {
            getRecordData(data).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                this.dialogRecord = false;
                this.recordList.faultId = this.alarmDataList.faultId;
                getMaintenanceList(this.recordList).then((res) => {
                  this.maintenanceList = res.rows;
                  this.total = res.total;
                });
              }
            });
          } else {
            this.$message({
              message: "请完善信息",
              type: "warning",
            });
          }
        });
      } else if (this.titleRecord == "维修记录信息") {
        this.dialogRecord = false;
      }
    },
    closeDialog() {
      this.resetForm("recordListData");
      this.recordListData = {
        recordName: "",
        recordContent: "",
        faultId: this.alarmDataList.faultId,
        recordId: "",
      };
    },
    closeDialogAdd() {
      this.dialogMaintenance = false;
      this.disabledAdd = false;
    },
    checkPage() {
      this.recordList.faultId = this.alarmDataList.faultId;
      getMaintenanceList(this.recordList).then((res) => {
        this.maintenanceList = res.rows;
        this.total = res.total;
      });
    },
    saveFormData() {
      let data = this.alarmDataList;
      data.status = this.form.status;
      console.log("data", data);
      getRecordDataEdit(data).then((res) => {
        console.log("res", res);
        if (res.code == 200) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
        }
      });
      this.dialogVisible = false;
      this.$emit("ok");
    },
    reset() {
      this.alarmDataList = {
        alarmLevel: "",
        alarmName: "",
        alarmTime: "",
        deviceName: "",
        deviceTypeName: "",
        faultId: "",
        handleBy: "",
        handleRemarks: "",
        regionName: "",
        remarks: "",
        status: "",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
/* 弹窗（start） */
.properties_panel_box_left {
  display: flex;
}
.properties_panel_box {
  width: 400px;
  margin: 0 auto;
}

.properties_panel_item {
  display: flex;
  border-bottom: 1px solid #999;
  margin: 0 1vw;
}

.properties_panel_item:nth-child(2) {
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

.select_data {
  margin-top: 3vh;
}

.properties_panel_item_box {
  display: flex;
  border-bottom: 1px solid #999;
  margin: 0 1vw;
}

// .properties_panel_item_box:nth-child(1) {
//   border-top: 1px solid #999;
// }

.properties_panel_item_box > div {
  border-left: 1px solid #999;
  text-align: center;
  padding: 1vh 0;
}

.properties_panel_item_box > div:nth-child(1) {
  width: 30%;
}

.properties_panel_item_box > div:nth-child(2) {
  width: 40%;
}

.properties_panel_item_box > div:nth-child(3) {
  width: 30%;
  border-right: 1px solid #999;
}

.btn_box {
  margin-bottom: 5px;
}
</style>
