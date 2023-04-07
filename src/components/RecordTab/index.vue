<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-03-21 10:54:30
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-16 16:49:14
-->
<template>
  <el-container class="record-tab" v-loading="loading" direction="vertical">
    <!-- 消息记录 -->
    <div
      class="flex-row-csb tab-item"
      v-for="(item, index) in recordData"
      :key="index"
    >
      <!-- 名称、时间 -->
      <div>
        <el-button
          type="text"
          class="title"
          style="color: #207bff"
          @click="handleDetail(item.id, recordType)"
        >
          {{ item.title }}
        </el-button>
        <div class="time">{{ item.time }}</div>
      </div>
      <!-- 联动记录操作 -->
      <div v-if="recordType === 0">
        {{ item.status === 0 ? "未查看" : "已查看" }}
      </div>
      <!-- 告警、事件记录操作 -->
      <div v-else>
        <div
          class="flex align-center"
          style="color: #207bff"
          v-if="item.status == 1"
        >
          <el-button type="text" @click="ignore(item.id, recordType)"
            >忽略</el-button
          >
          <div class="plr-5">|</div>
          <el-button type="text" @click="handleDeal(item.id, recordType)"
            >处理</el-button
          >
        </div>
        <!-- 状态 -->
        <div class="status" v-else>
          {{ item.status == 0 ? "已处理" : "已忽略" }}
        </div>
      </div>
    </div>
    <!-- 查看更多 -->
    <div class="tab-more flex justify-center">
      <el-button type="primary" plain @click="getMore">查看更多</el-button>
    </div>
    <!--  告警记录查看详情   -->
    <popup-details ref="popupDetails"></popup-details>
    <!--  联动记录查看详情   -->
    <link-details ref="linkDetails"></link-details>
    <!-- 弹出处理框 -->
    <popup-dispose
      :optionLoading="optionLoading"
      ref="popupDispose"
      :planList="planList"
    />
  </el-container>
</template>

<script>
import {
  ignoreEvent,
  processEvent,
} from "@/api/common-config/event-manage/event";
import { processingHistory } from "@/api/common-config/event-manage/alarm";
import {
  listPlan,
  postHistoryProcessing,
} from "@/api/common-config/event-manage/plan";
import PopupDispose from "@/components/RecordTab/PopupDispose";
import PopupDetails from "@/components/PopupDetails/index";
import LinkDetails from "@/components/RecordTab/LinkDetails";

export default {
  name: "RecordTab",
  components: {
    PopupDispose,
    PopupDetails,
    LinkDetails,
  },
  props: {
    //
    loading: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    //   消息记录
    recordData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 判断是联动记录还是告警和时间记录
    recordType: {
      type: Number,
      default: () => {
        return 0;
      },
    },
    // 查看更多跳转路由地址
    path: {
      type: String,
      default: () => {
        return "/commonConfiguration/linkage/linkage-record";
      },
    },
  },
  data() {
    return {
      planQuery: {
        planStarts: 1,
      },
      // 事件记录表格数据
      planList: null,
      optionLoading: true,
    };
  },
  created() {},
  computed: {},
  methods: {
    getMore() {
      this.$router.push(this.path);
    },
    // 忽略
    ignore(id, recordType) {
      let func;
      if (recordType == 1) {
        func = postHistoryProcessing;
      } else if (recordType == 2) {
        func = ignoreEvent;
      }
      this.$confirm("是否确认忽略", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          func(id)
            .then((response) => {
              this.$message({
                message: "请求成功",
                type: "success",
              });
              this.getList();
            })
            .catch((err) => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 处理弹出框
    handleDeal(id, recordType) {
      this.optionLoading = true;
      this.listPlanData();
      if (recordType == 1) {
        this.$refs.popupDispose.dispose(id, processingHistory);
      } else if (recordType == 2) {
        this.$refs.popupDispose.dispose(id, processEvent);
      }
      this.optionLoading = false;
    },
    listPlanData() {
      listPlan(this.planQuery).then((response) => {
        this.planList = response.rows;
      });
    },
    // 详情按钮
    handleDetail(id, recordType) {
      if (recordType == 0) {
        this.$refs.linkDetails.edit(id);
      } else {
        this.$refs.popupDetails.detail(id, recordType);
      }
    },
  },
};
</script>
<style scoped lang='scss' >
.tab-item {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.tab-more {
  margin-top: 10px;
}
</style>