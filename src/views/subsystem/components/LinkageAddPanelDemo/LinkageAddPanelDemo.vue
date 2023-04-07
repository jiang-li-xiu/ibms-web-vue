<!--
 * @Author: MJ
 * @Date: 2021-07-26 10:39:11
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-07 17:58:11
 * @Description: 
-->
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="3vw">
      <el-form-item label="联动名称" prop="linkageName">
        <el-input
          v-model="ruleForm.linkageName"
          placeholder="请输入联动名称"
          size="small"
        >
        </el-input>
      </el-form-item>

      <!-- 触发条件 -->
      <el-form-item label="" prop="linkTrigger">
        <div class="title_text">触发条件</div>

        <div
          class="back_box margin_top_1 margin_left_-3"
          v-for="(item, i) in ruleForm.linkTrigger"
          :key="item.id"
        >
          <div class="titles_box">
            <span v-text="'触发器：' + item.id"></span>
            <span @click="deleteTrigger(i)">删除</span>
          </div>

          <div>
            <el-row class="padding_left_3">
              <el-col :span="10">
                <el-select
                  v-model="item.model"
                  placeholder="请选择触发器"
                  @change="changeTrigger"
                >
                  <el-option
                    v-for="items in linkTriggerCondition"
                    :key="items.dictValue"
                    :label="items.dictLabel"
                    v-model="items.dictValue"
                    :disabled="items.dictValue == 1 && isSingleChoice"
                  />
                </el-select>
              </el-col>
            </el-row>

            <el-row class="padding_left_3 margin_top_1">
              <!-- 定时触发 -->
              <el-col style="width: 13.8rem" v-if="item.model == 2">
                <el-input
                  v-model="item.corn"
                  placeholder="请输入corn表达式"
                  clearable
                  size="small"
                />
              </el-col>

              <!-- 设备触发1 -->
              <el-col v-if="item.model == 3" style="width: 13.8rem">
                <el-button
                  style="width: 13.8rem; text-align: left; padding-left: 1rem"
                  @click="openEquipmentPanel(i)"
                  >{{
                    !item.deviceId ? "请选择设备" : item.deviceName
                  }}</el-button
                >
              </el-col>

              <!-- 场景触发 -->
              <el-col v-if="item.model == 4" style="width: 13.8rem">
                <el-button style="width: 13.8rem; text-align: left"
                  >暂未开发</el-button
                >
              </el-col>
            </el-row>

            <!-- 设备触发2 -->
            <el-row
              class="padding_left_3 margin_top_1"
              v-if="item.model == 3 && item.deviceId != null"
            >
              <el-col>
                <el-select
                  v-model="item.attributeEventFunction"
                  placeholder="请选择类型"
                  @change="selectType($event, i)"
                >
                  <el-option
                    v-for="items in linkageTriggerType"
                    :key="items.dictValue"
                    :label="items.dictLabel"
                    v-model="items.dictValue"
                  />
                </el-select>

                <el-select
                  class="margin_left_1"
                  v-model="item.identifier"
                  placeholder=""
                  @change="changeIdentifier($event, i)"
                  v-if="
                    item.model == 3 && item.deviceId != null && item.indexE == 2
                  "
                >
                  <el-option
                    v-for="items in attributeEvent"
                    :key="items.identifier"
                    :label="items.name"
                    v-model="items.identifier"
                  />
                </el-select>
              </el-col>
            </el-row>

            <!--  -->
            <div
              class="padding_left_3 margin_top_1"
              v-if="
                item.model == 3 &&
                item.attributeEventFunction != '' &&
                item.indexE == 1
              "
            >
              <el-row
                v-for="(items, is) in item.filters"
                :key="items.id"
                class="margin_top_1"
              >
                <el-select v-model="items.propertyName" placeholder="">
                  <el-option
                    v-for="itemss in attributeEvent"
                    :key="itemss.field"
                    :label="itemss.name"
                    v-model="itemss.field"
                  />
                </el-select>

                <el-select
                  class="margin_left_1"
                  style="width: 13.8rem"
                  v-model="items.operator"
                  placeholder="请选择操作符"
                >
                  <el-option
                    v-for="itemss in linkTriggerOperator"
                    :key="itemss.dictValue"
                    :label="itemss.dictLabel"
                    v-model="itemss.dictValue"
                  />
                </el-select>

                <el-input
                  class="margin_left_1"
                  style="width: 13.8rem"
                  v-model="items.threshold"
                  placeholder="请输入过滤值"
                  clearable
                  size="small"
                />

                <span
                  class="margin_left_1 cursor_pointer color_blue"
                  @click.stop="deleteA(i, is)"
                  >删除</span
                >
              </el-row>
            </div>

            <!-- 设备触发3 -->
            <el-row
              class="padding_left_3 margin_top_1"
              v-if="
                item.model == 3 &&
                item.attributeEventFunction != '' &&
                item.indexE == 1
              "
            >
              <el-button type="primary" plain @click="addO(i)">添加</el-button>
            </el-row>
          </div>
        </div>

        <el-button
          type="primary"
          plain
          @click="addTriggerBtn"
          class="margin_top_2"
          >新增触发器</el-button
        >
      </el-form-item>

      <!-- 执行动作 -->
      <el-form-item label="" prop="linkTriggerEvens" class="margin_top_5">
        <div class="title_text">执行动作</div>

        <div
          class="back_box margin_top_1 margin_left_-3"
          v-for="(item, i) in ruleForm.linkTriggerEvens"
          :key="item.id"
        >
          <div class="titles_box">
            <span v-text="'执行动作：' + item.id"></span>
            <span @click="deleteAction(i)">删除</span>
          </div>

          <div>
            <el-row class="padding_left_3">
              <!-- 选择动作类型 -->
              <el-col style="width: 13.8rem">
                <el-select v-model="item.executor" placeholder="请选择动作类型">
                  <el-option
                    v-for="items in linkActionType"
                    :key="items.dictValue"
                    :label="items.dictLabel"
                    v-model="items.dictValue"
                  />
                </el-select>
              </el-col>

              <!-- 打开设备面板 -->
              <el-col
                class="margin_left_1"
                style="width: 13.8rem"
                v-if="item.executor == '1'"
              >
                <el-button
                  style="width: 13.8rem; text-align: left; padding-left: 1rem"
                  @click="openEquipmentPanel2(i)"
                  >{{
                    !item.deviceId ? "请选择设备" : item.deviceName
                  }}</el-button
                >
              </el-col>

              <!-- 选择类型 -->
              <el-col
                class="margin_left_1"
                style="width: 13.8rem"
                v-if="item.executor == '1' && item.deviceId != ''"
              >
                <el-select
                  v-model="item.messageType"
                  @change="getTypeAction($event, i)"
                  placeholder="请选择类型"
                >
                  <el-option
                    v-for="items in linkDeviceSenderType"
                    :key="items.dictValue"
                    :label="items.dictLabel"
                    v-model="items.dictValue"
                  />
                </el-select>
              </el-col>

              <!-- 物模型（属性/功能） -->
              <el-col
                class="margin_left_1"
                style="width: 13.8rem"
                v-if="
                  item.executor == '1' &&
                  item.deviceId != '' &&
                  item.messageType != ''
                "
              >
                <el-select
                  :placeholder="
                    item.messageType == 'WRITE_PROPERTY'
                      ? '物模型属性'
                      : '物模型功能'
                  "
                  v-model="item.propertyName"
                  @change="objectModel($event, i)"
                >
                  <el-option
                    v-for="items in panelAction"
                    :key="items.field"
                    :label="items.name"
                    v-model="items.field"
                  />
                </el-select>
              </el-col>

              <el-col
                class="margin_left_1"
                style="width: 13.8rem"
                v-if="
                  item.executor == '1' &&
                  item.deviceId != '' &&
                  item.messageType == 'WRITE_PROPERTY' &&
                  item.propertyName !== ''
                "
              >
                <el-input
                  style="width: 13.8rem"
                  v-model="item.propertyValue"
                  placeholder="请输入过滤值"
                  clearable
                  size="small"
                />
              </el-col>
            </el-row>

            <el-row
              v-if="
                item.executor == '1' &&
                item.deviceId != '' &&
                item.messageType == 'INVOKE_FUNCTION' &&
                item.propertyName !== ''
              "
            >
              <el-col>
                <el-row
                  v-for="items in item.inputData"
                  :key="items.field"
                  class="padding_left_3 margin_top_1"
                >
                  <el-col style="width: 13.8rem">
                    <el-input
                      style="width: 13.8rem"
                      v-model="items.name"
                      disabled
                      size="small"
                    />
                  </el-col>

                  <el-col class="margin_left_1" style="width: 13.8rem">
                    <el-input
                      style="width: 13.8rem"
                      v-model="items.parmValue"
                      placeholder=""
                      size="small"
                    />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>

        <el-button
          type="primary"
          plain
          class="margin_top_2"
          @click="addActionBtn"
          >新增动作</el-button
        >
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item class="margin_top_2 btns_box">
        <el-button @click="onSubmit(0)">取 消</el-button>
        <el-button type="primary" @click="onSubmit(1)">确 定</el-button>
      </el-form-item>
    </el-form>

    <!-- 设备面板 -->
    <div>
      <el-dialog
        title="绑定子设备"
        :visible.sync="isEquipmentPanel"
        append-to-body
        width="30%"
      >
        <linkage-equipment-panel @trigger="triggers"></linkage-equipment-panel>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import {
//   listTest,
//   getTest,
//   delTest,
//   addTest,
//   updateTest,
// } from "@/api/system/test";

import {
  getDeviceDeviceinfoProperties,
  getDeviceDeviceinfoEvents,
  getDeviceDeviceinfoFunctions,
  postLinkConfig,
} from "@/api/subsystem/linkageAdministration";

import trigger from "../trigger/trigger.vue";
import LinkageEquipmentPanel from "../LinkageEquipmentPanel/index.vue";
export default {
  name: "demo",
  components: { trigger, LinkageEquipmentPanel },
  data() {
    return {
      ruleForm: {
        linkageName: "",
        linkTrigger: [],
        linkTriggerEvens: [],
      },

      dataTemplate: {
        id: 1,
        // 触发器
        model: "",
        // 定时器表达式
        corn: "",
        // 属性事件功能
        attributeEventFunction: "",
        // 属性事件功能后面的框
        attributeEventFunctionVal: "",
        // 过滤条件
        filterKey: "",
        // 操作符
        operator: "",
        // 过滤条件值
        filterVal: "",
        // 设备（start）
        deviceId: null,
        deviceName: "",
        // 设备（end）
        // 属性/事件（star）
        indexE: null,
        identifier: "",
        names: "",
        // 属性/事件（ende）
        //
        filters: [{ id: 1, operator: "", propertyName: "", threshold: "" }],
      },
      dataTemplate2: {
        id: 1,
        propertyName: "",
        operator: "",
        threshold: "",
      },

      // 执行动作（start）
      // 执行动作数据模板
      linkTriggerEvens: {
        id: 1,
        // 执行类型（消息通知/设备输出）
        executor: "",
        // 设备id
        deviceId: "",
        // 设备名称
        deviceName: "",
        // 设置属性/调用功能
        messageType: "",
        // 物模型属性/功能 设置属性/调用功能 选择的名称
        propertyName: "",
        // 物模型属性/功能 设置属性/调用功能 对应的值
        propertyValue: "",
        // 方法名
        functionName: "",
        // 参数
        inputData: [],
      },
      // 联动执行类型 字典
      linkActionType: [],
      // 联动设备输出类型 字典
      linkDeviceSenderType: [],
      // 物模型属性/功能 面板数据
      panelAction: [],
      // 执行动作（end）

      // 设置子设备打开模块
      setModular: null,

      rules: {},

      // 控制设备面板的显示与隐藏
      isEquipmentPanel: false,
      // 打开的设备面板 index
      indexOpenEquipmentPanel: null,

      // 控制手动触发单选
      isSingleChoice: false,
      linkTriggerCondition: [],
      linkageTriggerType: [],
      linkTriggerOperator: [],
      linkageExecutionMode: [],
      linkageNotifyType: [],

      // 属性/事件
      attributeEvent: [],
    };
  },

  created() {
    this.getDictionaries("linkTriggerCondition", "link_trigger_condition");
    this.getDictionaries("linkageTriggerType", "linkage_trigger_type");
    this.getDictionaries("linkTriggerOperator", "link_trigger_operator");
    this.getDictionaries("linkActionType", "link_action_type");
    this.getDictionaries("linkDeviceSenderType", "link_device_sender_type");
  },

  mounted() {
    this.ruleForm.linkTrigger.push(this.deepClone(this.dataTemplate));
    this.ruleForm.linkTriggerEvens.push(this.deepClone(this.linkTriggerEvens));
  },

  methods: {
    // twoData 数据克隆
    deepClone(data) {
      if (data === null || typeof data !== "object") return data;
      let cloneData = Array.isArray(data) ? [] : {};
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          cloneData[key] = this.deepClone(data[key]);
        }
      }
      return cloneData;
    },

    // ----------------------------------------------------------------------------------------------
    // 执行动作（start）
    // 选择物模型的值
    objectModel(data, i) {
      this.panelAction.forEach((item) => {
        if (item.identifier == data) {
          this.ruleForm.linkTriggerEvens[i].inputData = this.deepClone(
            item.inputData
          ).map((item) => {
            item.parmName = item.name;
            item.parmValue = "";
            return item;
          });
        }
      });
    },

    // 请求属性/功能面板数据
    getTypeAction(data, i) {
      console.log("请求属性/功能面板数据", data);
      if (data == "INVOKE_FUNCTION") {
        getDeviceDeviceinfoFunctions(
          this.ruleForm.linkTriggerEvens[i].deviceId
        ).then((response) => {
          let { code, data } = response;
          if (code == 200) {
            this.panelAction = data.map((item) => {
              item.field = item.identifier;
              return item;
            });
          }
        });
      } else if (data == "WRITE_PROPERTY") {
        getDeviceDeviceinfoProperties(
          this.ruleForm.linkTriggerEvens[i].deviceId
        ).then((response) => {
          let { code, data } = response;
          if (code == 200) {
            this.panelAction = data;
          }
        });
      }
    },

    // 打开设备面板
    openEquipmentPanel2(i) {
      this.setModular = "action";
      this.indexOpenEquipmentPanel = i;
      this.isEquipmentPanel = !this.isEquipmentPanel;
    },

    // 删除
    deleteAction(i) {
      if (this.ruleForm.linkTriggerEvens.length <= 1) {
        this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
        return false;
      }
      this.ruleForm.linkTriggerEvens.splice(i, 1);
    },

    // 新增执行动作
    addActionBtn() {
      let data = this.ruleForm.linkTriggerEvens,
        dataT = this.linkTriggerEvens,
        id = data[data.length - 1].id;
      id += 1;
      dataT.id = id;
      this.ruleForm.linkTriggerEvens.push(this.deepClone(dataT));
    },
    // 执行动作（end）
    // ----------------------------------------------------------------------------------------------

    // 删除
    deleteA(i, is) {
      if (this.ruleForm.linkTrigger[i].filters.length <= 1) {
        this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
        return false;
      }
      this.ruleForm.linkTrigger[i].filters.splice(is, 1);
    },

    // 添加
    addO(i) {
      console.log("添加:", i);
      let dataT = this.dataTemplate2,
        dataS = this.ruleForm.linkTrigger[i].filters,
        id = dataS[dataS.length - 1].id;
      id += 1;
      dataT.id = id;

      this.ruleForm.linkTrigger[i].filters.push(this.deepClone(dataT));
    },

    // 请选择类型 后一个选框 选中值
    changeIdentifier(event, i) {
      this.attributeEvent.forEach((item) => {
        if (item.identifier == event) {
          this.ruleForm.linkTrigger[i].names = item.name;
        }
      });
    },

    // 请选择类型 选中值
    selectType(data, i) {
      console.log("请选择类型 选中值:", data, i);
      this.ruleForm.linkTrigger[this.indexOpenEquipmentPanel].indexE = data;

      if (
        this.ruleForm.linkTrigger[this.indexOpenEquipmentPanel].deviceId == null
      ) {
        return false;
      }

      if (data == 1) {
        // 属性
        getDeviceDeviceinfoProperties(
          this.ruleForm.linkTrigger[this.indexOpenEquipmentPanel].deviceId
        ).then((response) => {
          let { code, data } = response;
          if (code == 200) {
            console.log("getDeviceDeviceinfoProperties:", data);
            // this.attributeEvent = data;
            this.attributeEvent = data.properties;

            console.log(this.ruleForm.linkTrigger[i].filters);
          }
        });
      } else if (data == 2) {
        // 事件
        getDeviceDeviceinfoEvents(
          this.ruleForm.linkTrigger[this.indexOpenEquipmentPanel].deviceId
        ).then((response) => {
          let { code, data } = response;
          if (code == 200) {
            console.log("getDeviceDeviceinfoEvents:", data);
            this.ruleForm.linkTrigger[i].filters = [];
            this.attributeEvent = data;
          }
        });
      }
    },

    // 控制设备面板的显示与隐藏
    openEquipmentPanel(i) {
      this.setModular = "equipment";
      this.indexOpenEquipmentPanel = i;
      this.isEquipmentPanel = !this.isEquipmentPanel;
    },

    // 选择触发器 控制是否可以选择 手动触发
    changeTrigger(val) {
      if (val == 1) {
        this.isSingleChoice = true;
      }
      this.ruleForm.linkTrigger.forEach((item) => {
        if (item.model == 1) {
          console.log(159);
        } else {
          this.isSingleChoice = false;
        }
      });
    },

    // 获取字典数据
    getDictionaries(key, value) {
      this.getDicts(value).then((response) => {
        let { code, data } = response;
        if (code == 200) {
          this[key] = data;
          console.log(key, ":", data);
        }
      });
    },

    // 删除
    deleteTrigger(i) {
      if (this.ruleForm.linkTrigger.length <= 1) {
        this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
        return false;
      }
      this.ruleForm.linkTrigger.splice(i, 1);
    },

    // 接收子组件传过来的值
    triggers(data) {
      let { deviceId, deviceName, plugId, deviceCode } = data;
      if (this.setModular == "equipment") {
        this.ruleForm.linkTrigger[this.indexOpenEquipmentPanel].deviceId =
          deviceId;
        this.ruleForm.linkTrigger[this.indexOpenEquipmentPanel].deviceName =
          deviceName;
        this.ruleForm.linkTrigger[this.indexOpenEquipmentPanel].plugId = plugId;
        this.ruleForm.linkTrigger[this.indexOpenEquipmentPanel].deviceCode =
          deviceCode;
      } else if (this.setModular == "action") {
        this.ruleForm.linkTriggerEvens[this.indexOpenEquipmentPanel].deviceId =
          deviceId;
        this.ruleForm.linkTriggerEvens[
          this.indexOpenEquipmentPanel
        ].deviceName = deviceName;
        this.ruleForm.linkTriggerEvens[this.indexOpenEquipmentPanel].plugId =
          plugId;
        this.ruleForm.linkTriggerEvens[
          this.indexOpenEquipmentPanel
        ].deviceCode = deviceCode;
      }
      this.isEquipmentPanel = false;
    },

    // 添加触发器
    addTriggerBtn() {
      let datas = this.ruleForm.linkTrigger,
        id = datas[datas.length - 1].id,
        dataT = this.dataTemplate;
      id += 1;
      dataT.id = id;

      this.ruleForm.linkTrigger.push(this.deepClone(dataT));
    },

    // 确定
    onSubmit(i) {
      if (i == 0) {
        this.$emit("addPanel", false);
        return false;
      }

      let { linkTrigger, linkTriggerEvens } = this.ruleForm,
        newLinkTriggerCondition = [],
        newLinkTriggerEvens = [];

      linkTrigger.forEach((item) => {
        let linkTriggerType = item.model;

        if (linkTriggerType == "") {
          newLinkTriggerCondition.push({
            linkTriggerType: null,
          });
        } else if (linkTriggerType == 1) {
          newLinkTriggerCondition.push({
            linkTriggerType,
          });
        } else if (linkTriggerType == 2) {
          newLinkTriggerCondition.push({
            linkTriggerType,
            // corn表达式
            linkTriggerCron: item.corn,
          });
        } else if (linkTriggerType == 3) {
          if (item.indexE == 1) {
            newLinkTriggerCondition.push({
              linkTriggerType,
              // 设备相关
              triggerDevice: {
                // 选择的设备 id
                deviceId: item.deviceId,
                plugId: item.plugId,
                deviceCode: item.deviceCode,
                // 选择的设备 名称
                deviceName: item.deviceName,
                // 属性/事件
                type: "1",
                // 事件名（属性/事件后的选择框的值）
                eventName: "",
                // 属性列表
                filters: item.filters,
              },
            });
          } else if (item.indexE == 2) {
            newLinkTriggerCondition.push({
              linkTriggerType,
              // 设备相关
              triggerDevice: {
                // 选择的设备 id
                deviceId: item.deviceId,
                plugId: item.plugId,
                deviceCode: item.deviceCode,
                // 选择的设备 名称
                deviceName: item.deviceName,
                // 属性/事件
                type: "2",
                // 事件名（属性/事件后的选择框的值）
                eventName: item.identifier,
                // 属性列表
                filters: [],
              },
            });
          }
        }
      });

      linkTriggerEvens.forEach((item) => {
        if (item.executor == "1") {
          newLinkTriggerEvens.push({
            executor: item.executor,
            configuration: {
              deviceId: item.deviceId,
              plugId: item.plugId,
              deviceCode: item.deviceCode,
              deviceName: item.deviceName,
              messageType: item.messageType,

              functionName:
                item.messageType == "INVOKE_FUNCTION" ? item.propertyName : "",
              inputs:
                item.messageType == "INVOKE_FUNCTION"
                  ? item.inputData.map((items) => {
                      return {
                        field: items.field,
                        names: items.name,
                        parmName: items.field,
                        parmValue: items.parmValue,
                      };
                    })
                  : [],
              properties:
                item.messageType == "WRITE_PROPERTY"
                  ? {
                      propertyName: item.propertyName,
                      propertyValue: item.propertyValue,
                    }
                  : {},
            },
          });
        } else if (item.executor == "2") {
          console.log("开发中");
          return false;
        }
      });

      let postData = {
        linkName: this.ruleForm.linkageName,
        linkTrigger: newLinkTriggerCondition,
        linkTriggerEvens: newLinkTriggerEvens,
      };

      postLinkConfig(postData).then((response) => {
        if (response.code == 200) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.ruleForm = {
            linkageName: "",
            linkTrigger: [],
            linkTriggerEvens: [],
          };
          this.ruleForm.linkTrigger.push(this.deepClone(this.dataTemplate));
          this.ruleForm.linkTriggerEvens.push(
            this.deepClone(this.linkTriggerEvens)
          );
          this.$emit("addPanel", false);
        }
      });
    },
  },
};
</script>

<style scoped>
.back_box {
  background-color: #eee;
  padding: 1vh 0;
  box-sizing: border-box;
}

.titles_box {
  margin-left: 3vw;
}

.titles_box > span:last-child {
  margin-left: 2vw;
  color: #0000ff;
  cursor: pointer;
}

.color_blue {
  color: #0000ff;
}

.cursor_pointer {
  cursor: pointer;
}

.margin_top_2 {
  margin-top: 2vh;
}

.margin_top_3 {
  margin-top: 3vh;
}

.margin_top_5 {
  margin-top: 5vh;
}

.margin_left_-3 {
  margin-left: -3vw;
}

.title_text {
  font-weight: 600;
}

.btns_box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* ----------------------------------------------------------------------------- */
.margin_top_1 {
  margin-top: 1vh;
}

.margin_left_1 {
  margin-left: 1vw;
}

.margin_left_2 {
  margin-left: 2vw;
}

.padding_left_3 {
  padding-left: 3vw;
}

::v-deep .el-input__inner {
  height: 37px !important;
  line-height: 37px !important;
}
</style>