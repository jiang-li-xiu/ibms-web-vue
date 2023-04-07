<template>
  <div>
    <div class="font-600">触发条件</div>
    <div
      class="back_box margin_top_1"
      v-for="(item, i) in editDetailsData.linkTrigger"
      :key="item.ids"
    >
      <div class="titles_box">
        <span v-text="'触发器：' + item.ids"></span>
        <span>
          <el-button
            class="titles_box_delete_button"
            size="mini"
            type="danger"
            @click="deleteTouch(i)"
            >删除</el-button
          >
        </span>
      </div>
      <div>
        <!-- 手动触发 -->
        <!--  -->
        <div v-if="item.linkTriggerType == 1 || item.linkTriggerType == ''">
          <el-row class="padding_left_3">
            <el-col :span="10">
              <el-select
                v-model="item.linkTriggerType"
                placeholder="请选择触发器"
              >
                <el-option
                  v-for="items in linkTriggerConditionData"
                  :key="items.dictValue"
                  :label="items.dictLabel"
                  v-model="items.dictValue"
                />
              </el-select>
            </el-col>
          </el-row>
        </div>

        <!-- 定时触发 -->
        <div v-if="item.linkTriggerType == 2">
          <el-row class="padding_left_3">
            <el-col style="width: 13.8rem">
              <el-select
                v-model="item.linkTriggerType"
                placeholder="请选择触发器"
              >
                <el-option
                  v-for="items in linkTriggerConditionData"
                  :key="items.dictValue"
                  :label="items.dictLabel"
                  v-model="items.dictValue"
                />
              </el-select>
            </el-col>

            <!-- 定时触发 -->
            <el-col class="margin_left_1" style="width: 13.8rem">
              <el-input
                v-model="item.linkTriggerCron"
                placeholder="请输入corn表达式"
                clearable
                size="small"
              />
            </el-col>
          </el-row>
        </div>

        <!-- 设备触发 -->
        <div v-if="item.linkTriggerType == 3">
          <el-row class="padding_left_3">
            <el-col style="width: 13.8rem">
              <el-select
                v-model="item.linkTriggerType"
                placeholder="请选择触发器"
              >
                <el-option
                  v-for="items in linkTriggerConditionData"
                  :key="items.dictValue"
                  :label="items.dictLabel"
                  v-model="items.dictValue"
                />
              </el-select>
            </el-col>

            <!-- 请选择设备 -->
            <el-col
              class="margin_left_1"
              style="width: 13.8rem"
              v-if="item.linkTriggerType == 3"
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
                @click="openEquipmentPanel(i)"
                >{{
                  !item.triggerDevice.deviceId
                    ? "请选择设备"
                    : item.triggerDevice.deviceName
                }}</el-button
              >
            </el-col>
          </el-row>

          <!-- 请选择类型 -->
          <el-row class="padding_left_3 margin_top_1">
            <el-col>
              <el-select
                v-model="item.triggerDevice.type"
                placeholder="请选择类型"
                @change="selectType(i)"
                v-if="item.triggerDevice.deviceId != null"
              >
                <el-option
                  v-for="items in linkageTriggerTypeData"
                  :key="items.dictValue"
                  :label="items.dictLabel"
                  v-model="items.dictValue"
                />
              </el-select>

              <!-- 选择事件后的元素展示框 -->
              <el-select
                class="margin_left_1"
                v-model="item.triggerDevice.eventType"
                placeholder=""
                v-if="item.triggerDevice.type == 2"
                @change="eventTN($event, i)"
              >
                <el-option
                  v-for="items in item.deviceDeviceinfoEvents"
                  :key="items.identifier"
                  :label="items.eventName"
                  v-model="items.eventType"
                />
              </el-select>
            </el-col>
          </el-row>

          <!-- 选择属性后的展示元素输入框 -->
          <el-row class="padding_left_3" v-if="item.triggerDevice.type == 1">
            <el-col>
              <el-row
                v-for="(items, is) in item.triggerDevice.filters"
                :key="items.id"
                class="margin_top_1"
              >
                <el-select
                  v-model="items.propertyName"
                  placeholder="请选择"
                  @change="changePropertyName($event, items)"
                >
                  <el-option
                    v-for="itemss in item.deviceDeviceinfoProperties"
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
                    v-for="itemss in linkTriggerOperatorData"
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
                <el-button
                  class="titles_box_delete_1"
                  size="mini"
                  type="danger"
                  @click.stop="deleteA(i, is)"
                  >删除</el-button
                >
              </el-row>
            </el-col>
          </el-row>

          <el-row
            class="padding_left_3 margin_top_1"
            v-if="item.triggerDevice.type == 1"
          >
            <el-col>
              <el-button type="primary" plain @click="addO(i)">添加</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <el-button class="margin_top_1" type="primary" plain @click="addTriggerBtn"
      >新增触发器</el-button
    >
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
  getDeviceDeviceinfoEvents,
} from "@/api/linkage/linkageAdministration";
import LinkageEquipmentPanel from "./LinkageEquipmentPanel.vue";
export default {
  name: "TouchConditionForm",
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
    linkTriggerConditionData: {
      type: Array,
      default() {
        return {};
      },
    },
    linkageTriggerTypeData: {
      type: Array,
      default() {
        return {};
      },
    },
    linkTriggerOperatorData: {
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
    // 选择事件后的元素框
    eventTN(val, i) {
      console.log(val, i);
      let datas = this.editDetailsData.linkTrigger[i];
      datas.deviceDeviceinfoEvents.forEach((item) => {
        if (item.eventType == val) {
          datas.triggerDevice.eventName = item.eventName;
        }
      });
    },
    // 删除属性
    deleteA(i, is) {
      if (
        this.editDetailsData.linkTrigger[i].triggerDevice.filters.length <= 1
      ) {
        this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
        return false;
      }
      this.editDetailsData.linkTrigger[i].triggerDevice.filters.splice(is, 1);
    },
    // 添加属性
    addO(i) {
      let filters = this.editDetailsData.linkTrigger[i].triggerDevice.filters,
        id = filters[filters.length - 1].id;
      id += 1;

      this.editDetailsData.linkTrigger[i].triggerDevice.filters.push({
        id,
        operator: "",
        propertyName: "",
        threshold: "",
      });
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
    // 封装属性/事件 后面 选择框 的 面板数据
    encapsulationPropertiesEvents(data, linkTriggerType, i) {
      let { deviceId, type } = data,
        that = this;
      that.$nextTick(() => {
        if (linkTriggerType == 3 && type == 1) {
          getDeviceDeviceinfoProperties(deviceId.split(",")[0]).then(
            (response) => {
              let { code, data } = response;
              if (code == 200) {
                console.log("getDeviceDeviceinfoProperties:", data);
                that.$set(
                  that.editDetailsData.linkTrigger[i],
                  "deviceDeviceinfoProperties",
                  data
                );
              }
            }
          );
        } else if (linkTriggerType == 3 && type == 2) {
          getDeviceDeviceinfoEvents(deviceId.split(",")[0]).then((response) => {
            console.log("response:", response);
            let { data } = response;
            console.log("getDeviceDeviceinfoEvents:", data);
            that.$set(
              that.editDetailsData.linkTrigger[i],
              "deviceDeviceinfoEvents",
              data
            );
          });
        }
      });
    },
    // 选择属性/事件
    selectType(i) {
      let { triggerDevice, linkTriggerType } =
        this.editDetailsData.linkTrigger[i];

      this.encapsulationPropertiesEvents(triggerDevice, linkTriggerType, i);
    },
    // 打开设备面板
    openEquipmentPanel(i) {
      this.setModular = "equipment";
      this.indexOpenEquipmentPanel = i;
      this.$refs.linkageEquipmentPanel.isEquipmentPanel = true;
    },
    // 删除触发条件
    deleteTouch(i) {
      if (this.editDetailsData.linkTrigger.length <= 1) {
        this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
        return false;
      }
      this.editDetailsData.linkTrigger.splice(i, 1);
    },
    // 添加触发器
    addTriggerBtn() {
      let linkTrigger = this.editDetailsData.linkTrigger,
        ids = linkTrigger[linkTrigger.length - 1].ids;
      ids += 1;
      console.log("linkTrigger:", linkTrigger);

      this.editDetailsData.linkTrigger.push({
        actionId: "",
        ids,
        linkTriggerCron: "",
        linkTriggerLinkIds: "",
        linkTriggerType: "",
        triggerDevice: {
          deviceId: null,
          deviceName: "",
          eventName: "",
          eventType: "",
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
      });
    },
    // 属性 的下一个选框-未完成
    changePropertyName(e, row) {
      console.log(e, row);
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
