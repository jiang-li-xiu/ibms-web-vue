<!--
 * @Author: MJ
 * @Date: 2021-11-15 15:56:48
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-19 15:46:39
 * @Description: 
-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isEditSetTing"
      width="1300px"
      append-to-body
      @close="closeBtn"
    >
      <el-form
        :model="templateData"
        :rules="rules"
        ref="templateData"
        label-width="100px"
      >
        <el-form-item label="子系统" prop="subsystemCode">
          <el-select
            v-model="templateData.subsystemCode"
            placeholder="请选择设备类型"
            @change="changeSub"
          >
            <el-option
              v-for="(items, index) in subSystem"
              :key="index"
              :label="items.title"
              v-model="items.subsystemCode"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="设备类型" prop="deviceTypeId">
          <el-select
            v-model="templateData.deviceTypeId"
            placeholder="请选择设备类型"
            @change="changeDeviceTypeId"
          >
            <el-option
              v-for="item in dataType"
              :key="item.deviceType"
              :label="item.deviceTypeName"
              :value="item.deviceTypeId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="告警名称" prop="alarmName">
          <el-input
            v-model="templateData.alarmName"
            placeholder="请输入告警名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="告警等级" prop="alarmLevel">
          <el-select
            v-model="templateData.alarmLevel"
            placeholder="请选择告警等级"
          >
            <el-option
              v-for="items in managerLevel"
              :key="items.dictValue"
              :label="items.dictLabel"
              v-model="items.dictValue"
            />
          </el-select>
        </el-form-item>

        <!-- 触发条件 -->
        <el-form-item>
          <touch-condition-form
            :templateData="templateData"
            :linkTriggerCondition="linkTriggerCondition"
            :linkageTriggerType="linkageTriggerType"
            :events="events"
            :properties="properties"
            :linkTriggerOperator="linkTriggerOperator"
          >
          </touch-condition-form>
        </el-form-item>
        <!-- 触发条件 -->

        <!-- 消息通知 -->
        <el-form-item style="margin-top: 3.6vh">
          <message-notification-form
            :templateData="templateData"
            :noticeType="noticeType"
          >
          </message-notification-form>
        </el-form-item>
        <!-- 消息通知 -->

        <el-form-item style="text-align: right">
          <el-button @click.stop="closeBtn">取消</el-button>
          <el-button @click.stop="panelBtn" type="primary">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDeviceDevicetypeProperties,
  getDeviceDevicetypeEvents,
  putDeviceAlarm,
  postDeviceAlarm,
  getDeviceAlarm,
} from "@/api/device/deviceClasses";
import {
  getNoticeNoticeConfigV1List,
  getNoticeNoticeTemplateV1List,
} from "@/api/subsystem/linkageAdministration";
import {
  listSubSystem,
  getDeviceClassTypeList,
} from "@/api/common-config/event-manage/plan";
import TouchConditionForm from "./ThingPanelNew/TouchConditionForm.vue";
import MessageNotificationForm from "./ThingPanelNew/MessageNotificationForm";

