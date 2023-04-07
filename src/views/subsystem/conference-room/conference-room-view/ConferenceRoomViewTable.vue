<!--
 * @Author: MJ
 * @Date: 2021-10-22 16:11:27
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-08 17:14:29
 * @Description: 
-->
<template>
  <div class="">
    <el-row class="title-box">
      <el-col :span="24">
        <span>{{ tableTitle }}</span>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 1em">
      <el-col :span="4" v-for="item in tableData" :key="item.id">
        <div class="back-box" @click="details(item)">
          <div class="back-rgba-box">
            <div class="numm-status-box">
              <div class="number-box">{{ item.id }}</div>
              <div>
                <span style="color: #67c23a" v-if="item.meetingRoomStatus == 0"
                  >空闲中</span
                >
                <!-- <span style="color: #f56c6c" v-else-if="item.meetingRoomStatus == 1"
                  >停用</span
                > -->

                <span style="color: #e6a23c" v-else-if="item.meetingRoomStatus == 1">使用中</span>
              </div>
            </div>

            <div
              style="text-align: center; color: #fff; font-size: 1.3em; margin-top: 2.5em"
            >
              {{ item.roomName }}
            </div>

            <div style="text-align: center; color: #fff; margin-top: 0.1em">
              ({{ item.maximumMembers }}人)
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- <el-row>
      <el-col>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          :page-sizes="[15, 20, 30, 50]"
          @pagination="getList"
        />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { getMeetingMeetingRoomList } from "@/api/subsystem/conference-room/index.js";

export default {
  props: {
    treeNode: Object,
  },
  data() {
    return {
      tableTitle: "全部",
      tableData: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        regionId: 0,
      },
      tableHeight: 0,
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight, true);
  },
  mounted() {
    this.getList();
  },

  methods: {
    // 获取数据
    getList() {
      getMeetingMeetingRoomList(this.queryParams).then((response) => {
        let { rows, total } = response;
        this.tableData = rows;
        this.total = total;
      });
    },

    // 获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 520;
    },

    // 跳转详情页
    details(item) {
      this.$router.push({
        name: "ConferenceRoomViewDetails",
        params: { id: item.id },
      });
    },
  },
  watch: {
    treeNode: {
      handler(newVal) {
        this.queryParams.regionId = newVal.regionId;
        this.tableTitle = newVal.regionName;
        this.getList();
      },
    },
  },
};
</script>

<style scoped lang="scss">
.title-box {
  background-color: #fff;
  padding: 1em 0.5em;
  border-radius: 0.2em;
}

.back-box {
  margin-top: 1em;
  background-image: url("~@/assets/images/meeting_room.svg");
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: #cccccc;
  height: 12em;
  cursor: pointer;
  border-radius: 0.5em;
}

.back-rgba-box {
  width: 100%;
  height: 100%;
  background-color: rgba(96, 96, 96, 0.1);
  padding: 1em;
  border-radius: 0.5em;
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
</style>
