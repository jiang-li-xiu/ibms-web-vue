<!--
 * @Author: RobertFan
 * @Date: 2022-06-07 14:43:12
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-06-22 10:20:26
 * @Description: 
-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="800px"
      :loading="loading"
      append-to-body
      @close="closeDialog"
    >
      <el-form
        ref="configForm"
        label-width="120px"
        :model="modelForm"
        :rules="rules"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="标准任务名称:" prop="taskName">
              <el-input
                v-model="modelForm.taskName"
                placeholder="请输入标准任务名称"
                :disabled="disableSubmit"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="维保级别:" prop="maintenanceGrade">
              <el-select
                v-model="modelForm.maintenanceGrade"
                placeholder="维保级别"
                clearable
                style="width: 100%"
                filterable
                :disabled="disableSubmit"
              >
                <el-option
                  v-for="dict in maintenanceGradeDict"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="设备类型:" prop="deviceTypeId">
              <el-select
                v-model="modelForm.deviceTypeId"
                placeholder="请选择设备类型"
                clearable
                filterable
                :disabled="disableSubmit"
                style="width: 100%"
              >
                <el-option
                  v-for="item in DeviceType"
                  :key="item.deviceTypeId"
                  :label="item.deviceTypeName"
                  :value="item.deviceTypeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="负责人:" prop="supervisePerson">
              <el-select
                v-model="modelForm.supervisePerson"
                placeholder="请选择"
                :disabled="disableSubmit"
                style="width: 100%"
                value-key="userId"
                @change="selectChange($event)"
                clearable
                filterable
                multiple
              >
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="任务描述:" prop="taskDescribe">
              <el-input
                type="textarea"
                :rows="3"
                v-model="modelForm.taskDescribe"
                placeholder="任务详情描述"
                :disabled="disableSubmit"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="计划开始时间:" prop="planStartTime">
              <el-date-picker
                v-model="modelForm.planStartTime"
                type="date"
                placeholder="请选择开始日期"
                value-format="yyyy-MM-dd"
                :disabled="disableSubmit"
                style="width: 100%"
                :picker-options="pickerOptionsStart"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="计划结束时间:" prop="stopTime">
              <el-date-picker
                v-model="modelForm.stopTime"
                type="date"
                placeholder="请选择结束日期"
                value-format="yyyy-MM-dd"
                :disabled="disableSubmit"
                style="width: 100%"
                :picker-options="pickerOptionsEnd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="循环方式:" prop="repeatWay">
              <el-radio-group
                v-model="modelForm.repeatWay"
                :disabled="disableSubmit"
                @change="changeRadio"
              >
                <el-radio label="0">单 次</el-radio>
                <el-radio label="1">多 次</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="时间间隔:"
              prop="timeInterval"
              v-if="this.modelForm.repeatWay == 1"
            >
              <el-input-number 
                v-model="modelForm.timeInterval" 
                controls-position="right" 
                :precision="2" 
                :step="1" 
                :min="0"
                style="width:100%"
                />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="间隔单位:"
              prop="unit"
              v-if="this.modelForm.repeatWay == 1"
            >
              <!-- 时间间隔字典 -->
              <el-select
                v-model="modelForm.unit"
                filterable
                placeholder="请选择间隔单位"
                style="width: 100%"
              >
                <el-option
                  v-for="dict in timeIntervalDict"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="维保项目:" prop="dialogTableData">
              <el-button
                type="primary"
                :icon="
                  this.title == '新增'
                    ? 'el-icon-plus'
                    : 'el-icon-edit'
                "
                @click="handleItems"
                :disabled="disableSubmit"
                style="margin-bottom: 8px"
                >{{
                  this.title
                }}</el-button
              >
              <!-- 表格区域 -->
              <el-table
                border
                class="table-style"
                :row-key="rowKey"
                v-loading="loading"
                :data="modelForm.dialogTableData"
              >
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column
                  label="检查项目"
                  align="center"
                  prop="inspectProject"
                />
                <el-table-column
                  label="步骤指导"
                  align="center"
                  prop="stepGuidance"
                />
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!disableSubmit">
        <el-button type="primary" @click="submitForm">
          保存
        </el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 内嵌弹窗->维保项目弹窗 -->
    <el-dialog
      title="选择维保项目"
      :visible.sync="deviceSelectVisible"
      width="850px"
    >
      <!-- 头部查询区域 -->
      <el-row class="query" :gutter="20">
        <el-col :span="12">
          <el-form :model="maintenanceQueryData" label-width="75px">
            <el-form-item label="检查项目:" prop="inspectProject">
              <el-input
                v-model="maintenanceQueryData.inspectProject"
                placeholder="请输入检查项目"
                clearable
              />
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 按钮区域 -->
        <el-button type="primary" icon="el-icon-search" @click="getMsgs"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery"
          >重置</el-button
        >
      </el-row>

      <!-- 数据列表 -->
      <div class="deviceSelectTable">
        <el-table
          border
          ref="refSelect"
          class="table"
          :data="maintenanceTableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column
            label="检查项目"
            align="center"
            prop="inspectProject"
          />
          <el-table-column
            label="步骤指导"
            align="center"
            prop="stepGuidance"
          />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitClickData"> 保存 </el-button>
        <el-button @click="deviceSelectVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addList,
  getDetails,
  editList,
  getDeviceType,
  getUserList,
} from "@/api/maintenance/standerItems";
import { getTableList } from "@/api/maintenance/maintenanceItems";
// import MaintenanceTable from "./MaintenanceTable.vue";
export default {
  components: {
    // MaintenanceTable,
  },
  data() {
    return {
      // 获取设备类型数据列表
      DeviceType: [],
      // 维保级别数据字典
      maintenanceGradeDict: [],
      // 时间间隔数据字典
      timeIntervalDict: [],
      // 负责人列表数据
      userList: [],
      // 主键id
      rowKey: "maintenanceId",
      // 弹出层标题
      title: "添加维保任务",
      // 是否显示对话框
      visible: false,
      // 文本框是否可编辑
      disableSubmit: false,
      // 是否加载
      loading: false,
      modelForm: {
        taskId: "",
        taskName: "",
        userId: [],
        maintenanceGrade: "",
        deviceTypeId: "",
        supervisePerson: [],
        taskDescribe: "",
        planStartTime: "",
        stopTime: "",
        repeatWay: "",
        timeInterval: "",
        unit: "",
        dialogTableData: [],
        userName: [],
      },
      rules: {
        taskName: [
          { required: true, message: "标准任务名称不能为空", trigger: "blur" },
        ],
        maintenanceGrade: [
          { required: true, message: "维保等级不能为空", trigger: ["change","blur"] },
        ],
        deviceTypeId: [
          { required: true, message: "设备类型不能为空", trigger: ["change","blur"] },
        ],
        supervisePerson: [
          { required: true, message: "负责人不能为空", trigger: ["change","blur"] },
        ],
        taskDescribe: [
          { required: true, message: "任务描述不能为空", trigger: "blur" },
        ],
        planStartTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
        ],
        stopTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
        repeatWay: [
          { required: true, message: "循环方式不能为空", trigger: "blur" },
        ],
        timeInterval: [
          { required: true, message: "时间间隔不能为空", trigger: "blur" },
          // { type: number, massage: "请输入数字", trigger: "blur"}
        ],
        unit: [
          { required: true, message: "时间间隔单位不能为空", trigger: "blur" },
        ],
        dialogTableData: [
          { required: true, message: "维保项目不能为空" ,trigger: "change"},
        ],
      },
      // 表格数据
      resList: [],

      // 内嵌对话框->选择维保项目对话框数据:

      deviceSelectVisible: false,
      // 选择维保项目查询参数
      maintenanceQueryData: {
        inspectProject: "",
      },

      maintenanceTableData: [], // 维保项目表格数据
      deviceSelectVisibleIds: [], //内嵌弹窗 多选后获取到的数组

      // 开始日期限制
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.modelForm.stopTime) {
            return (
              time.getTime() >= new Date(this.modelForm.stopTime).getTime()
            );
          }
        },
      },
      // 结束日期限制
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.modelForm.planStartTime) {
            return (
              time.getTime() <= new Date(this.modelForm.planStartTime).getTime()
            );
          }
        },
      },
    };
  },
  created() {
    // 获取维保级别数据字典列表
    this.getDicts("maintenance_grade").then((response) => {
      this.maintenanceGradeDict = response.data;
    });
    // 获取时间间隔数据字典列表
    this.getDicts("time_interval").then((response) => {
      this.timeIntervalDict = response.data;
    });
    // 获取设备类型
    this.getDeviceType();
    // 获取内嵌对话框的表格数据
    this.getTableList();
    // 获取用户列表数据
    this.getUserList();
  },
  methods: {
    /** 点击新增触发 */
    add() {
      this.refresh();
      this.visible = true;
    },

    /** 触发编辑功能 */
    edit(record) {
      this.loading = true;
      getDetails(record.taskId).then((response) => {
        let {data} = response
        this.modelForm = data;
        this.modelForm.supervisePerson = data.userId.split(',')
        this.modelForm.dialogTableData = data.projects;
        this.loading = false;
      });
      this.visible = true;
    },

    /** 重置表单 */
    refresh() {
      this.modelForm = {
        taskName: "",
        maintenanceGrade: "",
        deviceTypeId: "",
        taskDescribe: "",
        planStartTime: "",
        stopTime: "",
        repeatWay: "0",
        timeInterval: "",
        unit: "",
        dialogTableData: [],
        userId: [],
        userName: [],
        supervisePerson: [],
      };
    },

    // 点击确定按钮
    submitForm() {
      this.$refs["configForm"].validate((valid) => {
        console.log(valid);
        if (valid) {
          let dataObject = {
            taskId: this.modelForm.taskId,
            taskName: this.modelForm.taskName, //任务名称
            maintenanceGrade: this.modelForm.maintenanceGrade, //维保等级
            deviceTypeId: this.modelForm.deviceTypeId, //设备id
            userId: this.modelForm.userId, //负责人id
            supervisePerson: this.modelForm.userName, //负责人
            taskDescribe: this.modelForm.taskDescribe, //任务描述
            planStartTime: this.modelForm.planStartTime, //开始时间
            stopTime: this.modelForm.stopTime, //停止时间
            repeatWay: this.modelForm.repeatWay, //循环方式
            timeInterval: this.modelForm.timeInterval, //时间间隔
            unit: this.modelForm.unit,
            maintenanceId: this.modelForm.dialogTableData
              .map((item) => item.maintenanceId)
              .toString(),
          };
          let func, msg;
          if (this.title == "修改") {
            func = editList(dataObject);
            msg = "编辑成功";
          } else {
            func = addList(dataObject);
            msg = "添加成功";
          }
          func.then((response) => {
            console.log(response);
            if (response.code == 200) {
              this.visible = false;
              this.msgSuccess(msg);
              this.$emit("ok");
              this.$refs["refSelect"].clearSelection();
            }
          });
        } else {
          console.log("error submit!!!");
          return false;
        }
      });
    },

    closeDialog() {
      this.visible = false
      this.$refs["configForm"].resetFields();
      this.$refs["refSelect"].clearSelection();
    },

    // 维保项目的添加
    handleItems() {
      this.toggleSelection();
      this.deviceSelectVisible = true;
    },

    // 获取设备类型
    getDeviceType() {
      getDeviceType()
        .then((res) => {
          if (res.code == 200) {
            this.DeviceType = res.data;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },

    // 内嵌对话框方法：
    // 获取维保项目数据列表
    getTableList() {
      getTableList(this.maintenanceQueryData).then((res) => {
        this.maintenanceTableData = res.rows;
      });
    },

    getMsgs() {
      this.getTableList();
    },

    resetQuery(){
      this.maintenanceQueryData.inspectProject = ""
      this.getMsgs()
    },

    // 内嵌弹框->多选框选中数据
    handleSelectionChange(selection) {
      this.deviceSelectVisibleIds = selection;
    },

    // 确认保存按钮
    submitClickData() {
      this.modelForm.dialogTableData = this.deviceSelectVisibleIds;
      this.deviceSelectVisible = false;
    },

    // 数据回显
    toggleSelection(){
      let _this = this;
      if(this.modelForm.dialogTableData.length > 0){
        this.$nextTick(() => {
          setTimeout(() => {
            _this.modelForm.dialogTableData.forEach((row) => {
              _this.$refs.refSelect.toggleRowSelection(
                _this.maintenanceTableData.find((item) => {
                  return row.maintenanceId == item.maintenanceId;
                }),
                true
              );
            });
          }, 100);
        });
      }
    },

    // 负责人
    getUserList() {
      getUserList()
        .then((res) => {
          if (res.code == 200) {
            this.userList = res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    selectChange(event) {
      this.modelForm.userId = event.toString();
      this.modelForm.userName = []
      event.forEach(item=>{
        this.userList.forEach(i=>{
          if(item == i.userId){
            this.modelForm.userName.push(i.userName)
          }
        })
      })
      this.modelForm.userName = this.modelForm.userName.toString()
    },

    // 改变单选框触发的事件
    changeRadio(value){
      // console.log(value);
      if(value == 0){
        this.modelForm.unit = null
      }
      else{
        this.modelForm.unit = "0"
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>
