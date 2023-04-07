<!--
 * @Author: MJ
 * @Date: 2021-08-05 18:01:11
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-15 15:44:39
 * @Description:
-->
<template>
  <div>
    <el-form :model="templateData" :rules="rules" ref="templateData" label-width="100px">
      <el-form-item label="告警名称" prop="alarmName">
        <el-input
          v-model="templateData.alarmName"
          placeholder="请输入告警名称"
          :rules="rules.alarmName"
        ></el-input>
      </el-form-item>

      <el-form-item label="告警等级" prop="alarmLevel">
        <el-select
          v-model="templateData.alarmLevel"
          placeholder="请选择告警等级"
          :rules="rules.alarmLevel"
        >
          <el-option
            v-for="items in managerLevel"
            :key="items.dictValue"
            :label="items.dictLabel"
            v-model="items.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-row>
          <el-col>触发条件</el-col>
        </el-row>

        <div class="trigger_condition_box">
          <div
            class="trigger_condition_item margin_top_1 padding_tb_3"
            v-for="(item, i) in templateData.conditions"
            :key="item.id"
          >
            <el-row :gutter="1">
              <el-col :span="2">触发条件：{{ item.id }}</el-col>
              <el-col :span="1">
                <span class="delete_box" @click="deleteTrigger(i)">删除</span>
              </el-col>
            </el-row>

            <!-- 请选择触发条件 -->
            <el-row>
              <el-col>
                <el-select
                  v-model="item.alarmTriggerType"
                  placeholder="请选择触发条件"
                  disabled
                >
                  <el-option
                    v-for="items in linkTriggerCondition"
                    :key="items.dictValue"
                    :label="items.dictLabel"
                    v-model="items.dictValue"
                  />
                </el-select>
              </el-col>
            </el-row>

            <!-- 请选择类型 -->
            <el-row class="margin_top_1">
              <el-col :span="5">
                <el-form-item :prop="`conditions[${i}].type`" :rules="rules.type">
                  <el-select
                    v-model="item.type"
                    placeholder="请选择类型"
                    @change="typeEP(i)"
                  >
                    <el-option
                      v-for="items in linkageTriggerType"
                      :key="items.dictValue"
                      :label="items.dictLabel"
                      v-model="items.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 选择事件后展示 -->
              <el-col :span="5" v-show="item.type == 2">
                <el-form-item
                  :prop="`conditions[${i}].eventType`"
                  :rules="rules.eventType"
                  ref="eventType"
                >
                  <el-select
                    v-model="item.eventType"
                    placeholder=""
                    @change="eventTN($event, i)"
                  >
                    <el-option
                      v-for="items in events"
                      :key="items.identifier"
                      :label="items.eventName"
                      v-model="items.eventType"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 选择属性后展示 -->
            <el-row class="padding_left_3" v-show="item.type == 1">
              <el-col>
                <el-row
                  v-for="(items, is) in item.filters"
                  :key="items.id"
                  class="margin_top_2"
                >
                  <el-col :span="5">
                    <el-form-item
                      :prop="`conditions[${i}].filters[${is}].propertyName`"
                      :rules="rules.propertyName"
                      ref="propertyName"
                    >
                      <el-select
                        v-model="items.propertyName"
                        placeholder=""
                        @change="changeProperty($event, i, is)"
                      >
                        <el-option
                          v-for="itemss in properties"
                          :key="itemss.field"
                          :label="itemss.name"
                          v-model="itemss.field"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <!-- 操作符 -->
                  <el-col :span="5">
                    <el-form-item
                      :prop="`conditions[${i}].filters[${is}].operator`"
                      :rules="rules.operator"
                      ref="operator"
                    >
                      <el-select
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
                    </el-form-item>
                  </el-col>

                  <!-- 过滤值 -->
                  <el-col :span="5">
                    <el-form-item
                      :prop="`conditions[${i}].filters[${is}].threshold`"
                      :rules="rules.threshold"
                      ref="threshold"
                    >
                      <el-input
                        style="width: 13.8rem"
                        v-model="items.threshold"
                        placeholder="请输入过滤值"
                        clearable
                        size="small"
                      />
                    </el-form-item>
                  </el-col>

                  <span class="cursor_pointer delete_box" @click.stop="deleteA(i, is)">
                    删除
                  </span>
                </el-row>
              </el-col>

              <el-col :span="2" class="margin_top_2">
                <el-button type="primary" @click="addFilter(i)">添加过滤条件</el-button>
              </el-col>
            </el-row>
          </div>

          <div class="margin_top_1" style="padding-left: 3.1vw">
            <el-button type="primary" @click="addTrigger">新增触发条件</el-button>
          </div>
        </div>
      </el-form-item>

      <!-- *************************************消息通知-start******************************************* -->
      <el-form-item style="margin-top: 3.6vh">
        <el-row>
          <el-col>消息通知</el-col>
        </el-row>

        <div class="trigger_condition_box">
          <div
            class="trigger_condition_item margin_top_1 padding_tb_3"
            v-for="(item, i) in templateData.alarmNotices"
            :key="item.id"
          >
            <el-row :gutter="1">
              <el-col :span="2">消息通知：{{ item.id }}</el-col>
              <el-col :span="1">
                <span class="delete_box" @click="deleteNotice(i)">删除</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col style="width: 13.8rem">
                <el-form-item
                  :prop="`alarmNotices[${i}].noticeType`"
                  :rules="rules.noticeType"
                >
                  <el-select
                    v-model="item.noticeType"
                    @change="getNoticeType($event, i)"
                    placeholder="选择通知类型"
                  >
                    <el-option
                      v-for="items in noticeType"
                      :key="items.dictValue"
                      :label="items.dictLabel"
                      v-model="items.dictValue"
                      :disabled="items.disabled"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col
                style="width: 13.8rem; margin-left: 1vw"
                v-if="item.noticeType != null"
              >
                <el-form-item
                  :prop="`alarmNotices[${i}].noticeConfigId`"
                  :rules="rules.noticeConfigId"
                >
                  <template>
                    <el-select
                      v-model="item.noticeConfigId"
                      @change="getNoticeConfig($event, i)"
                      placeholder="选择通知配置"
                    >
                      <el-option
                        v-for="items in item.noticeConfig"
                        :key="items.id"
                        :label="items.name"
                        v-model="items.id"
                      />
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>

              <el-col
                style="width: 13.8rem; margin-left: 1vw"
                v-if="item.noticeType != null && item.noticeConfigId != null"
              >
                <el-form-item
                  :prop="`alarmNotices[${i}].noticeTemplateId`"
                  :rules="rules.noticeTemplateId"
                >
                  <template>
                    <el-select v-model="item.noticeTemplateId" placeholder="选择通知模板">
                      <el-option
                        v-for="items in item.noticeTemplate"
                        :key="items.id"
                        :label="items.name"
                        v-model="items.id"
                      />
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="margin_top_1" style="padding-left: 3.1vw">
            <el-button type="primary" @click="newAddNotice">新增通知</el-button>
          </div>
        </div>
      </el-form-item>
      <!-- *************************************消息通知-end******************************************* -->

      <el-form-item style="text-align: right">
        <el-button @click.stop="panelBtn(0)">取消</el-button>
        <el-button @click.stop="panelBtn(1)" type="primary">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getDeviceDevicetypeProperties,
  getDeviceDevicetypeEvents,
  postDeviceAlarm,
} from "@/api/device/deviceClasses";