export default {
  name: "ThingAddSetTingPanel",
  components: {
    TouchConditionForm,
    MessageNotificationForm,
  },
  props: {},
  data() {
    return {
      title: "",
      // 控制 告警设置-告警设置 编辑面板的显示与隐藏
      isEditSetTing: false,
      // 数据收集
      templateData: {
        alarmName: "", // 告警名称
        alarmLevel: "", // 告警等级
        deviceTypeId: null, // 设备 id 对应详情数据的 deviceTypeId 字段
        plugId:null,
        subsystemCode: null,
        status: 0, // 设备状态（默认为0，即开起状态）
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
      dataType: [], // 设备类型列表
      // 所有子系统列表
      subSystem: [],
      // 验证
      rules: {
        alarmName: [
          { required: true, message: "请输入告警名称", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        alarmLevel: [
          { required: true, message: "请选择告警等级", trigger: "blur" },
        ],
        subCode: [
          { required: true, message: "请选择设备类型", trigger: "blur" },
        ],
        deviceType: [
          { required: true, message: "请选择设备类型", trigger: "blur" },
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

  mounted() {
    this.getSubSystemList();
    this.getDictionaries("managerLevel", "manager_level");
    this.getDictionaries("linkTriggerCondition", "link_trigger_condition");
    this.getDictionaries("linkageTriggerType", "linkage_trigger_type");
    this.getDictionaries("linkTriggerOperator", "link_trigger_Operator");
    // this.getDictionaries("noticeType", "notice_type");
    this.getDicts("notice_type").then((response) => {
      this.noticeType = response.data.map((item) => {
        item.disabled = item.dictValue == "all" ? true : false;
        return item;
      });
    });
  },

  methods: {
    // 获取字典数据
    getDictionaries(key, value) {
      this.getDicts(value).then((response) => {
        this[key] = response.data;
      });
    },
    add() {
      this.reset()
      this.isEditSetTing = true;
    },
    edit(row) {
      this.reset()
      this.editDeviceAlarm(row.id);
      this.propertiesEvents(row.deviceTypeId);
      this.isEditSetTing = true;
    },
    // 获取告警设置详情
    editDeviceAlarm(id) {
      getDeviceAlarm(id).then((response) => {
        this.templateData = {};
        let obj = response.data;
        this.changeSub(obj.subsystemCode);
        obj.conditions = obj.conditions.map((item, i) => {
          item.id = i + 1;
          return item;
        });

        obj.alarmNotices = obj.alarmNotices.map((item, i) => {
          item.id = i + 1;
          this.getNoticeType(item.noticeType, i);

          setTimeout(() => {
            this.getNoticeConfig(item.noticeConfigId, i);
          }, 500);
          return item;
        });
        this.templateData = obj;
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

    // 子系统列表
    getSubSystemList() {
      listSubSystem().then((response) => {
        this.subSystem = response.data.map((item) => {
          item.subsystemCode = item.code;
          return item;
        });
      });
    },

    // 根据子系统 code 请求 设备类型列表
    changeSub(e) {
      this.templateData.deviceTypeId = null;
      getDeviceClassTypeList({ subSystemCode: e }).then((response) => {
        this.dataType = response.data;
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
    // 选择类型触发函数获取 事件数据
    changeDeviceTypeId(e) {
      this.dataType.forEach(item=>{
        if(item.deviceTypeId === e){
          this.templateData.plugId = item.plugId
        }
      })
      console.log(this.templateData);
      this.propertiesEvents(e);
    },
    // 根据选择的通知方式请求数据
    getNoticeType(val, i) {
      getNoticeNoticeConfigV1List(val).then((response) => {
        this.$set(
          this.templateData.alarmNotices[i],
          "noticeConfig",
          response.data
        );
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
        this.$set(
          this.templateData.alarmNotices[i],
          "noticeTemplate",
          response.data
        );
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
    reset() {
      this.templateData = {
        alarmName: "", // 告警名称
        alarmLevel: "", // 告警等级
        deviceTypeId: null, // 设备 id 对应详情数据的 deviceTypeId 字段
        status: 0, // 设备状态（默认为0，即开起状态）
        messageNotification: "", // 消息通知
        subsystemCode: "",
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
      };
      this.resetForm("templateData");
    },
    closeBtn() {
      this.reset();
      this.isEditSetTing = false;
    },
    // 取消 / 确定 按钮
    panelBtn() {
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
            isArr.push(
              this.checkForm([`conditions[${is}].filters[${e}].propertyName`])
            );

            isArr.push(
              this.checkForm([`conditions[${is}].filters[${e}].operator`])
            );

            isArr.push(
              this.checkForm([`conditions[${is}].filters[${e}].threshold`])
            );
          }
        } else if (item.type == 2) {
          isArr.push(this.checkForm([`conditions[${is}].eventName`]));
        }
      }

      // 消息通知 验证
      for (let i = 0; i < datas.alarmNotices.length; i++) {
        isArr.push(this.checkForm([`alarmNotices[${i}].noticeType`]));
        isArr.push(this.checkForm([`alarmNotices[${i}].noticeConfigId`]));
        isArr.push(this.checkForm([`alarmNotices[${i}].noticeTemplateId`]));
      }

      // 验证是否通过
      if (isArr.every((val) => val == true)) {
        let obj = {
          id: datas.id,
          alarmLevel: datas.alarmLevel,
          alarmName: datas.alarmName,
          deviceTypeId: datas.deviceTypeId,
          status: datas.status,
          subsystemCode: datas.subsystemCode,
          messageNotification: datas.messageNotification,
          conditions: [],
          alarmNotices: [],
          plugId:datas.plugId
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
              eventName: item.eventName,
              eventType: item.eventType,
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
        if (this.title == "修改") {
          putDeviceAlarm(obj).then((response) => {
            if (response.code == 200) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.isEditSetTing = false;
              this.reset();
              this.$refs.templateData.resetFields();
              this.$emit("receiveComponents", { type: "triggers" });
            }
          });
        } else if (this.title == "新增") {
          postDeviceAlarm(obj).then(() => {
            this.templateData = {
              alarmName: "", // 告警名称
              alarmLevel: "", // 告警等级
              deviceTypeId: 1, // 设备 id 对应详情数据的 deviceTypeId 字段
              status: 0, // 设备状态（默认为0，即开起状态）
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
            };

            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.isEditSetTing = false;
            this.reset();
            this.$refs.templateData.resetFields();
            this.$emit("receiveComponents", { type: "triggers" });
          });
        }
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
</style>
