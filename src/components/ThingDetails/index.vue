<!--
 * @Author: MJ
 * @Date: 2021-07-20 11:15:23
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-15 14:40:07
 * @Description:
-->

<template>
  <div>
    <div class="container_details_box">
      <el-tabs v-model="indexTab">
        <!-- 设备类型信息 -->
        <el-tab-pane label="设备类型信息" name="1">
          <thing-details-type-information
            :inforDetails="inforDetails"
            @thingDetailsTypeInformation="thingDetailsTypeInformations"
          >
          </thing-details-type-information>
        </el-tab-pane>

        <!-- 物模型 -->
        <el-tab-pane label="物模型" name="2">
          <el-tabs v-model="indexTabModel" type="card">
            <!-- 属性定义 -->
            <el-tab-pane label="属性定义" name="1">
              <thing-attribute-panel
                :properties="properties"
                @openAttribute="openAttribute"
              ></thing-attribute-panel>
            </el-tab-pane>

            <!-- 功能定义 -->
            <el-tab-pane label="功能定义" name="2">
              <el-table
                :data="functions"
                stripe
                style="width: 100%"
                border
                :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }"
              >
                <el-table-column
                  prop="identifier"
                  label="功能ID"
                ></el-table-column>
                <el-table-column prop="name" label="功能名称"></el-table-column>
                <!-- <el-table-column prop="isRW" label="是否异步"></el-table-column> -->
                <!-- <el-table-column prop="address" label="备注"></el-table-column> -->
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span
                      class="color_blue cursor_pointer"
                      @click="openAttribute(1, scope.row)"
                    >
                      查看详情
                    </span>
                    <!-- <span
                      class="color_blue cursor_pointer margin_left_10"
                      @click="debuggings(0)"
                      >调试</span> -->
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 事件定义 -->
            <el-tab-pane label="事件定义" name="3">
              <el-table
                :data="events"
                stripe
                style="width: 100%"
                border
                :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }"
              >
                <el-table-column
                  prop="identifier"
                  label="事件ID"
                ></el-table-column>
                <el-table-column
                  prop="eventName"
                  label="事件名称"
                ></el-table-column>
                <!-- <el-table-column
              prop="dataType.type"
              label="事件级别"
            ></el-table-column> -->
                <!-- <el-table-column prop="address" label="备注"></el-table-column> -->
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span
                      class="color_blue cursor_pointer"
                      @click="openAttribute(2, scope.row)"
                    >
                      查看详情
                    </span>
                    <!-- <span
                      class="color_blue cursor_pointer margin_left_10"
                      @click="debuggings(1)"
                      >调试</span
                    > -->
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>

          <!-- 物模型对应的选项卡弹窗 -->
          <div>
            <!-- 属性定义/功能属性/事件属性 查看详情 -->
            <div>
              <el-dialog
                :title="dialogSee"
                :visible.sync="dialogTableVisible"
                width="20%"
              >
                <div class="properties_panel_box">
                  <div
                    class="properties_panel_item"
                    v-for="item in dataDetails"
                    :key="item.id"
                  >
                    <div v-text="item.title"></div>
                    <div>{{ item.value }}</div>
                  </div>
                </div>
              </el-dialog>
            </div>

            <!-- 功能属性/事件属性 调试 -->
            <el-dialog
              :title="debuggingTitle.title"
              :visible.sync="dialogFormVisible"
              width="20%"
              @close="close"
            >
              <el-form :model="form">
                <!--  -->
                <el-form-item
                  :label="debuggingTitle.titles"
                  label-width="120px"
                >
                  <el-input v-model="form.names"></el-input>
                </el-form-item>
              </el-form>

              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="determine">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </el-tab-pane>

        <!-- 告警设置 -->
        <el-tab-pane label="告警设置" name="3">
          <el-tabs v-model="indexAlarmSettingTab" type="card">
            <!-- 告警设置 -->
            <el-tab-pane label="告警设置" name="1">
              <el-button type="primary" @click.stop="addSetTingPanel"
                >新增</el-button
              >

              <div style="margin-top: 1vh">
                <el-table
                  :data="deviceAlarmList"
                  style="width: 100%"
                  :header-cell-style="headerCellStyle"
                  border
                >
                  <el-table-column
                    prop="alarmName"
                    label="警告名称"
                    align="center"
                  ></el-table-column>

                  <el-table-column
                    prop="createTime"
                    label="创建时间"
                    align="center"
                  ></el-table-column>

                  <el-table-column label="运行状态" align="center">
                    <template slot-scope="scope">
                      <span
                        class="table_is_status_00ff00"
                        v-if="scope.row.status == 0"
                        >已启用</span
                      >
                      <span class="table_is_status_ff0000" v-else>已停用</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="告警等级" align="center">
                    <template slot-scope="scope">
                      {{ milestoneStatusFormat(scope.row) }}
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <span
                        class="setting_btn"
                        @click="editSetTingPanel(scope.row)"
                        >编辑</span
                      >
                      <!-- <span class="setting_btn">告警记录</span> -->
                      <span
                        class="setting_btn"
                        v-if="scope.row.status == 0"
                        @click.stop="editStatusSetTing(scope.row)"
                        >停用</span
                      >
                      <span
                        class="setting_btn"
                        v-else
                        @click.stop="editStatusSetTing(scope.row)"
                        >启用</span
                      >
                      <span
                        class="setting_btn"
                        style="color: #ff0000"
                        @click.stop="deleteSeting(scope.row.id)"
                        >删除</span
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div style="margin-top: 3vh; text-align: right">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="query.pageNum"
                  :page-sizes="[10, 15, 20, 30]"
                  :page-size="10"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </el-tab-pane>

            <!-- 告警记录 -->
            <el-tab-pane label="告警记录" name="2">
              <thing-record-panel :detailsId="detailsId"></thing-record-panel>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新增告警设置 面板 -->
    <div v-if="isAddSetTing">
      <el-dialog
        title="新增告警"
        :visible.sync="isAddSetTing"
        width="50%"
        append-to-body
        @close="closes('add')"
      >
        <thing-add-set-ting-panel
          @receiveComponents="receiveComponents"
          :inforDetails="addInof"
          ref="addFunc"
        ></thing-add-set-ting-panel>
      </el-dialog>
    </div>

    <!-- 编辑告警设置 面板 -->
    <div v-if="isEditSetTing">
      <el-dialog
        title="编辑告警"
        :visible.sync="isEditSetTing"
        width="50%"
        append-to-body
        :show-close="false"
        :close-on-click-modal="false"
        @close="closes('edit')"
      >
        <thing-edit-set-ting-panel
          @receiveComponents="receiveComponents"
          :alarmId="alarmId"
          ref="editFunc"
        ></thing-edit-set-ting-panel>
      </el-dialog>
    </div>

    <!-- 列表 编辑面板 -->
    <el-dialog
      title="编辑设备类型"
      :visible.sync="isEdit"
      width="30%"
      append-to-body
      @close="closes('editCloses')"
    >
      <thing-edit-public-panel
        :editData="inforDetails"
        @thingEditPublicPanel="thingEditPublicPanels"
        ref="thingEditPublicPanel"
      ></thing-edit-public-panel>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDeviceAlarmList,
  deleteDeviceAlarm,
  putDeviceAlarmStatusUpdate,
  getDeviceDevicetype,
  putDeviceDevicetypeDeviceTypeIdThingModel,
} from "@/api/device/deviceClasses";

