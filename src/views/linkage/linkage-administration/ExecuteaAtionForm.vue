<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-05-13 15:07:33
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-19 08:50:02
-->
<template>
  <div>
    <div class="font-600">执行动作</div>

    <div
      class="back_box margin_top_1"
      v-for="(item, i) in editDetailsData.linkTriggerEvens"
      :key="item.ids"
    >
      <div class="titles_box">
        <span v-text="'执行动作：' + item.ids"></span>
        <span>
          <el-button
            class="titles_box_delete_button"
            size="mini"
            type="danger"
            @click="deleteAction(i)"
            >删除</el-button
          >
        </span>
      </div>

      <el-row class="padding_left_3">
        <!-- 选择动作类型 -->
        <el-col style="width: 13.8rem">
          <el-select v-model="item.executor" placeholder="请选择动作类型">
            <el-option
              v-for="items in linkActionTypeData"
              :key="items.dictValue"
              :label="items.dictLabel"
              v-model="items.dictValue"
            />
          </el-select>
        </el-col>

        <!-- *************************************设备输出-start******************************************* -->
        <!-- 打开设备面板 -->
        <el-col
          class="margin_left_1"
          style="width: 13.8rem"
          v-if="item.executor == '1'"
        >
          <el-button
            style="
              width: 13.8rem;
              text-align: left;
              padding-left: 1rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
            @click="openEquipmentPanel2(i)"
            >{{
              !item.configuration.deviceId
                ? "请选择设备"
                : item.configuration.deviceName
            }}</el-button
          >
        </el-col>

        <!-- 选择类型 -->
        <el-col
          class="margin_left_1"
          style="width: 13.8rem"
          v-if="item.executor == '1' && item.configuration.deviceId != null"
        >
          <el-select
            v-model="item.configuration.messageType"
            @change="getTypeAction($event, i)"
            placeholder="请选择类型"
          >
            <el-option
              v-for="items in linkDeviceSenderTypeData"
              :key="items.dictValue"
              :label="items.dictLabel"
              v-model="items.dictValue"
            />
          </el-select>
        </el-col>

        <!-- 物模型功能 -->
        <el-col
          class="margin_left_1"
          style="width: 13.8rem"
          v-if="
            item.executor == '1' &&
            item.configuration.deviceId != null &&
            item.configuration.messageType == 'INVOKE_FUNCTION'
          "
        >
          <el-select
            placeholder="物模型功能"
            v-model="item.configuration.functionName"
            @change="objectModel($event, i)"
          >
            <el-option
              v-for="items in item.invokeFunction"
              :key="items.identifier"
              :label="items.name"
              v-model="items.identifier"
            />
          </el-select>
        </el-col>

        <!-- 物模型属性  -->
        <el-col
          class="margin_left_1"
          style="width: 13.8rem"
          v-if="
            item.executor == '1' &&
            item.configuration.deviceId != null &&
            item.configuration.messageType == 'WRITE_PROPERTY'
          "
        >
          <el-select
            placeholder="物模型属性"
            v-model="item.configuration.properties.propertyName"
            @change="objectModelProperty($event, i)"
          >
            <el-option
              v-for="items in item.writeProperty"
              :key="items.field"
              :label="items.name"
              v-model="items.field"
            />
          </el-select>
        </el-col>

        <!-- 过滤值 -->
        <el-col
          class="margin_left_1"
          style="width: 13.8rem"
          v-if="
            item.executor == '1' &&
            item.configuration.deviceId != null &&
            item.configuration.messageType == 'WRITE_PROPERTY' &&
            item.configuration.properties.propertyValue !== ''
          "
        >
          <el-input
            style="width: 13.8rem"
            v-model="item.configuration.properties.propertyValue"
            placeholder="请输入过滤值"
            clearable
            size="small"
          />
        </el-col>
        <!-- *************************************设备输出-end******************************************* -->

        <!-- *************************************消息通知-start******************************************* -->
        <el-col
          class="margin_left_1"
          style="width: 13.8rem"
          v-if="item.executor == '2'"
        >
          <template>
            <el-select
              v-model="item.configuration.noticeType"
              @change="getNoticeType($event, i)"
              placeholder="选择通知类型"
            >
              <el-option
                v-for="items in noticeTypeData"
                :key="items.dictValue"
                :label="items.dictLabel"
                v-model="items.dictValue"
                :disabled="items.dictLabel == '全部' ? true : false"
              />
            </el-select>
          </template>
        </el-col>

        <el-col
          class="margin_left_1"
          style="width: 13.8rem"
          v-if="item.executor == '2' && item.configuration.noticeType != null"
        >
          <el-select
            v-model="item.configuration.noticeConfigId"
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
        </el-col>

        <el-col
          class="margin_left_1"
          style="width: 13.8rem"
          v-if="
            item.executor == '2' &&
            item.configuration.noticeType != null &&
            item.configuration.noticeConfigId != null
          "
        >
          <el-select
            v-model="item.configuration.noticeTemplateId"
            placeholder="选择通知模板"
            @change="getNoticeTemplate($event, i)"
          >
            <el-option
              v-for="items in item.noticeTemplate"
              :key="items.id"
              :label="items.name"
              v-model="items.id"
            />
          </el-select>
        </el-col>
        <!-- *************************************消息通知-end******************************************* -->
      </el-row>

      <el-row
        class="padding_left_3"
        v-if="
          item.executor == '1' &&
          item.configuration.deviceId != null &&
          item.configuration.messageType == 'INVOKE_FUNCTION'
        "
      >
        <el-col>
          <el-row
            v-for="items in item.configuration.inputs"
            :key="items.field"
            class="margin_top_1"
          >
            <el-col style="width: 13.8rem">
              <el-input
                style="width: 13.8rem"
                v-model="items.names"
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

    <el-button type="primary" plain class="margin_top_1" @click="addActionBtn">
      新增动作
    </el-button>
    <!-- 设备面板 -->
    <linkage-equipment-panel
      @trigger="triggers"
      ref="linkageEquipmentPanel"
    ></linkage-equipment-panel>
  </div>
