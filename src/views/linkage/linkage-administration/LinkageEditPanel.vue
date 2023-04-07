<!--
 * @Author: MJ
 * @Date: 2021-07-30 11:23:56
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-06-01 17:06:30
 * @Description: 
-->
<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" @close="closeGetList">
      <el-form :model="editDetails" :rules="rules" ref="ruleForm">
        <el-form-item
          label="联动名称"
          prop="linkName"
        >
          <el-input
            v-model="editDetails.linkName"
            placeholder="请输入联动名称"
            size="small"
          >
          </el-input>
        </el-form-item>

        <!-- 触发条件 -->
        <el-form-item>
          <touch-condition-form
            :editDetailsData="editDetails"
            :linkTriggerConditionData="linkTriggerCondition"
            :linkageTriggerTypeData="linkageTriggerType"
            :linkTriggerOperatorData="linkTriggerOperator"
          ></touch-condition-form>
        </el-form-item>

        <!-- 执行动作 -->
        <el-form-item label="" prop="linkTriggerEvens" style="margin-top: 2vh">
          <executea-ation-form
            :editDetailsData="editDetails"
            :linkActionTypeData="linkActionType"
            :linkDeviceSenderTypeData="linkDeviceSenderType"
            :noticeTypeData="noticeType"
          ></executea-ation-form>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="margin_top_2 btns_box">
          <el-button @click="closeopen">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getLinkConfigDetail,
  getDeviceDeviceinfoProperties,
  getDeviceDeviceinfoEvents,
  getDeviceDeviceinfoFunctions,
  putLinkConfig,
  postLinkConfig,
  getNoticeNoticeConfigV1List,
  getNoticeNoticeTemplateV1List,
} from "@/api/linkage/linkageAdministration";