import ThingAddSetTingPanel from "@/components/ThingAddSetTingPanel";
import ThingEditSetTingPanel from "@/components/ThingEditSetTingPanel";
import ThingDetailsTypeInformation from "@/components/ThingDetailsTypeInformation";
import ThingEditPublicPanel from "@/components/ThingEditPublicPanel";
import ThingAttributePanel from "@/components/ThingAttributePanel";
// import ThingFunctionPanel from "@/components/ThingFunctionPanel";
import ThingRecordPanel from "@/components/ThingRecordPanel";

export default {
  name: "ThingDetails",
  components: {
    ThingAddSetTingPanel,
    ThingEditSetTingPanel,
    ThingDetailsTypeInformation,
    ThingEditPublicPanel,
    ThingAttributePanel,
    // ThingFunctionPanel,
    ThingRecordPanel,
  },
  props: {
    detailsId: {
      type: Number,
      default() {
        return 999888777;
      },
    },
  },
  data() {
    return {
      // 控制 告警设置-告警设置 编辑面板的显示与隐藏
      isEditSetTing: false,
      alarmId: {
        id: null,
      },
      inforDetails: {},
      addInof: {},
      // 控制 告警设置-告警设置 新增面板的显示与隐藏
      isAddSetTing: false,
      managerLevel: [],
      // 请求参数
      query: {
        pageNum: 1,
        pageSize: 10,
        deviceTypeId: null,
      },
      total: 0,
      // 告警设置列表
      deviceAlarmList: [],
      // 告警选项卡下标
      indexAlarmSettingTab: "1",
      dataInfor: {},
      indexTab: "1",
      indexTabModel: "1",

      // 属性定义
      properties: [],
      // 物模型
      functions: [],
      // 事件定义
      events: [],

      dialogSee: "物模型属性定义详情",
      dialogTableVisible: false,
      dataDetails: [],

      // 功能属性/事件属性 调试
      dialogFormVisible: false,
      debuggingTitle: {
        title: "调试物模型功能",
        titles: "功能名称",
      },
      form: {
        names: "",
      },

      tIcon: require("@/assets/icons/plug-in.png"),

      formEdit: {
        deviceTypeId: "",
        iconFilepath: "",
        equipmentType: "",
        equipmentName: "",
        remarks: "",
      },

      // 控制列表编辑面板的显示/隐藏
      isEdit: false,
      // 子系统字典
      subSystem: [],
    };
  },

  filters: {
    numToStr(num) {
      num = num.toString();
      return num;
    },
  },

  mounted() {
    if (this.detailsId == 999888777) {
      this.detailsId = Number(localStorage.getItem("detailsId"));
    } else {
      localStorage.setItem("detailsId", this.detailsId);
    }
    this.formEdit.deviceTypeId = this.detailsId;

    this.getDictionaries("managerLevel", "manager_level");
    this.getDictionaries("subSystem", "sub_system");

    this.$nextTick(() => {
      this.getDeviceDevicetypes(this.detailsId);
    });
  },

  methods: {
    // 打开 列表 编辑面板
    thingDetailsTypeInformations() {
      this.isEdit = true;
    },

    thingEditPublicPanels({ type }) {
      if (type == "editCancel" || type == "editDetermine") {
        this.inforDetails = {};
        this.getDeviceDevicetypes(this.detailsId);
        this.isEdit = false;
      }
    },

    // 获取 物模型 数据
    putDeviceDevicetypeDeviceTypeIdThingModels(deviceTypeId) {
      putDeviceDevicetypeDeviceTypeIdThingModel(deviceTypeId).then(
        (response) => {
          let { properties, functions, events } = response.data;

          this.properties = properties.map((item) => {
            item.isRW = item.accessMode == "r" ? "是" : "否";
            return item;
          });
          this.functions = functions.map((item) => {
            // item.isRW = item.callType == "async" ? "是" : "否";
            return item;
          });
          this.events = events;
        }
      );
    },

    // 设备详情
    getDeviceDevicetypes(id) {
      getDeviceDevicetype(id).then((response) => {
        this.inforDetails = response.data;
        this.inforDetails.systemName = this.selectDictLabel(
          this.subSystem,
          response.data.systemId
        );
        this.dataInfor = this.inforDetails;
        this.$set(this.addInof, "deviceTypeId", response.data.deviceTypeId);
        this.$set(this.addInof, "systemId", response.data.systemId);
        this.$set(this.alarmId, "deviceTypeId", response.data.deviceTypeId);
        this.$set(this.query, "deviceTypeId", response.data.deviceTypeId);
        this.putDeviceDevicetypeDeviceTypeIdThingModels(this.detailsId);
        this.getDeviceAlarmLists();
      });
    },

    // 获取字典数据
    getDictionaries(key, value) {
      this.getDicts(value).then((response) => {
        let { code, data } = response;
        if (code == 200) {
          this[key] = data;
        }
      });
    },

    // 字典翻译
    milestoneStatusFormat(row) {
      return this.selectDictLabel(this.managerLevel, row.alarmLevel);
    },

    // 控制 告警设置-告警设置 编辑 面板的显示/隐藏
    editSetTingPanel(row) {
      this.alarmId.id = row.id;
      this.isEditSetTing = !this.isEditSetTing;
    },

    // 控制 告警设置-告警设置 新增 面板的显示/隐藏
    addSetTingPanel() {
      this.isAddSetTing = !this.isAddSetTing;
    },

    // 接收 告警设置-告警设置 新增 面板的显示/隐藏 数据
    receiveComponents(data) {
      if (data.type == "triggers") {
        this.getDeviceAlarmLists();
      }
      this.isAddSetTing = false;
      this.isEditSetTing = false;
    },

    // 告警设置-告警设置-修改状态
    editStatusSetTing(row) {
      let { id, status } = row;
      putDeviceAlarmStatusUpdate({
        id,
        status: status == 0 ? 1 : 0,
      }).then((response) => {
        if (response.code == 200) {
          this.getDeviceAlarmLists();
          this.$message({
            type: "success",
            message: "修改成功!",
          });
        }
      });
    },

    // 告警设置-告警设置 当前页
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getDeviceAlarmLists();
    },

    // 告警设置-告警设置 每页大小
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getDeviceAlarmLists();
    },

    // 告警设置-告警设置 删除
    deleteSeting(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDeviceAlarm(id).then((response) => {
            if (response.code == 200) {
              this.getDeviceAlarmLists();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 告警设置 表格 表头
    headerCellStyle() {
      return "backgroundColor: #eeeeee;";
    },

    // 获取告警设置列表
    getDeviceAlarmLists() {
      getDeviceAlarmList(this.query).then((response) => {
        let { records, total } = response.data;
        this.deviceAlarmList = records;
        this.total = total;
      });
    },

    // 关闭弹窗
    closes(val) {
      if (val == "editCloses") {
        this.$refs.thingEditPublicPanel.submitForm(0);
      } else if (val == "add") {
        this.$refs.addFunc.panelBtn(0);
      } else if (val == "edit") {
        this.$refs.editFunc.panelBtn(0);
      }
      this.form = {
        equipmentType: "",
        equipmentName: "",
        remarks: "",
      };
    },

    // 调试 确定
    determine() {
      this.form = {
        names: "",
      };
      this.dialogFormVisible = !this.dialogFormVisible;
    },

    // 关闭弹窗回调事件
    close() {
      this.form = {
        names: "",
      };
    },

    // 功能属性/事件属性 调试
    debuggings(i) {
      this.debuggingTitle =
        i == 0
          ? {
              title: "调试物模型功能",
              titles: "功能名称",
            }
          : {
              title: "调试物模型事件",
              titles: "事件名称",
            };
      this.dialogFormVisible = !this.dialogFormVisible;
    },

    // 属性定义/功能属性/事件属性 查看详情
    openAttribute(i, data) {
      let newData = [],
        id = 0,
        templateData = [
          {
            field: "属性ID",
            name: "属性名称",
            dataTypes: "数据类型",
            isRW: "是否只读",
          },
          {
            identifier: "功能ID",
            name: "功能名称",
            // isRW: "是否异步",
          },
          {
            identifier: "事件ID",
            eventName: "事件名称",
            // eventType: "事件类型"
          },
        ];

      for (const key in templateData[i]) {
        id += 1;
        if (Object.hasOwnProperty.call(templateData[i], key)) {
          const element = templateData[i][key];
          newData.push({
            id,
            title: element,
            value: key == "dataTypes" ? data.dataType.type : data[key],
          });
        }
      }

      this.dataDetails = newData;
      this.dialogSee =
        i == 0
          ? "物模型属性定义详情"
          : i == 1
          ? "物模型功能定义详情"
          : "物模型事件定义详情";
      this.dialogTableVisible = !this.dialogTableVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
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