</template>
<script>
import {
  getDeviceDeviceinfoProperties,
  getDeviceDeviceinfoFunctions,
  getNoticeNoticeConfigV1List,
  getNoticeNoticeTemplateV1List,
} from "@/api/linkage/linkageAdministration";

import LinkageEquipmentPanel from "./LinkageEquipmentPanel.vue";
export default {
  name: "ExecuteaAtionForm",
  components: {
    LinkageEquipmentPanel,
  },
  props: {
    editDetailsData: {
      type: Object,
      default() {
        return {};
      },
    },
    linkActionTypeData: {
      type: Array,
      default() {
        return {};
      },
    },
    linkDeviceSenderTypeData: {
      type: Array,
      default() {
        return {};
      },
    },
    noticeTypeData: {
      type: Array,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      // 打开设备面板时保存当前打开的下标值
      indexOpenEquipmentPanel: null,
    };
  },
  created() {},
  methods: {
    // 通知模板值
    getNoticeTemplate(val, i) {
      this.editDetailsData.linkTriggerEvens[i].noticeTemplate.forEach(
        (item) => {
          if (item.id == val) {
            this.editDetailsData.linkTriggerEvens[
              i
            ].configuration.noticeTemplateName = item.name;
          }
        }
      );
    },
    // 根据服务商获取列表
    getNoticeConfig(val, i) {
      let serviceProvider = null,
        eventName = null;
      this.editDetailsData.linkTriggerEvens[i].noticeConfig.forEach((item) => {
        if (item.id == val) {
          serviceProvider = item.serviceProvider;
          eventName = item.name;
        }
      });

      this.editDetailsData.linkTriggerEvens[i].configuration.serviceProvider =
        serviceProvider;
      this.editDetailsData.linkTriggerEvens[i].configuration.noticeConfigName =
        eventName;

      getNoticeNoticeTemplateV1List(serviceProvider).then((response) => {
        this.$set(
          this.editDetailsData.linkTriggerEvens[i],
          "noticeTemplate",
          response.data
        );
      });
    },
    // 根据选择的通知方式请求数据
    getNoticeType(val, i) {
      console.log(val);
      getNoticeNoticeConfigV1List(val).then((response) => {
        this.$set(
          this.editDetailsData.linkTriggerEvens[i],
          "noticeConfig",
          response.data
        );

        this.editDetailsData.linkTriggerEvens[
          i
        ].configuration.noticeConfigName = null;
        this.editDetailsData.linkTriggerEvens[
          i
        ].configuration.noticeTemplateName = null;
      });
    },
    // 封装选择类型
    encapsulationTypes(val, deviceId, i) {
      if (val == "INVOKE_FUNCTION") {
        getDeviceDeviceinfoFunctions(deviceId.split(",")[0]).then(
          (response) => {
            let { code, data } = response;
            data.map((item) => {
              console.log(item);
            });
            if (code == 200) {
              this.$set(
                this.editDetailsData.linkTriggerEvens[i],
                "invokeFunction",
                data
              );
            }
          }
        );
      } else if (val == "WRITE_PROPERTY") {
        getDeviceDeviceinfoProperties(deviceId.split(",")[0]).then(
          (response) => {
            let { code, data } = response;
            if (code == 200) {
              this.$set(
                this.editDetailsData.linkTriggerEvens[i],
                "writeProperty",
                data
              );
            }
          }
        );
      }
    },
    // 选择类型
    getTypeAction(val, i) {
      this.encapsulationTypes(
        val,
        this.editDetailsData.linkTriggerEvens[i].configuration.deviceId,
        i
      );
    },
    // 接收子组件传过来的数据
    triggers(data) {
      // let { deviceId, deviceName, plugId, deviceCode } = data;
      let { arr, deviceNames, deviceIds, deviceCodes } = data;

      if (this.setModular == "equipment") {
        this.editDetailsData.linkTrigger[
          this.indexOpenEquipmentPanel
        ].triggerDevice.deviceName = deviceNames;
        this.editDetailsData.linkTrigger[
          this.indexOpenEquipmentPanel
        ].triggerDevice.plugId = arr[0].plugId;
        this.editDetailsData.linkTrigger[
          this.indexOpenEquipmentPanel
        ].triggerDevice.deviceId = deviceIds;
        this.editDetailsData.linkTrigger[
          this.indexOpenEquipmentPanel
        ].triggerDevice.deviceCode = deviceCodes;
        this.editDetailsData.linkTrigger[
          this.indexOpenEquipmentPanel
        ].triggerDevices = arr;
      } else if (this.setModular == "action") {
        this.editDetailsData.linkTriggerEvens[
          this.indexOpenEquipmentPanel
        ].configuration.deviceId = deviceIds;
        this.editDetailsData.linkTriggerEvens[
          this.indexOpenEquipmentPanel
        ].configuration.plugId = arr[0].plugId;
        this.editDetailsData.linkTriggerEvens[
          this.indexOpenEquipmentPanel
        ].configuration.deviceName = deviceNames;
        this.editDetailsData.linkTriggerEvens[
          this.indexOpenEquipmentPanel
        ].configuration.deviceCode = deviceCodes;
        this.editDetailsData.linkTrigger[
          this.indexOpenEquipmentPanel
        ].configurations = arr;
      }

      this.$refs.linkageEquipmentPanel.isEquipmentPanel = false;
    },
    // 打开设备面板
    openEquipmentPanel2(i) {
      this.setModular = "action";
      this.indexOpenEquipmentPanel = i;
      this.$refs.linkageEquipmentPanel.isEquipmentPanel = true;
    },
    // 删除执行动作
    deleteAction(i) {
      if (this.editDetailsData.linkTriggerEvens.length <= 1) {
        this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
        return false;
      }
      this.editDetailsData.linkTriggerEvens.splice(i, 1);
    },
    // 新增执行动作
    addActionBtn() {
      let linkTriggerEvens = this.editDetailsData.linkTriggerEvens,
        ids = linkTriggerEvens[linkTriggerEvens.length - 1].ids;
      ids += 1;
      let dataT = {
        ids,
        executor: "",
        configuration: {
          deviceId: null,
          deviceName: null,
          messageType: null,
          functionName: null,
          noticeType: null, // 通知类型
          noticeConfigId: null, // 通知配置
          noticeTemplateId: null, // 通知模板
          noticeTemplateName: null,
          inputs: [],
          properties: {
            propertyName: null,
            propertyValue: null,
          },
        },
      };

      this.editDetailsData.linkTriggerEvens.push(this.deepClone(dataT));
    },
    // 调用功能后的选择框
    objectModel(val, i) {
      this.editDetailsData.linkTriggerEvens[i].invokeFunction.forEach(
        (item) => {
          if (item.identifier == val) {
            this.editDetailsData.linkTriggerEvens[i].configuration.inputs =
              this.deepClone(
                item.inputData.map((items) => {
                  items.names = items.name;
                  items.parmValue = "";
                  return items;
                })
              );
          }
        }
      );
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
    // 设置属性后的选择框
    objectModelProperty(val, i) {
      console.log(val, i);
    },
  },
};
</script>
<style lang="scss" scoped>
.back_box {
  background-color: #eee;
  padding: 1vh 0;
  box-sizing: border-box;
}

.margin_top_1 {
  margin-top: 1vh;
}

.margin_left_1 {
  margin-left: 0.5vw;
}

.titles_box {
  width: 8.5vw;
  height: 3vh;
  margin-left: 3vw;
}

.titles_box_delete_button {
  float: right;
  margin-top: 0.2vh;
}

.titles_box_delete_1 {
  margin-left: 1vw;
}

.padding_left_3 {
  padding-left: 3vw;
}
</style>
