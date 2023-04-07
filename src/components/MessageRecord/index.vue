<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-02-09 15:12:02
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-18 12:53:47
-->
<template>
  <el-popover placement="bottom-end" width="400" trigger="click" @show="show">
    <!-- 图标展示 -->
    <em slot="reference" class="el-icon-message-solid">
      <el-badge :value="unReadNum.total" class="badge"></el-badge>
    </em>
    <!-- 需展示的tab标签 -->
    <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
      <el-tab-pane name="first">
        <span slot="label"
          >联动记录<el-badge
            :value="unReadNum.linkTotal"
            class="badge"
          ></el-badge
        ></span>
        <record-tab
          :recordData="recordData"
          :recordType="0"
          :path="'/commonConfiguration/linkage/linkage-record'"
          :loading="loading"
        ></record-tab>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"
          >告警记录<el-badge
            :value="unReadNum.alarmTotal"
            class="badge"
          ></el-badge
        ></span>
        <record-tab
          :recordData="recordData"
          :recordType="1"
          :path="'/commonConfiguration/event-manage/event-manage/event-alarm-record'"
          :loading="loading"
          @ignore="recordType"
        ></record-tab
      ></el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label"
          >事件记录<el-badge
            :value="unReadNum.eventTotal"
            class="badge"
          ></el-badge
        ></span>
        <record-tab
          :recordData="recordData"
          :recordType="2"
          :path="'/commonConfiguration/event-manage/event-manage/event-alarm-record'"
          :loading="loading"
          @ignore="recordType"
        ></record-tab
      ></el-tab-pane>
    </el-tabs>
  </el-popover>
</template>

<script>
import { getUnReadTotal } from "@/api/index.js";
import { getLinkRecordList } from "@/api/linkage/linkRecord";
import { getEventList } from "@/api/common-config/event-manage/event";
import { getAlarmRecordList } from "@/api/common-config/event-manage/alarm";

// 组件
import RecordTab from "@/components/RecordTab";
export default {
  components: {
    RecordTab,
  },
  data() {
    return {
      // tab展示项
      activeName: "first",
      // 联动参数请求体
      linkQueryParams: {
        pageNum: 1,
        pageSize: 5,
        checkStatus: 0, //未查看
      },
      // 告警参数请求体
      alarmQueryParams: {
        pageNum: 1,
        pageSize: 5,
        arrangeStatus: 1, //未处理
      },
      // 事件参数请求体
      eventQueryParams: {
        pageNum: 1,
        pageSize: 5,
        mode: 1, //未处理
      },
      // 加载
      loading: true,
      // 联动、告警、事件消息数据
      recordData: [],
      recordType: "",
      // 联动、告警、事件未读消息数
      unReadNum: {},
    };
  },
  created() {
    // 获取未读的联动记录总数
    this.getUnReadTotal();
  },
  methods: {
    // 展示记录时触发
    show() {
      // 获取未读的联动记录总数
      this.getUnReadTotal();
      this.activeName = "first";
      // 获取联动记录
      this.getLinkRecordList();
    },
    // 获取未读的联动记录总数
    getUnReadTotal() {
      getUnReadTotal().then((res) => {
        this.unReadNum = res.data;
      });
    },
    // 获取联动记录
    getLinkRecordList() {
      this.loading = true;
      getLinkRecordList(this.linkQueryParams).then((res) => {
        console.log(res.data.records);
        this.recordData = res.data.records.map((item) => {
          return {
            id: item.id,
            title: item.linkName,
            time: item.triggerTime,
            status: item.isVideoDevice,
          };
        });
        this.loading = false;
      });
    },
    // 获取告警记录
    getAlarmRecordList() {
      this.loading = true;
      getAlarmRecordList(this.alarmQueryParams).then((res) => {
        console.log(res);
        this.recordData = res.rows.map((item) => {
          return {
            id: item.alarmHistoryId,
            title: item.alarmName,
            time: item.alarmTime,
            status: item.arrangeStatus,
          };
        });
        this.loading = false;
      });
    },
    // 获取事件记录
    getEventRecordList() {
      this.loading = true;
      getEventList(this.eventQueryParams).then((res) => {
        console.log(res);
        this.recordData = res.rows.map((item) => {
          return {
            id: item.id,
            title: item.eventName,
            time: item.createTime,
            status: item.mode,
          };
        });
        this.loading = false;
      });
    },

    // 切换tab触发
    handleClick(tab) {
      if (tab.index == 0) {
        // 获取联动记录
        this.getLinkRecordList();
      } else if (tab.index == 1) {
        // 获取告警记录
        this.getAlarmRecordList();
      } else {
        // 获取事件记录
        this.getEventRecordList();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.el-icon-message-solid {
  width: 100%;
  height: 70%;
  padding: 0 8px;
  cursor: pointer;
  font-size: 18px;
}

.badge {
  margin-top: -15px;
  margin-left: -5px;
}
</style>