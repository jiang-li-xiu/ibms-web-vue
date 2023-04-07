<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-06-09 15:03:45
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-06-15 17:59:11
-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="处理人" prop="handleBy">
          <el-input v-model="form.handleBy" :rules="rules.handleBy"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="handleRemarks">
          <el-input
            type="textarea"
            v-model="form.handleRemarks"
            :rules="rules.handleRemarks"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">开始处理</el-button>
      </span>
    </el-dialog>
    <el-dialog title="完成处理" :visible.sync="dialogComplete" width="30%">
      <span>确定完成处理吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogComplete = false">取 消</el-button>
        <el-button type="primary" @click="submitComplete">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关闭处理" :visible.sync="dialogClose" width="30%">
      <span>确定关闭处理吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose = false">取 消</el-button>
        <el-button type="primary" @click="submitClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDetailList,
  getRecordDataEdit,
} from "@/api/device/deviceBreakdown.js";
export default {
  name: "DisposeDetail",
  components: {},
  props: {},
  data() {
    return {
      // 弹出层标题
      title: "",
      dialogVisible: false,
      dialogComplete: false,
      dialogClose: false,
      alarmData: [], //弹出框数据
      alarmDataList: {},
      form: {
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
      },
      rules: {
        handleBy: [
          { required: true, message: "请输入处理人", trigger: "blur" },
        ],
        handleRemarks: [
          { required: true, message: "请填写备注", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    edit(data) {
      this.resetForm("form");
      this.form = {
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
      this.dialogVisible = true;
      getDetailList(data.faultId).then((res) => {
        this.alarmDataList = res.data;
      });
    },
    complete(data) {
      this.resetForm("form");
      this.form = {
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
      getDetailList(data.faultId).then((res) => {
        this.alarmDataList = res.data;
      });
      this.dialogComplete = true;
    },
    closeDispose(data) {
      this.resetForm("form");
      this.form = {
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
      getDetailList(data.faultId).then((res) => {
        this.alarmDataList = res.data;
      });
      this.dialogClose = true;
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form = {
            alarmLevel: this.alarmDataList.alarmLevel,
            alarmName: this.alarmDataList.alarmName,
            alarmTime: this.alarmDataList.alarmTime,
            deviceName: this.alarmDataList.deviceName,
            deviceTypeName: this.alarmDataList.deviceTypeName,
            faultId: this.alarmDataList.faultId,
            handleBy: this.form.handleBy,
            handleRemarks: this.form.handleRemarks,
            regionName: this.alarmDataList.regionName,
            remarks: this.alarmDataList.remarks,
            status: "1",
          };
          getRecordDataEdit(this.form).then((res) => {
            console.log("res", res);
            if (res.code == 200) {
              this.$message({
                message: "开始处理成功",
                type: "success",
              });
              this.$emit("ok");
            }
          });
          this.dialogVisible = false;
        } else {
          this.$message({
            message: "请完善信息",
            type: "warning",
          });
        }
      });
    },
    submitComplete() {
      this.form = {
        alarmLevel: this.alarmDataList.alarmLevel,
        alarmName: this.alarmDataList.alarmName,
        alarmTime: this.alarmDataList.alarmTime,
        deviceName: this.alarmDataList.deviceName,
        deviceTypeName: this.alarmDataList.deviceTypeName,
        faultId: this.alarmDataList.faultId,
        handleBy: this.alarmDataList.handleBy,
        handleRemarks: this.alarmDataList.handleRemarks,
        regionName: this.alarmDataList.regionName,
        remarks: this.alarmDataList.remarks,
        status: "2",
      };
      console.log(this.alarmDataList);
      getRecordDataEdit(this.form).then((res) => {
        console.log("res", res);
        if (res.code == 200) {
          this.$message({
            message: "完成处理成功",
            type: "success",
          });
          this.$emit("ok");
        }
      });
      this.dialogComplete = false;
    },
    submitClose() {
      this.form = {
        alarmLevel: this.alarmDataList.alarmLevel,
        alarmName: this.alarmDataList.alarmName,
        alarmTime: this.alarmDataList.alarmTime,
        deviceName: this.alarmDataList.deviceName,
        deviceTypeName: this.alarmDataList.deviceTypeName,
        faultId: this.alarmDataList.faultId,
        handleBy: this.alarmDataList.handleBy,
        handleRemarks: this.alarmDataList.handleRemarks,
        regionName: this.alarmDataList.regionName,
        remarks: this.alarmDataList.remarks,
        status: "3",
      };
      getRecordDataEdit(this.form).then((res) => {
        console.log("res", res);
        if (res.code == 200) {
          this.$message({
            message: "关闭处理成功",
            type: "success",
          });
          this.$emit("ok");
        }
      });
      this.dialogClose = false;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.resetForm("form");
      this.form = {
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
</style>
