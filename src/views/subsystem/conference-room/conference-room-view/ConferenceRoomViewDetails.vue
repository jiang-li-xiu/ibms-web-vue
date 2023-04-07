<!--
 * @Author: MJ
 * @Date: 2021-10-28 09:02:47
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-12-02 18:06:13
 * @Description: 
-->
<template>
  <div class="app-container conference-room-view-box">
    <el-row class="title-box">
      <el-col :span="24">
        <el-page-header @back="goBack"> </el-page-header>
      </el-col>
    </el-row>

    <el-row style="margin-top: 1.7em" :gutter="20">
      <el-col :span="3">
        <div class="back-box">
          <div class="back-rgba-box">
            <div class="numm-status-box">
              <div class="number-box">{{ info.id }}</div>
              <div>
                <span style="color: #67c23a" v-if="info.meetingRoomStatus == 0"
                  >空闲中</span
                >
                <!-- <span style="color: #f56c6c" v-else-if="info.meetingRoomStatus == 1"
                  >停用</span
                > -->

                <span style="color: #e6a23c" v-else-if="info.meetingRoomStatus == 1">使用中</span>
              </div>
            </div>

            <div
              style="
                text-align: center;
                color: #fff;
                font-size: 1.3em;
                margin-top: 2.5em;
              "
            >
              {{ info.roomName }}
            </div>

            <div style="text-align: center; color: #fff; margin-top: 0.1em">
              ({{ info.maximumMembers }}人)
            </div>
          </div>
        </div>

        <div class="content-box">
          <el-row>
            <el-col>
              <span class="title-text">楼栋：</span>
              <span>{{ info.a }}</span>
            </el-col>

            <el-col style="margin-top: 1em">
              <span class="title-text">楼层：</span>
              <span>{{ info.position }}</span>
            </el-col>

            <el-col style="margin-top: 1em">
              <span class="title-text">房间：</span>
              <span>{{ info.d }}</span>
            </el-col>

            <el-col style="margin-top: 1em">
              <span class="title-text">容纳人数：</span>
              <span>{{ info.maximumMembers }}人</span>
            </el-col>

            <!-- <el-col style="margin-top: 1em">
              <div class="title-text">会议设备：</div>
              <div class="equipment-box">
                <span class="equipment-item" v-for="item in info.f" :key="item">{{
                  item
                }}</span>
              </div>
            </el-col> -->

            <!-- <el-col style="margin-top: 1em">
              <div class="title-text">控制：</div>
              <div>
                <div class="control-item" v-for="items in info.g" :key="items.id">
                  <span>{{ items.a }}</span>
                  <el-switch
                    style="margin-left: 2em"
                    v-model="items.v"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="1"
                    inactive-value="0"
                  >
                  </el-switch>
                </div>
              </div>
            </el-col> -->
          </el-row>
        </div>
      </el-col>

      <el-col :span="21">
        <el-row>
          <el-col>
            <el-calendar v-model="calendarValue">
              <template slot="dateCell" slot-scope="{ date, data }">
                <span>{{ data.day.split("-").slice(2)[0] }}</span>
              </template>
            </el-calendar>
          </el-col>

          <el-col>
            <div class="meeting-box">
              <div
                class="meeting-item"
                v-for="itemss in info.meetings"
                :key="itemss.id"
              >
                <div class="time-status-box">
                  <span style="font-size: 24px"
                    >{{ itemss.startDate }}~{{ itemss.endDate }}
                  </span>

                  <span
                    :style="{
                      color: '#0000ff',
                    }"
                    v-if="itemss.meetingStatus == 'SIGNED'"
                  >
                    已预约
                  </span>
                  <span
                    :style="{
                      color: '#777',
                    }"
                    v-if="itemss.meetingStatus == 'END'"
                  >
                    已结束
                  </span>
                  <span
                    :style="{
                      color: '#0000ff',
                    }"
                    v-if="itemss.meetingStatus == 'CANCEL'"
                  >
                    取消
                  </span>
                </div>

                <div class="title-gs-box">
                  <div>
                    <span class="title-text-content">主题：</span>
                    <span>{{ itemss.meetingName }}</span>
                  </div>

                  <div>
                    <span class="title-text-content">公司：</span>
                    <span>{{ itemss.meetingUnit }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getMeetingMeetingRoom } from "@/api/subsystem/conference-room/index.js";

export default {
  data() {
    return {
      id: null,
      info: {},
      calendarValue: "",
    };
  },
  created() {
    this.id = this.$route.params.id;
  },
  mounted() {
    this.getObject();
  },
  watch: {
    calendarValue: {
      handler(newVal) {
        // '{y}-{m}-{d} {h}:{i}:{s}'
        console.log(this.parseTime(newVal, "{y}-{m}-{d}"));
      },
    },
  },

  methods: {
    // 获取数据
    getObject() {
      getMeetingMeetingRoom(this.id).then((response) => {
        console.log(response);
        this.info = response.data;
      });
    },

    // 返回
    goBack() {
      let visitedViews = this.$store.state.tagsView.visitedViews,
        index = visitedViews.findIndex(
          (item) =>
            item.fullPath ==
            "/conferenceRoomViewDetails/ConferenceRoomViewDetails"
        );
      this.$router.push({
        path: "/subsystem/ConferenceRoomView/ConferenceRoomView",
      });
      this.$store.state.tagsView.visitedViews.splice(index, 1);
    },
  },
};
</script>

<style scoped lang="scss">
.conference-room-view-box {
  background-color: #eee;
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}

.title-box {
  background-color: #fff;
  padding: 1em 0.5em;
  border-radius: 0.2em;
}

.back-box {
  background-image: url("https://static.runoob.com/images/mix/bgdesert.jpg");
  background-color: #cccccc;
  height: 12em;
  //   cursor: pointer;
  border-radius: 0.5em 0.5em 0 0;
}

.back-rgba-box {
  width: 100%;
  height: 100%;
  background-color: rgba(10, 10, 10, 0.6);
  padding: 1em;
  border-radius: 0.5em 0.5em 0 0;
}

.number-box {
  color: #fff;
}

.number-box:before {
  display: inline-block;
  content: "";
  width: 0.8em;
  height: 0.8em;
  background-color: #fff;
  margin-right: 0.4em;
  border-radius: 50%;
}

.numm-status-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-box {
  padding: 1em;
  background-color: #fff;
  border-radius: 0 0 0.5em 0.5em;
  min-height: calc(100vh - 404px);
}

.title-text {
  color: #777;
}

.equipment-box {
  margin-top: 0.5em;
}

.equipment-item {
  margin-left: 1em;
  color: #0000ff;
}

.equipment-item:first-child {
  margin-left: 0;
}

.control-item {
  margin-top: 0.5em;
}

.el-calendar {
  border-radius: 0.5em;
}

.is-selected {
  color: #1989fa;
}

.meeting-box {
  height: calc(100vh - 872px);
  overflow-y: scroll;
}

.meeting-box::-webkit-scrollbar {
  width: 0 !important;
}

.meeting-item {
  background-color: #fff;
  padding: 1.3em;
  margin-top: 1em;
  border-radius: 0.5em;
}

.time-status-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #ccc;
}

.title-gs-box {
}

.title-gs-box > div {
  margin-top: 0.5em;
}

.title-text-content {
  color: #777;
}
</style>