import {
  getNoticeNoticeConfigV1List,
  getNoticeNoticeTemplateV1List,
} from "@/api/subsystem/linkageAdministration";

export default {
  name: "ThingAddSetTingPanel",
  props: {
    inforDetails: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      // 数据收集
      templateData: {
        alarmName: "", // 告警名称
        alarmLevel: "", // 告警等级
        deviceTypeId: null, // 设备 id 对应详情数据的 deviceTypeId 字段
        subsystemCode: null,
        isStatus: 0, // 设备状态（默认为0，即开起状态）
        messageNotification: "", // 消息通知
        conditions: [
          {
            id: 1,
            alarmTriggerType: "3", // 触发类型
            type: "", // 属性/事件
            eventType: "", // 事件触发类型
            filters: [
              {
                id: 1,
                propertyName: "", // 过滤条件
                type: "", // 数据类型
                operator: "", // 操作符
                threshold: null, // 输入值
              },
            ],
          },
        ],
        alarmNotices: [
          {
            id: 1,
            alarmId: "",
            noticeType: null,
            noticeConfigId: null,
            noticeTemplateId: null,
          },
        ],
      },
      // 验证
      rules: {
        alarmName: [
          { required: true, message: "请输入告警名称", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        alarmLevel: [{ required: true, message: "请选择告警等级", trigger: "change" }],
        type: [
          { required: true, message: "请选择类型", trigger: "change" },
          //
        ],
        eventType: [
          { required: true, message: "请选择", trigger: "change" },
          //
        ],
        propertyName: [
          { required: true, message: "请选择", trigger: "change" },
          //
        ],
        operator: [
          { required: true, message: "请选择操作符", trigger: "change" },
          //
        ],
        threshold: [
          { required: true, message: "请输入过滤值", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        noticeType: [
          { required: true, message: "选择通知类型", trigger: "change" },
          //
        ],
        noticeConfigId: [
          { required: true, message: "选择通知类型", trigger: "change" },
          //
        ],
        noticeTemplateId: [
          { required: true, message: "选择通知类型", trigger: "change" },
          //
        ],
      },

      // 字典 告警等级
      managerLevel: [],
      // 字典 触发类型
      linkTriggerCondition: [],
      // 字典 类型
      linkageTriggerType: [],
      // 字典 操作符
      linkTriggerOperator: [],

      // 属性面板数据
      properties: [],
      // 事件面板数据
      events: [],
      // 通知类型（哪个社交软件）
      noticeType: [],
    };
  },

  watch: {
    inforDetails: {
      handler(newVal) {
        this.templateData.deviceTypeId = newVal.deviceTypeId;
      },
    },
  },

  mounted() {
    this.templateData.deviceTypeId = this.inforDetails.deviceTypeId;
    this.templateData.subsystemCode = this.inforDetails.systemId;
    this.getDictionaries("managerLevel", "manager_level");
    this.getDictionaries("linkTriggerCondition", "link_trigger_condition");
    this.getDictionaries("linkageTriggerType", "linkage_trigger_type");
    this.getDictionaries("linkTriggerOperator", "link_trigger_Operator");
    this.getDicts("notice_type").then((response) => {
      this.noticeType = response.data.map((item) => {
        item.disabled = item.dictValue == "all" ? true : false;
        return item;
      });
    });
    this.propertiesEvents(this.inforDetails.deviceTypeId);
  },

  methods: {
    // 获取字典数据
    getDictionaries(key, value) {
      this.getDicts(value).then((response) => {
        this[key] = response.data;
      });
    },

    // 获取 属性/事件 面板数据
    propertiesEvents(id) {
      getDeviceDevicetypeProperties(id).then((response) => {
        this.properties = response.data;
      });

      getDeviceDevicetypeEvents(id).then((response) => {
        this.events = response.data;
      });
    },

    // 处理选框
    changeProperty(e, i, is) {
      this.properties.forEach((item) => {
        if (item.field == e) {
          this.templateData.conditions[i].filters[is].type = item.dataType.type;
        }
      });
    },

    // 删除通知
    deleteNotice(i) {
      if (this.templateData.alarmNotices.length <= 1) {
        return this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
      }
      this.templateData.alarmNotices.splice(i, 1);
    },

    // 新增通知
    newAddNotice() {
      let datas = this.templateData.alarmNotices,
        id = datas[datas.length - 1].id;
      id += 1;
      this.templateData.alarmNotices.push({
        id,
        alarmId: "",
        noticeType: null,
        noticeConfigId: null,
        noticeTemplateId: null,
      });
    },

    // 根据选择的通知方式请求数据
    getNoticeType(val, i) {
      getNoticeNoticeConfigV1List(val).then((response) => {
        this.$set(this.templateData.alarmNotices[i], "noticeConfig", response.data);
      });
    },

    // 根据服务商获取列表
    getNoticeConfig(val, i) {
      let serviceProvider = null;

      this.templateData.alarmNotices[i].noticeConfig.forEach((item) => {
        if (item.id == val) {
          serviceProvider = item.serviceProvider;
        }
      });

      getNoticeNoticeTemplateV1List(serviceProvider).then((response) => {
        this.$set(this.templateData.alarmNotices[i], "noticeTemplate", response.data);
      });
    },

    // 重置类型
    typeEP(i) {
      this.templateData.conditions[`${i}`].eventType = "";
      this.$refs.eventType[`${i}`].clearValidate();

      this.$set(this.templateData.conditions[`${i}`], "filters", [
        {
          id: 1,
          propertyName: "",
          type: "",
          operator: "",
          threshold: "",
        },
      ]);

      this.$refs.propertyName[i].clearValidate();
      this.$refs.operator[i].clearValidate();
      this.$refs.threshold[i].clearValidate();
    },

    // 添加过滤条件
    addFilter(i) {
      let datas = this.templateData.conditions[i].filters,
        id = datas[datas.length - 1].id;
      id += 1;
      this.templateData.conditions[i].filters.push({
        id,
        propertyName: "", // 过滤条件
        type: "",
        operator: "", // 操作符
        threshold: null, // 输入值
      });
    },

    // 删除过滤条件
    deleteA(i, is) {
      if (this.templateData.conditions[i].filters.length <= 1) {
        return this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
      }
      this.templateData.conditions[i].filters.splice(is, 1);
    },

    // 新增触发条件
    addTrigger() {
      let datas = this.templateData.conditions,
        id = datas[datas.length - 1].id;
      id += 1;
      this.templateData.conditions.push({
        id,
        alarmTriggerType: "3", // 触发类型
        type: "", // 属性/事件
        eventType: "", // 事件类型
        eventName: "", // 事件触发类型
        filters: [
          {
            id: 1,
            propertyName: "", // 过滤条件
            type: "",
            operator: "", // 操作符
            threshold: null, // 输入值
          },
        ],
      });
    },

    // 删除触发条件
    deleteTrigger(i) {
      if (this.templateData.conditions.length <= 1) {
        return this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
      }
      this.templateData.conditions.splice(i, 1);
    },

    // 事件后面的框
    eventTN(e, i) {
      this.events.forEach((item) => {
        if (e == item.eventType) {
          this.templateData.conditions[i].eventName = item.eventName;
        }
      });
    },

    // 校验
    checkForm(data) {
      let isTatus = null;
      this.$refs.templateData.validateField(data, (valid) => {
        if (!valid) {
          isTatus = true;
        } else {
          // 说明
          // 这里为什么不能使用 message 提示
          // 因为调用多次会触发多个弹窗
          // 需要各位网友一起解决
          // this.$message({
          //     message: '请完善信息',
          //     type: 'warning'
          // });
          isTatus = false;
        }
      });
      return isTatus;
    },

    // 取消 / 确定 按钮
    panelBtn(i) {
      if (i == 0) {
        this.templateData = {
          alarmName: "", // 告警名称
          alarmLevel: "", // 告警等级
          deviceTypeId: 1, // 设备 id 对应详情数据的 deviceTypeId 字段
          isStatus: 0, // 设备状态（默认为0，即开起状态）
          messageNotification: "", // 消息通知
          subsystemCode: null,
          conditions: [
            {
              id: 1,
              alarmTriggerType: "3", // 触发类型
              type: "", // 属性/事件
              eventType: "", // 事件类型
              eventName: "", // 事件触发类型
              filters: [
                {
                  id: 1,
                  propertyName: "", // 过滤条件
                  type: "",
                  operator: "", // 操作符
                  threshold: null, // 输入值
                },
              ],
            },
          ],
          alarmNotices: [
            {
              id: 1,
              alarmId: "",
              noticeType: null,
              noticeConfigId: null,
              noticeTemplateId: null,
            },
          ],
        };
        this.$refs.templateData.resetFields();
        return this.$emit("receiveComponents", { type: "trigger" });
      }

      let datas = this.templateData,
        isArr = [];

      isArr.push(this.checkForm(["alarmName"]));
      isArr.push(this.checkForm(["alarmLevel"]));

      for (let i = 0; i < datas.conditions.length; i++)
        isArr.push(this.checkForm([`conditions[${i}].type`]));

      for (let is = 0; is < datas.conditions.length; is++) {
        let item = datas.conditions[is];
        if (item.type == 1) {
          for (let e = 0; e < item.filters.length; e++) {
            isArr.push(this.checkForm([`conditions[${is}].filters[${e}].propertyName`]));

            isArr.push(this.checkForm([`conditions[${is}].filters[${e}].operator`]));

            isArr.push(this.checkForm([`conditions[${is}].filters[${e}].threshold`]));
          }
        } else if (item.type == 2) {
          isArr.push(this.checkForm([`conditions[${is}].eventType`]));
        }
      }

      // 消息通知 验证
      for (let i = 0; i < datas.alarmNotices.length; i++) {
        isArr.push(this.checkForm([`alarmNotices[${i}].noticeType`]));
        isArr.push(this.checkForm([`alarmNotices[${i}].noticeConfigId`]));
        isArr.push(this.checkForm([`alarmNotices[${i}].noticeTemplateId`]));
      }

      if (isArr.every((val) => val == true)) {
        let obj = {
          alarmLevel: datas.alarmLevel,
          alarmName: datas.alarmName,
          deviceTypeId: datas.deviceTypeId,
          subsystemCode: datas.subsystemCode,
          isStatus: datas.isStatus,
          // messageNotification: datas.messageNotification,
          conditions: [],
          alarmNotices: [],
        };

        datas.conditions.forEach((item) => {
          if (item.type == 1) {
            obj.conditions.push({
              alarmTriggerType: item.alarmTriggerType,
              type: item.type,
              filters: item.filters,
            });
          } else if (item.type == 2) {
            obj.conditions.push({
              alarmTriggerType: item.alarmTriggerType,
              type: item.type,
              eventType: item.eventType,
              eventName: item.eventName,
            });
          }
        });

        datas.alarmNotices.forEach((item) => {
          obj.alarmNotices.push({
            noticeType: item.noticeType,
            noticeConfigId: item.noticeConfigId,
            noticeTemplateId: item.noticeTemplateId,
          });
        });

        postDeviceAlarm(obj).then(() => {
          this.templateData = {
            alarmName: "", // 告警名称
            alarmLevel: "", // 告警等级
            deviceTypeId: 1, // 设备 id 对应详情数据的 deviceTypeId 字段
            isStatus: 0, // 设备状态（默认为0，即开起状态）
            subsystemCode: null,
            messageNotification: "", // 消息通知
            conditions: [
              {
                id: 1,
                alarmTriggerType: "3", // 触发类型
                type: "", // 属性/事件
                eventType: "", // 事件类型
                eventName: "", // 事件触发类型
                filters: [
                  {
                    id: 1,
                    propertyName: "", // 过滤条件
                    type: "",
                    operator: "", // 操作符
                    threshold: null, // 输入值
                  },
                ],
              },
            ],
            alarmNotices: [
              {
                id: 1,
                alarmId: "",
                noticeType: null,
                noticeConfigId: null,
                noticeTemplateId: null,
              },
            ],
          };

          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.$emit("receiveComponents", { type: "triggers" });
        });
      } else {
        this.$message({
          message: "请完善数据",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.margin_top_1 {
  margin-top: 1vh;
}

.margin_top_2 {
  margin-top: 2vh;
}

.margin_top_3 {
  margin-top: 3vh;
}

.margin_top_4 {
  margin-top: 4vh;
}

.padding_tb_2 {
  padding: 2vh 0;
  box-sizing: border-box;
}

.padding_tb_3 {
  padding: 3vh 0;
  box-sizing: border-box;
}

.padding_tb_6 {
  padding: 6vh 0;
  box-sizing: border-box;
}

.padding_bottom_1 {
  padding-bottom: 1vh;
}

.trigger_condition_box {
  margin-left: -3.1vw;
}

.trigger_condition_item {
  padding-left: 3.1vw;
  box-sizing: border-box;
  background-color: #eee;
}

.delete_box {
  color: #0000ff;
  cursor: pointer;
}

el-select-dropdown el-popper {
  padding-bottom: 1vh;
}
</style>
