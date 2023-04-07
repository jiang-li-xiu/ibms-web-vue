<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-15 08:31:51
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-09 11:25:44
-->
<template>
  <div class="release-eqpt-table">
    <!-- 添加或修改消息弹窗 -->
    <el-dialog :title="is_edit" :visible.sync="dialogVisible" width="40%">
      <!-- 表单 -->
      <el-form ref="form" :model="taskParameters" label-position="right" :rules="rules">
        <el-form-item label="发布消息" prop="programId">
          <el-select v-model="taskParameters.programId" placeholder="请选择消息">
            <el-option
              v-for="item in msgList"
              :key="item.id"
              :label="item.programName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发布模式" prop="pattern">
          <el-radio
            :disabled="item.type"
            v-for="(item, index) in patternList"
            :key="index"
            v-model="taskParameters.pattern"
            :label="item.key"
            >{{ item.label }}</el-radio
          >
        </el-form-item>
        <!-- 定时发布 -->
        <div v-show="taskParameters.pattern == '3'">
          <el-form-item
            label="cron表达式"
            prop="cron"
            :rules="{
              required: taskParameters.pattern == '3' ? true : false,
              message: 'cron执行表达式不能为空',
              trigger: ['blur'],
            }"
          >
            <el-input
              v-model="taskParameters.cron"
              placeholder="请点击右侧按钮选择corn表达式"
              :disabled="true"
            >
              <el-button
                slot="append"
                icon="el-icon-alarm-clock"
                @click="cronVisible = true"
              ></el-button>
            </el-input>
          </el-form-item>
        </div>

        <el-form-item label="发布状态" prop="isRelease">
          <el-radio-group v-model="taskParameters.isRelease">
            <el-radio label="发布">发布</el-radio>
            <el-radio label="搁置">搁置</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="发布设备" prop="dialogTableData">
          <el-button
            type="primary"
            @click="addAntEditClick"
            :icon="
              taskParameters.dialogTableData.length == 0 ? 'el-icon-plus' : 'el-icon-edit'
            "
            >{{
              taskParameters.dialogTableData.length == 0 ? "添 加" : "修 改"
            }}</el-button
          >
        </el-form-item>
        <el-table border :data="taskParameters.dialogTableData">
          <el-table-column
            align="center"
            label="设备名称"
            prop="deviceName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="所属分区"
            prop="regionName"
          ></el-table-column>
        </el-table>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitClickConnect">提 交</el-button>
      </div>
    </el-dialog>
    <!-- Cron选择器 -->
    <el-dialog
      title="选择Cron时间"
      :visible.sync="cronVisible"
      :width="'50%'"
      @closed="cronVisible = false"
    >
      <cron v-model="taskParameters.cron" v-if="cronVisible" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cronVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 信息弹窗里的内嵌弹窗 -> 设备选择弹窗 -->
    <el-dialog title="播放设备选择" :visible.sync="deviceSelectVisible" width="550px">
      <!-- 头部查询 -->
      <el-row class="query" :gutter="20">
        <el-col :span="12">
          <el-form :model="deviceSelectQueryData" label-position="right">
            <el-form-item label="设备名称：" label-width="100px">
              <el-input
                width="300px"
                v-model="deviceSelectQueryData.deviceName"
                placeholder="请输入设备名称"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="getMsgs()"
            >查询</el-button
          >
        </el-col>
        <el-col :span="4">
          <el-button @click="getMsgs('refresh')" icon="el-icon-refresh">重置</el-button>
        </el-col>
      </el-row>
      <!-- 数据列表 -->
      <div class="deviceSelectTable">
        <el-table
          border
          height="500px"
          ref="multipleTables"
          :data="deviceSelectTableData"
          @selection-change="deviceSelectVisibleChange"
        >
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column
            align="center"
            label="设备名称"
            prop="deviceName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="所属分区"
            prop="regionName"
          ></el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="deviceSelectVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitClickData">{{
          taskParameters.dialogTableData.length == 0 ? "添 加" : "修 改"
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProgramList,
  getInfomationsList,
  addInfomationsPlan,
  updateInfomationsPlan,
} from "@/api/subsystem/information-release/information-release";
import Cron from "@/components/Cron";
export default {
  components: {
    Cron,
  },
  data() {
    let _this = this;
    return {
      deviceSelectVisibleIds: [], //内嵌弹窗 多选后获取到的数组
      cronVisible: false, // Cron选择器
      dialogVisible: false, // 添加或修改消息弹窗开关
      is_edit: "添加发布消息", // 当前是否为修改
      // 修改或添加的数据
      taskParameters: {
        id: null,
        programId: null, //发布消息id
        pattern: "1", //发布模式
        isRelease: "发布", //发布状态
        cron: "", //Cron表达式
        dialogTableData: [], // 弹窗表格数据
      },
      patternList: [
        { label: "手动", key: "1", type: false },
        { label: "自动", key: "2", type: true },
        { label: "定时发布", key: "3", type: false },
      ], //发布模式List
      msgList: [], //消息列表
      // 播放设备选择弹窗开关
      deviceSelectVisible: false,
      // 播放设备选择查询参数
      deviceSelectQueryData: {
        regionId: 0,
        deviceName: "", // 设备名称
      },
      // 播放设备选择列表数据
      deviceSelectTableData: [],
      rules: {
        programId: [
          {
            type: "number",
            required: true,
            message: "发布消息不能为空",
            trigger: ["change", "blur"],
          },
        ],
        pattern: [
          {
            required: true,
            message: "发布模式不能为空",
            trigger: "blur",
          },
        ],
        isRelease: [
          {
            required: true,
            message: "发布状态不能为空",
            trigger: "blur",
          },
        ],
        dialogTableData: [
          {
            required: true,
            message: "发布设备不能为空",
            trigger: ["change", "blur"],
            transform(value) {
              console.log(123);
              if (_this.taskParameters.dialogTableData.length > 0) {
                return "value";
              }
              return "";
            },
          },
        ],
      },
    };
  },

  methods: {
    //添加或修改
    addAntEditClick() {
      this.toggleSelection();
      this.deviceSelectVisible = true;
    },
    //提交
    submitClickConnect() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let dataObject = {
            programId: String(this.taskParameters.programId), //发布消息id
            pattern: this.taskParameters.pattern, //发布模式
            isRelease: this.taskParameters.isRelease, //发布状态
            releaseDevices: this.taskParameters.dialogTableData
              .map((item) => item.id)
              .toString(), //发布设备
          };
          if (dataObject.pattern == "3") {
            dataObject.cron = this.taskParameters.cron;
          }
          let funAddAandEdit;
          if (this.is_edit === "修改发布消息") {
            dataObject.id = this.taskParameters.id;
            funAddAandEdit = updateInfomationsPlan(dataObject);
          } else {
            funAddAandEdit = addInfomationsPlan(dataObject);
          }
          funAddAandEdit.then((response) => {
            if (response.code === 200) {
              this.$message.success(response.message);
              this.$emit("getList");
              this.dialogVisible = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //数据回显
    toggleSelection() {
      let _this = this;
      if (this.taskParameters.dialogTableData.length > 0) {
        this.$nextTick(() => {
          setTimeout(() => {
            _this.taskParameters.dialogTableData.forEach((row) => {
              _this.$refs.multipleTables.toggleRowSelection(
                _this.deviceSelectTableData.find((item) => {
                  return row.id == item.id;
                }),
                true
              );
            });
          }, 100);
        });
      }
    },
    //添加选择设备
    submitClickData() {
      this.taskParameters.dialogTableData = this.deviceSelectVisibleIds;
      this.$refs["form"].validate((valid) => {});
      this.deviceSelectVisible = false;
    },
    // 内嵌弹窗 多选框选中数据
    deviceSelectVisibleChange(selection) {
      this.deviceSelectVisibleIds = selection;
    },
    // 打开编辑
    handleMessageEdit(row) {
      getProgramList().then((response) => {
        this.msgList = response.rows;
      });
      this.deviceSelectQueryData.deviceName = "";
      if (row) {
        this.is_edit = "修改发布消息";
        this.taskParameters = {
          id: row.id, //id
          programId: Number(row.programId), //发布消息id
          pattern: row.pattern, //发布模式
          isRelease: row.isRelease, //发布状态
          cron: row.cron, //Cron表达式
        };
        this.taskParameters.dialogTableData = [];
        this.deviceSelectVisibleIds = [];
        this.getMsgs("value", row);
        //this.getMsgs();
      } else {
        this.is_edit = "添加发布消息";
        // 重置输入框的数据
        this.taskParameters = {
          programId: null, //发布消息id
          pattern: "1", //发布模式
          isRelease: "发布", //发布状态
          cron: "", //Cron表达式
        };
        this.taskParameters.dialogTableData = [];
        this.deviceSelectVisibleIds = [];

        this.getMsgs();
      }
      this.dialogVisible = true;
    },
    //获取设备列表
    getMsgs(type, row) {
      if (type === "refresh") {
        this.deviceSelectQueryData.deviceName = "";
      }
      getInfomationsList(this.deviceSelectQueryData).then((response) => {
        this.deviceSelectTableData = response.rows;
        if (type === "value") {
          let arr = row.releaseDevices.split(",");
          let list = [];
          for (const id of arr) {
            for (const item of response.rows) {
              if (id == item.id) {
                list.push(item);
              }
            }
          }
          this.taskParameters.dialogTableData = list;
        } else {
          this.toggleSelection();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
