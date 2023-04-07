<!--
 * @Author: MJ
 * @Date: 2021-10-25 09:18:15
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-08 17:21:50
 * @Description:
-->
<template>
  <div class="reservation-information-table-box">
    <el-form
      :inline="true"
      :model="query"
      ref="formQuery"
      @keyup.enter.native="getList"
    >
      <el-form-item label="会议室名称" prop="meetingName">
        <el-input
          v-model="query.meetingName"
          placeholder="请输入会议室名称"
        ></el-input>
      </el-form-item>

      <el-form-item label-width="130px" label="申请时间" prop="times">
        <el-date-picker
          v-model="query.times"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label=" " label-width="130px">
        <el-button icon="el-icon-search" type="primary" @click="onSubmit"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col>
        <el-button icon="el-icon-download" type="primary">导出</el-button>
      </el-col>
    </el-row>

    <el-row style="margin-top: 1em">
      <el-col>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          border
          :height="tableHeight"
        >
          <el-table-column type="selection" align="center"> </el-table-column>

          <el-table-column label="会议名称">
            <template slot-scope="scope">{{ scope.row.meetingName }}</template>
          </el-table-column>

          <el-table-column prop="meetingContent" label="会议内容">
          </el-table-column>
          <el-table-column prop="meetingUnit" label="开会公司">
          </el-table-column>
          <el-table-column prop="meetingPosition" label="会议地点">
          </el-table-column>
          <el-table-column prop="applicant" label="申请人"> </el-table-column>
          <el-table-column prop="host" label="主持人"> </el-table-column>
          <!-- <el-table-column prop="g" label="出席人数"> </el-table-column> -->
          <el-table-column prop="meetingStatus" label="会议状态">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间">
          </el-table-column>
          <!-- <el-table-column prop="k" label="审批意见"> </el-table-column> -->

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span class="btn-details" @click="details(scope.row.id)"
                >预约详情</span
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.pageNum"
          :limit.sync="query.pageSize"
          :page-sizes="[15, 20, 30, 50]"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <el-dialog
      width="20%"
      title="会议详情"
      :visible.sync="dialogTableVisible"
      @close="closes"
    >
      <el-row>
        <el-col :span="24">
          <div class="title-text">会议室信息</div>
        </el-col>

        <el-col>
          <div class="details-box">
            <div
              class="details-item"
              v-for="item in roomInformation"
              :key="item.id"
            >
              <div v-text="item.title"></div>
              <div>{{ item.value }}</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 1em">
        <el-col :span="24">
          <div class="title-text">会议信息</div>
        </el-col>

        <el-col>
          <div class="details-box">
            <div
              class="details-item"
              v-for="item in meetingInformation"
              :key="item.id"
            >
              <div v-text="item.title"></div>
              <div>{{ item.value }}</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 1em">
        <el-col :span="24">
          <div class="title-text">预约公司信息</div>
        </el-col>

        <el-col>
          <div class="details-box">
            <div
              class="details-item"
              v-for="item in bookingCompanyInformation"
              :key="item.id"
            >
              <div v-text="item.title"></div>
              <div>{{ item.value }}</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="btn-close-box">
        <el-button style="margin-top: 1em" @click="closes">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bus from "@/utils/bus.js";

import {
  getMeetingMeetingList,
  getMeetingMeeting,
} from "@/api/subsystem/conference-room/index.js";

let remould = function (object, template) {
  let newData = [];
  // 注意：必须循环模板
  for (let key in template) {
    newData.push({
      title: template[key],
      value: object[key],
      id: key,
    });
  }
  return newData;
};

export default {
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 15,
        regionId: 0,
        meetingName: "",
        times: null,
      },
      tableData: [],
      tableHeight: 0,
      total: 0,
      dialogTableVisible: false,
      detailsData: [],

      roomInformation: [],
      meetingInformation: [],
      bookingCompanyInformation: [],
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight, true);
    // 获取树形组件回传的数据、子组件互相传值
    bus.$on("busMethod", (data) => {
      this.query.regionId = data.regionId;
      console.log("预约信息查看:", data);
      this.getList();
    });
    this.getList();
  },
  beforeDestroy() {
    bus.$off("busMethod"); // 组件销毁时关闭监听
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight, true);
  },

  methods: {
    // 获取数据
    getList() {
      let { pageNum, pageSize, regionId, meetingName, times } = this.query,
        obj = {
          pageNum,
          pageSize,
          regionId,
          meetingName,
          queryEndDate: times
            ? this.parseTime(times[0], "{y}-{m}-{d} {h}:{i}:{s}")
            : "",
          queryStartDate: times
            ? this.parseTime(times[1], "{y}-{m}-{d} {h}:{i}:{s}")
            : "",
        };
      getMeetingMeetingList(obj).then((response) => {
        let { rows, total } = response;
        this.tableData = rows;
        this.total = total;
      });
    },

    // 获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 520;
    },

    // 详情窗口关闭
    closes() {
      this.roomInformation = [];
      this.meetingInformation = [];
      this.bookingCompanyInformation = [];
      this.dialogTableVisible = false;
    },

    // 查看详情
    details(id) {
      getMeetingMeeting(id).then((response) => {
        let detatil = response.data;

        this.roomInformation = remould(detatil, {
          a: "楼栋",
          meetingPosition: "楼层",
          c: "房号",
        });
        this.meetingInformation = remould(detatil, {
          meetingName: "会议名称",
          meetingContent: "会议内容",
          createTime: "申请时间",
          updateTime: "更新时间",
          startDate: "开始时间",
          endDate: "结束时间",
        });
        this.bookingCompanyInformation = remould(detatil, {
          meetingUnit: "公司名称",
          applicant: "申请人",
          host: "主持人",
          p: "出席人",
          q: "联系电话",
        });

        this.dialogTableVisible = true;
      });
    },

    // 表格多选
    handleSelectionChange(event) {
      console.log(event);
    },

    // 重置
    resetForm() {
      this.$refs["formQuery"].resetFields();
      this.getList();
    },

    // 查询
    onSubmit() {
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.reservation-information-table-box {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 0.7em;
}

.btn-details {
  color: #0000ff;
  cursor: pointer;
}

.title-text {
  // margin-bottom: 1em;
  font-size: 16px;
  font-weight: 600;
}

.details-box {
  width: 100%;
}

.details-item {
  display: flex;
  align-items: center;
  border-top: 1px solid #777;
  border-left: 1px solid #777;
  border-right: 1px solid #777;
}

.details-item:last-child {
  border-bottom: 1px solid #777;
}

.details-item > div {
  padding: 0.5em;
}

.details-item > div:first-child {
  width: 32%;
  background-color: #eee;
  text-align: center;
  border-right: 1px solid #777;
}

.details-item > div:last-child {
  width: 68%;
}

.btn-close-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