import TouchConditionForm from "./TouchConditionForm.vue";
import ExecuteaAtionForm from ".//ExecuteaAtionForm.vue";
export default {
  name: "LinkageEditPanel",
  components: {
    TouchConditionForm,
    ExecuteaAtionForm,
  },
  props: {},
  data() {
    return {
      // 控制编辑面板的显示与隐藏
      open: false,
      title: "",
      actionId: "",
      editDetails: {
        linkName: "",
        linkTrigger: [
          {
            actionId: "",
            ids: 1,
            linkTriggerCron: "",
            linkTriggerLinkIds: "",
            linkTriggerType: "",
            triggerDevice: {
              deviceId: null,
              plugId: "",
              deviceCode: "",
              deviceName: "",
              eventName: "",
              eventType: null,
              type: "",
              filters: [
                {
                  id: 1,
                  operator: "",
                  propertyName: "",
                  threshold: "",
                },
              ],
            },
          },
        ],
        linkTriggerEvens: [
          {
            ids: 1,
            executor: "",
            configuration: {
              deviceId: null,
              deviceName: null,
              messageType: null,
              functionName: null,
              inputs: [],
              noticeType: null, // 通知类型
              noticeConfigId: null, // 通知配置
              serviceProvider: null, // 通知配置服务
              noticeConfigName: null,
              noticeTemplateId: null, // 通知模板
              noticeTemplateName: null,
              properties: {
                propertyName: null,
                propertyValue: null,
              },
            },
          },
        ],
      },
      // 验证规则
      rules: {
        linkName: [
          { required: true, message: "请输入联动名称", trigger: "blur" },
        ],
      },
      // 打开设备面板时保存当前打开的下标值
      indexOpenEquipmentPanel: null,
      // 触发条件/执行动作 作用：因为触发条件和执行动作使用的是同一个设备面板，所以需要做一下标记
      setModular: "equipment",

      // 触发条件（start）
      // 请选择类型 后一个选框 面板（选项）的值
      deviceDeviceinfoProperties: [], // 属性
      deviceDeviceinfoEvents: [], // 事件
      linkActionType: [], // 动作类型
      linkTriggerOperator: [], // 操作符
      linkTriggerCondition: [], // 触发器
      linkDeviceSenderType: [], // 类型
      // 触发条件（end）

      // 字典（start）
      // 触发方式
      linkTrigger: [],
      // 选择类型
      linkageTriggerType: [],
      // 通知类型（哪个社交软件）
      noticeType: [],
      // 字典（end）
      // 类型
      panelAction: [],
      // -------------------------------
    };
  },

  watch: {},

  created() {
    // this.getDetails(this.actionId);
    this.getDictionaries("linkTriggerCondition", "link_trigger_condition");
    this.getDictionaries("linkageTriggerType", "linkage_trigger_type");
    this.getDictionaries("linkActionType", "link_action_type");
    this.getDictionaries("linkTriggerOperator", "link_trigger_Operator");
    this.getDictionaries("linkDeviceSenderType", "link_device_sender_type");
    this.getDictionaries("noticeType", "notice_type");
  },

  methods: {
    // 表单重置
    reset() {
      this.editDetails = {
        linkName: "",
        linkTrigger: [
          {
            actionId: "",
            ids: 1,
            linkTriggerCron: "",
            linkTriggerLinkIds: "",
            linkTriggerType: "",
            triggerDevice: {
              deviceId: null,
              plugId: "",
              deviceCode: "",
              deviceName: "",
              eventName: "",
              eventType: null,
              type: "",
              filters: [
                {
                  id: 1,
                  operator: "",
                  propertyName: "",
                  threshold: "",
                },
              ],
            },
          },
        ],
        linkTriggerEvens: [
          {
            ids: 1,
            executor: "",
            configuration: {
              deviceId: null,
              deviceName: null,
              messageType: null,
              functionName: null,
              inputs: [],
              noticeType: null, // 通知类型
              noticeConfigId: null, // 通知配置
              serviceProvider: null, // 通知配置服务
              noticeConfigName: null,
              noticeTemplateId: null, // 通知模板
              noticeTemplateName: null,
              properties: {
                propertyName: null,
                propertyValue: null,
              },
            },
          },
        ],
      };
      this.resetForm("ruleForm");
    },
    add() {
      this.reset();
      this.actionId = null;
      this.open = true;
    },
    edit(id) {
      this.reset();
      this.actionId = id;
      this.getDetails(id);
      this.open = true;
    },
    // 获取详情页数据
    getDetails(id) {
      let that = this;
      getLinkConfigDetail({ actionId: id }).then((response) => {
        let { code, data } = response;
        if (code == 200) {
          that.editDetails.linkName = data.linkName;
          that.editDetails.linkTrigger = data.linkTrigger.map((item, i) => {
            let triggerDevice = item.triggerDevice,
              triggerDevices = item.triggerDevices,
              linkTriggerType = item.linkTriggerType;

            if (triggerDevice != null) {
              this.encapsulationPropertiesEvents(
                triggerDevice,
                triggerDevices,
                linkTriggerType,
                i
              );
            }

            if (item.linkTriggerType == 1 || item.linkTriggerType == 2) {
              item.triggerDevice = {
                deviceId: null,
                deviceName: "",
                eventName: "",
                filters: [
                  {
                    id: 1,
                    operator: "",
                    propertyName: "",
                    threshold: "",
                  },
                ],
                type: "",
              };
              item.triggerDevices = [];
            }

            item.ids = i + 1;
            return item;
          });

          that.$nextTick(() => {
            that.editDetails.linkTriggerEvens = data.linkTriggerEvens.map(
              (item, i) => {
                let { messageType, deviceId } = item.configuration;
                if (item.executor == 2) {
                  that.getNoticeType(item.configuration.noticeType, i, 0);
                  that.getNoticeConfig(
                    item.configuration.serviceProvider,
                    i,
                    0
                  );
                }
                that.$nextTick(() => {
                  that.encapsulationTypes(messageType, deviceId, i);
                });
                item.ids = i + 1;
                that.selectType(i);
                return item;
              }
            );
          });
        }
      });
    },

    // 封装属性/事件 后面 选择框 的 面板数据
    encapsulationPropertiesEvents(data, linkTriggerType, i) {
      let { deviceId, type } = data,
        that = this;
      that.$nextTick(() => {
        if (linkTriggerType == 3 && type == 1) {
          deviceId = deviceId.split(",")[0];
          getDeviceDeviceinfoProperties(deviceId).then((response) => {
            let { code, data } = response;
            if (code == 200) {
              that.$set(
                that.editDetails.linkTrigger[i],
                "deviceDeviceinfoProperties",
                data
              );
            }
          });
        } else if (linkTriggerType == 3 && type == 2) {
          deviceId = deviceId.split(",")[0];
          getDeviceDeviceinfoEvents(deviceId).then((response) => {
            let { code, data } = response;
            if (code == 200) {
              that.$set(
                that.editDetails.linkTrigger[i],
                "deviceDeviceinfoEvents",
                data
              );
            }
          });
        }
      });
    },

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

    // 获取字典数据
    getDictionaries(key, value) {
      this.getDicts(value).then((response) => {
        let { code, data } = response;
        if (code == 200) {
          this[key] = data;
        }
      });
    },
    // 取消
    closeopen() {
      this.open = false;
    },
    // 提交
    onSubmit() {
      if (this.title == "编辑") {
        let { linkTrigger, linkTriggerEvens } = this.editDetails,
          newLinkTriggerCondition = [],
          newLinkTriggerEvens = [];

        // 触发条件
        linkTrigger.forEach((item) => {
          let linkTriggerType = item.linkTriggerType;

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
              linkTriggerCron: item.linkTriggerCron,
            });
          } else if (linkTriggerType == 3) {
            if (item.triggerDevice.type == 1) {
              newLinkTriggerCondition.push({
                linkTriggerType,
                // 设备相关
                triggerDevice: {
                  // 选择的设备 id
                  deviceId: item.triggerDevice.deviceId,
                  plugId: item.triggerDevice.plugId,
                  deviceCode: item.triggerDevice.deviceCode,
                  // 选择的设备 名称
                  deviceName: item.triggerDevice.deviceName,
                  // 属性/事件
                  type: "1",
                  // 属性列表
                  filters: item.triggerDevice.filters,
                },
                triggerDevices: item.triggerDevices,
              });
            } else if (item.triggerDevice.type == 2) {
              newLinkTriggerCondition.push({
                linkTriggerType,
                // 设备相关
                triggerDevice: {
                  // 选择的设备 id
                  deviceId: item.triggerDevice.deviceId,
                  plugId: item.triggerDevice.plugId,
                  deviceCode: item.triggerDevice.deviceCode,
                  // 选择的设备 名称
                  deviceName: item.triggerDevice.deviceName,
                  // 属性/事件
                  type: "2",
                  // 事件名（属性/事件后的选择框的值）
                  eventName: item.triggerDevice.eventName,
                  eventType: item.triggerDevice.eventType,
                },
                triggerDevices: item.triggerDevices,
              });
            }
          }
        });

        // 执行动作
        linkTriggerEvens.forEach((item) => {
          if (item.executor == "1") {
            newLinkTriggerEvens.push({
              executor: item.executor,
              configuration: {
                deviceId: item.configuration.deviceId,
                plugId: item.configuration.plugId,
                deviceCode: item.configuration.deviceCode,
                deviceName: item.configuration.deviceName,
                messageType: item.configuration.messageType,

                functionName:
                  item.configuration.messageType == "INVOKE_FUNCTION"
                    ? item.configuration.functionName
                    : "",
                inputs:
                  item.configuration.messageType == "INVOKE_FUNCTION"
                    ? item.configuration.inputs.map((items) => {
                        return {
                          field: items.field,
                          names: items.names,
                          parmName: items.field,
                          parmValue: items.parmValue,
                        };
                      })
                    : [],
                properties:
                  item.configuration.messageType == "WRITE_PROPERTY"
                    ? {
                        propertyName:
                          item.configuration.properties.propertyName,
                        propertyValue:
                          item.configuration.properties.propertyValue,
                      }
                    : {},
              },
            });
          } else if (item.executor == "2") {
            newLinkTriggerEvens.push({
              executor: item.executor,
              configuration: {
                noticeType: item.configuration.noticeType, // 通知类型

                noticeConfigId: item.configuration.noticeConfigId, // 通知配置
                serviceProvider: item.configuration.serviceProvider, // 通知配置服务
                noticeConfigName: item.configuration.noticeConfigName, // 通知配置名称

                noticeTemplateId: item.configuration.noticeTemplateId, // 通知模板ID
                noticeTemplateName: item.configuration.noticeTemplateName, // 通知模板名称

                functionName:
                  item.configuration.messageType == "INVOKE_FUNCTION"
                    ? item.configuration.functionName
                    : "",
                inputs:
                  item.configuration.messageType == "INVOKE_FUNCTION"
                    ? item.configuration.inputs.map((items) => {
                        return {
                          field: items.field,
                          names: items.names,
                          parmName: items.field,
                          parmValue: items.parmValue,
                        };
                      })
                    : [],
                properties:
                  item.configuration.messageType == "WRITE_PROPERTY"
                    ? {
                        propertyName:
                          item.configuration.properties.propertyName,
                        propertyValue:
                          item.configuration.properties.propertyValue,
                      }
                    : {},
              },
            });
          }
        });
        let putData = {
          actionId: this.actionId,
          linkName: this.editDetails.linkName,
          linkTrigger: newLinkTriggerCondition,
          linkTriggerEvens: newLinkTriggerEvens,
        };

        putLinkConfig(putData).then((response) => {
          if (response.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.ruleForm = {
              actionId: null,
              linkName: "",
              linkTrigger: [],
              linkTriggerEvens: [],
            };
            this.$emit("ok");
            this.open = false;
          }
        });
      } else if (this.title == "新增") {
        let { linkTrigger, linkTriggerEvens } = this.editDetails,
          newLinkTriggerCondition = [],
          newLinkTriggerEvens = [];

        // 触发条件
        linkTrigger.forEach((item) => {
          let linkTriggerType = item.linkTriggerType;

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
              linkTriggerCron: item.linkTriggerCron,
            });
          } else if (linkTriggerType == 3) {
            if (item.triggerDevice.type == 1) {
              newLinkTriggerCondition.push({
                linkTriggerType,
                // 设备相关
                triggerDevice: {
                  // 选择的设备 id
                  deviceId: item.triggerDevice.deviceId,
                  plugId: item.triggerDevice.plugId,
                  deviceCode: item.triggerDevice.deviceCode,
                  // 选择的设备 名称
                  deviceName: item.triggerDevice.deviceName,
                  // 属性/事件
                  type: "1",
                  // 属性列表
                  filters: item.triggerDevice.filters,
                },
                triggerDevices: item.triggerDevices,
              });
            } else if (item.triggerDevice.type == 2) {
              newLinkTriggerCondition.push({
                linkTriggerType,
                // 设备相关
                triggerDevice: {
                  // 选择的设备 id
                  deviceId: item.triggerDevice.deviceId,
                  plugId: item.triggerDevice.plugId,
                  deviceCode: item.triggerDevice.deviceCode,
                  // 选择的设备 名称
                  deviceName: item.triggerDevice.deviceName,
                  // 属性/事件
                  type: "2",
                  // 事件名（属性/事件后的选择框的值）
                  eventName: item.triggerDevice.eventName,
                  eventType: item.triggerDevice.eventType,
                  // 属性列表
                  filters: [],
                },
                triggerDevices: item.triggerDevices,
              });
            }
          }
        });

        // 执行动作
        linkTriggerEvens.forEach((item) => {
          if (item.executor == "") {
            newLinkTriggerEvens.push({
              executor: null,
            });
          } else if (item.executor == "1") {
            newLinkTriggerEvens.push({
              executor: item.executor,
              configuration: {
                deviceId: item.configuration.deviceId,
                plugId: item.configuration.plugId,
                deviceCode: item.configuration.deviceCode,
                deviceName: item.configuration.deviceName,
                messageType: item.configuration.messageType,

                functionName:
                  item.configuration.messageType == "INVOKE_FUNCTION"
                    ? item.configuration.functionName
                    : "",
                inputs:
                  item.configuration.messageType == "INVOKE_FUNCTION"
                    ? item.configuration.inputs.map((items) => {
                        return {
                          field: items.field,
                          names: items.names,
                          parmName: items.field,
                          parmValue: items.parmValue,
                        };
                      })
                    : [],
                properties:
                  item.configuration.messageType == "WRITE_PROPERTY"
                    ? {
                        propertyName:
                          item.configuration.properties.propertyName,
                        propertyValue:
                          item.configuration.properties.propertyValue,
                      }
                    : {},
              },
              configurations: item.configurations,
            });
          } else if (item.executor == "2") {
            newLinkTriggerEvens.push({
              executor: item.executor,
              configuration: {
                deviceId: item.configuration.deviceId || null,
                plugId: item.configuration.plugId || null,
                deviceCode: item.configuration.deviceCode || null,
                deviceName: item.configuration.deviceName,
                messageType: item.configuration.messageType,
                noticeType: item.configuration.noticeType, // 通知类型
                noticeConfigId: item.configuration.noticeConfigId, // 通知配置
                serviceProvider: item.configuration.serviceProvider, // 通知配置服务
                noticeConfigName: item.configuration.noticeConfigName, // 通知配置名称
                noticeTemplateId: item.configuration.noticeTemplateId, // 通知模板
                noticeTemplateName: item.configuration.noticeTemplateName,

                functionName:
                  item.configuration.messageType == "INVOKE_FUNCTION"
                    ? item.configuration.functionName
                    : "",
                inputs:
                  item.configuration.messageType == "INVOKE_FUNCTION"
                    ? item.configuration.inputs.map((items) => {
                        return {
                          field: items.field,
                          names: items.names,
                          parmName: items.field,
                          parmValue: items.parmValue,
                        };
                      })
                    : [],
                properties:
                  item.configuration.messageType == "WRITE_PROPERTY"
                    ? {
                        propertyName:
                          item.configuration.properties.propertyName,
                        propertyValue:
                          item.configuration.properties.propertyValue,
                      }
                    : {},
              },
              configurations: item.configurations,
            });
          }
        });
        let postData = {
          actionId: this.actionId,
          linkName: this.editDetails.linkName,
          linkTrigger: newLinkTriggerCondition,
          linkTriggerEvens: newLinkTriggerEvens,
        };

        postLinkConfig(postData).then((response) => {
          if (response.code == 200) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.$emit("ok");
            this.ruleForm = {
              linkageName: "",
              linkTrigger: [],
              linkTriggerEvens: [],
            };
            this.ruleForm.linkTrigger.push(this.deepClone(this.dataTemplate));
            this.ruleForm.linkTriggerEvens.push(
              this.deepClone(this.linkTriggerEvens)
            );
            this.open = false;
          }
        });
      }
    },

    // 触发条件（status）

    // 选择属性/事件
    selectType(i) {
      let datas = this.editDetails.linkTrigger[i],
        triggerDevice = datas.triggerDevice,
        // triggerDevices = datas.triggerDevices,
        linkTriggerType = datas.linkTriggerType;

      this.encapsulationPropertiesEvents(triggerDevice, linkTriggerType, i);
    },

    // 删除触发器
    deleteTrigger(i) {
      if (this.editDetails.linkTrigger.length <= 1) {
        this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
        return false;
      }
      this.editDetails.linkTrigger.splice(i, 1);
    },
    // 触发条件（end）

    // 执行动作（start）

    // 根据选择的通知方式请求数据
    getNoticeType(val, i, type) {
      getNoticeNoticeConfigV1List(val).then((response) => {
        this.$set(
          this.editDetails.linkTriggerEvens[i],
          "noticeConfig",
          response.data
        );

        if (type != 0) {
          this.editDetails.linkTriggerEvens[i].configuration.noticeConfigId =
            null;
          this.editDetails.linkTriggerEvens[i].configuration.noticeConfigName =
            null;
          this.editDetails.linkTriggerEvens[i].configuration.noticeTemplateId =
            null;
          this.editDetails.linkTriggerEvens[
            i
          ].configuration.noticeTemplateName = null;
          this.editDetails.linkTriggerEvens[i].configuration.serviceProvider =
            null;
        }
      });
    },

    // 根据服务商获取列表
    getNoticeConfig(val, i, type = 0) {
      if (type == 1) {
        this.editDetails.linkTriggerEvens[i].noticeConfig.forEach((item) => {
          if (item.id == val) {
            val = item.serviceProvider;
          }
        });
      }

      getNoticeNoticeTemplateV1List(val).then((response) => {
        this.$set(
          this.editDetails.linkTriggerEvens[i],
          "noticeTemplate",
          response.data
        );

        if (type == 1) {
          this.editDetails.linkTriggerEvens[i].noticeConfig.forEach((item) => {
            if (item.serviceProvider == val) {
              this.editDetails.linkTriggerEvens[
                i
              ].configuration.serviceProvider = item.serviceProvider;
              this.editDetails.linkTriggerEvens[
                i
              ].configuration.noticeConfigName = item.name;
            }
          });
        }
      });
    },

    // 封装选择类型
    encapsulationTypes(val, deviceId, i) {
      if (val == "INVOKE_FUNCTION") {
        deviceId = deviceId ? deviceId.split(",")[0] : "";
        getDeviceDeviceinfoFunctions(deviceId).then((response) => {
          let { code, data } = response;
          if (code == 200) {
            this.$set(
              this.editDetails.linkTriggerEvens[i],
              "invokeFunction",
              data
            );
          }
        });
      } else if (val == "WRITE_PROPERTY") {
        deviceId = deviceId ? deviceId.split(",")[0] : "";
        getDeviceDeviceinfoProperties(deviceId).then((response) => {
          let { code, data } = response;
          if (code == 200) {
            this.$set(
              this.editDetails.linkTriggerEvens[i],
              "writeProperty",
              data
            );
          }
        });
      }
    },
    // 执行动作（end）
    closeGetList() {
      //   this.$emit("ok");
    },
  },
};
</script>

<style lang="scss" scoped>
.margin_top_2 {
  margin-top: 2vh;
}

.btns_box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

::v-deep .el-input__inner {
  height: 37px !important;
  line-height: 37px !important;
}
</style>
