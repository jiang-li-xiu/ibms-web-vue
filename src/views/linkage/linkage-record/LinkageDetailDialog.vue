<!--
 * @Author: Yelucc
 * @Date: 2021-08-13 15:29:09
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-21 10:59:32
 * @Description:
-->
<template>
  <div>
    <el-card>
      <div>
        <el-descriptions title="联动信息" :column="2">
          <el-descriptions-item label="联动名称">
            {{ data.linkName }}
          </el-descriptions-item>

          <!-- <el-descriptions-item label="触发时间">
            {{ parseTime(data.triggerTime) }}
          </el-descriptions-item>

          <el-descriptions-item label="触发方式">
            <el-tag size="small">
              {{ triggerModeFormat(data.triggerMode) }}
            </el-tag>
          </el-descriptions-item> -->

          <el-descriptions-item label="查看状态">
            <el-tag size="small" :type="data.checkStatus == 0 ? 'warning' : 'success'">
              {{ data.checkStatus == 0 ? "未查看" : "已查看" }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-card>
      <div>
        <el-descriptions title="触发条件" :column="2">
          <el-descriptions-item label="触发时间">
            {{ parseTime(data.triggerTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="触发方式">
            <el-tag size="small">
              {{ triggerModeFormat(data.triggerMode) }}
            </el-tag>
          </el-descriptions-item>
          <!-- 设备触发 -->

          <el-descriptions-item label="触发设备" v-if="data.triggerCondition.linkTriggerType == '3'">
            <div class="deviceName">
              {{ data.triggerCondition.triggerDevice.deviceName }}
            </div>

          </el-descriptions-item>
          <el-descriptions-item label="事件名称" v-if="data.triggerCondition.linkTriggerType == '3'">
            {{
                data.triggerCondition.triggerDevice.type == "1"
                  ? "属性变动事件"
                  : data.triggerCondition.triggerDevice.eventName
            }}
          </el-descriptions-item>
          <el-descriptions-item label="设备触发方式" v-if="data.triggerCondition.linkTriggerType == '3'">
            <el-tag size="small">
              {{
                  data.triggerCondition.triggerDevice.type == "1" ? "属性触发" : "事件触发"
              }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 属性变动 -->
        <el-descriptions :column="1" v-if="
          data.triggerCondition.linkTriggerType == '3' &&
          data.triggerCondition.triggerDevice.type == '1'
        ">
          <el-descriptions-item :label="'属性变动条件' + (index + 1)"
            v-for="(item, index) in data.triggerCondition.triggerDevice.filters" :key="index">
            <el-tag>(属性){{ item.propertyName }}:</el-tag>
            <el-tag type="success">(值){{ item.targetValue }}</el-tag>
            <el-tag type="warning">{{ operatorFormat(item.operator) }}</el-tag>
            <el-tag type="danger">(阈值){{ item.threshold }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 定时触发 -->
        <el-descriptions :column="1" v-if="data.triggerMode == '2'">
          <el-descriptions-item label="时间频率表达式">
            {{ data.triggerCondition.linkTriggerCron }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-card>
        <el-descriptions title="联动执行详情">
          <el-descriptions-item :label="'执行动作' + (index + 1)" v-for="(item, index) in data.actions" :key="index" width="200">
            <div v-if="
              item.action.configuration.messageType == 'WRITE_PROPERTY' &&
              item.action.executor == '1'
            ">
              <!-- <el-tag :title="item.action.configuration.deviceName" class="deviceName-text">(设备){{ item.action.configuration.deviceName }}</el-tag> -->
              <el-tag type="success">(操作){{ senderFormat(item.action.configuration.messageType) }}</el-tag>
              <el-tag type="warning">(值){{ item.action.configuration.properties.propertyName }}</el-tag>
              <el-tag type="danger">(设置为){{ item.action.configuration.properties.propertyValue }}</el-tag>
              <el-tag type="info">(执行结果){{ item.actionRes }}</el-tag>
            </div>
            <div v-if="
              item.action.configuration.messageType == 'INVOKE_FUNCTION' &&
              item.action.executor == '1'
            ">
              <el-tag class="deviceName-text" :title="item.action.configuration.deviceName">(设备){{ item.action.configuration.deviceName }}</el-tag>
              <el-tag type="success">(操作){{ senderFormat(item.action.configuration.messageType) }}</el-tag>
              <el-tag type="warning">(功能){{ item.action.configuration.functionName }}</el-tag>
              <el-tag type="danger" v-for="(ite, i) in item.action.configuration.inputs" :key="i">
                (参数){{ ite.names }}:{{ ite.parmValue }}
              </el-tag>
              <el-tag type="info">(执行结果){{ item.actionRes }}</el-tag>
            </div>
            <div v-if="item.action.executor == '2'">
              <el-tag>(消息通知){{ item.action.configuration.noticeType }}</el-tag>
              <el-tag type="success">(通知配置){{ item.action.configuration.noticeConfigName }}</el-tag>
              <el-tag type="warning">(通知模板){{ item.action.configuration.noticeTemplateName }}</el-tag>
              <el-tag type="info">(执行结果){{ item.actionRes }}</el-tag>
            </div>
          </el-descriptions-item>
        </el-descriptions>
    </el-card>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";

export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  created() {
    this.getDicts("link_trigger_condition").then((response) => {
      this.triggerModeOptions = response.data;
    });
    this.getDicts("link_trigger_operator").then((response) => {
      this.operatorOptions = response.data;
    });
    this.getDicts("link_device_sender_type").then((response) => {
      this.senderOptions = response.data;
    });
  },
  components: {},
  data() {
    return {
      triggerModeOptions: [],
      operatorOptions: [],
      senderOptions: [],
    };
  },
  methods: {
    // 联动触发类型字典翻译
    triggerModeFormat(column) {
      return this.selectDictLabel(this.triggerModeOptions, column);
    },
    // 联动触发类型字典翻译
    operatorFormat(column) {
      return this.selectDictLabel(this.operatorOptions, column);
    },
    senderFormat(column) {
      return this.selectDictLabel(this.senderOptions, column);
    },
  },
};
</script>
<style lang="scss" scoped>
.deviceName {
  height: 350px;
  overflow-y: auto;
}
.deviceName-text{
  width: 780px;
  overflow-x: hidden;
}
</style>
