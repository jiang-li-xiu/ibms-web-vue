<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-03-31 17:43:10
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-06 11:08:00
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="isDialogDetail"
    width="25%"
    append-to-body
  >
    <div class="properties_panel_box">
      <div
        class="properties_panel_item"
        v-for="item in detailsData"
        :key="item.id"
      >
        <div v-text="item.title"></div>
        <div>{{ item.value }}</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  getAlarmRecordDetail,
} from "@/api/common-config/event-manage/alarm";
import {
  getEventDetail,
} from "@/api/common-config/event-manage/event";
export default {
  name: "PopupDetails",
  components: {},
  props: {},
  data() {
    return {
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      isDialogDetail: false,
      // 告警详情表格数据
      detailsData: [],
      // 告警等级字典
      alarmLevelOptions: [],
      // 处理状态字典
      arrangeStatusOptions: [],
    };
  },
  created() {
    this.getDicts("manager_level").then((response) => {
      this.alarmLevelOptions = response.data;
    });
    this.getDicts("arrange_status").then((response) => {
      this.arrangeStatusOptions = response.data;
    });
  },
  computed: {
  },
  methods: {
     // 事件等级转换
    eventGrade(eventDisposeGrade) {
      let eventGradeLabel;
      this.alarmLevelOptions.forEach((item) => {
        if (item.dictValue === eventDisposeGrade) {
          eventGradeLabel = item.dictLabel;
        }
      });
      return eventGradeLabel;
    },
    // 事件类型转换
    eventStatus(eventDisposeStatus) {
      let eventStatusLabel;
      this.arrangeStatusOptions.forEach((item) => {
        if (item.dictValue === eventDisposeStatus) {
          eventStatusLabel = item.dictLabel;
        }
      });
      return eventStatusLabel;
    },
    // 告警等级转换
    alarmGrade(alarmDisposeGrade) {
      let alarmLevelLabel;
      this.alarmLevelOptions.forEach((item) => {
        if (item.dictValue === alarmDisposeGrade) {
          alarmLevelLabel = item.dictLabel;
        }
      });
      return alarmLevelLabel;
    },
    // 处理状态转换
    alarmStatus(alarmDisposeStatus) {
      let arrangeStatusLabel;
      this.arrangeStatusOptions.forEach((item) => {
        if (item.dictValue === alarmDisposeStatus) {
          arrangeStatusLabel = item.dictLabel;
        }
      });
      return arrangeStatusLabel;
    },
    // 表单重置
    reset(type) {
      if (type == 1) {
        this.form = {
        alarmHistoryId: null,
        deviceId: null,
        alarmId: null,
        alarmName: null,
        alarmLevel: null,
        arrangeStatus: null,
        alarmTime: null,
        remarks: null,
        deleted: null,
      };
      } else {
        this.form = {
        id: null,
        serviceName: null,
        deviceCode: null,
        eventName: null,
        eventType: null,
        eventGrade: null,
        triggerTime: null,
        recordData: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleted: null,
        version: null,
      };
      }
      
      this.resetForm("form");
    },
    /**详情按钮*/
    detail(id,recordType) {
      if (recordType == 1) {
        this.reset(1);
        this.title = "告警记录：";
        getAlarmRecordDetail(id).then((response) => {
          this.detailsData = [
            {
                title: '告警名称',
                value: response.data.alarmName
            },
            {
                title: '设备名称',
                value: response.data.deviceName
            },
            {
                title: '告警等级',
                value: this.alarmGrade(response.data.alarmLevel)
            },
            {
                title: '处理状态',
                value: this.alarmStatus(response.data.arrangeStatus)
            },
            {
                title: '告警时间',
                value: response.data.alarmTime
            },
            {
                title: '备注',
                value: response.data.remarks
            },
          ]
        });
      } else if (recordType == 2) {
          this.reset(2);
          this.title = "事件记录：";
          getEventDetail(id).then((response) => {
            this.detailsData = [
              {
                  title: '插件名称',
                  value: response.data.serviceName
              },
              {
                  title: '设备代码',
                  value: response.data.deviceCode
              },
              {
                  title: '事件名称',
                  value: response.data.eventName
              },
              {
                  title: '事件类型',
                  value: this.eventStatus(response.data.eventType)
              },
              {
                  title: '事件等级',
                  value: this.eventGrade(response.data.eventGrade)
              },
              {
                  title: '触发时间',
                  value: response.data.triggerTime
              },
              {
                  title: '数据',
                  value: response.data.recordData
              },
              {
                  title: '事件描述',
                  value: response.data.remark
              },
           ]
          });
        }
      this.isDialogDetail = !this.isDialogDetail;
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>
