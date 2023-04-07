<!--
 * @Author: MJ
 * @Date: 2021-10-25 16:10:44
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-08 17:29:34
 * @Description: 
-->
<template>
  <div class="reservation-information-table-box">
    <el-form :inline="true" :model="query" ref="formQuery">
      <el-form-item label="用户名称：" prop="userName">
        <el-input v-model="query.userName" placeholder="请输入用户名称"></el-input>
      </el-form-item>

      <el-form-item label=" " label-width="130px">
        <el-button icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col>
        <el-button icon="el-icon-download" type="primary" @click="exports"
          >导出</el-button
        >
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

          <el-table-column label="用户名">
            <template slot-scope="scope">{{ scope.row.userName }}</template>
          </el-table-column>

          <el-table-column prop="loginName" label="登录名"> </el-table-column>
          <el-table-column prop="userCode" label="工号"> </el-table-column>
          <!-- <el-table-column prop="d" label="组织名称"> </el-table-column> -->
          <!-- <el-table-column prop="e" label="邮箱"> </el-table-column> -->
          <el-table-column prop="mobilePhone" label="手机号"> </el-table-column>
          <el-table-column prop="loginTime" label="登陆时间"> </el-table-column>
          <!-- <el-table-column prop="roleName" label="用户类型"> </el-table-column> -->
          <el-table-column prop="roleName" label="权限类型"> </el-table-column>
          <!-- <el-table-column prop="j" label="更新时间"> </el-table-column> -->
          <!-- <el-table-column prop="k" label="所属公司"> </el-table-column> -->

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span class="btn-details" @click="details(scope.row)">详情</span>
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
      width="50%"
      title="会议详情"
      :visible.sync="dialogTableVisible"
      @close="closes"
    >
      <el-row>
        <el-col>
          <div class="details-box">
            <div class="details-item" v-for="item in roomInformation" :key="item.id">
              <div v-text="item.title"></div>
              <div class="overflow_y_scroll_0">{{ item.value }}</div>
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

import { getMeetingMeetingUserList } from "@/api/subsystem/conference-room/index.js";

export default {
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 15,
        userName: "",
      },
      tableData: [],
      tableHeight: 0,
      total: 0,
      dialogTableVisible: false,
      detailsData: [],

      roomInformation: [],
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight, true);
    // 获取树形组件回传的数据、子组件互相传值
    bus.$on("busMethod", (data) => {
      console.log("预约信息查看:", data);
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
      getMeetingMeetingUserList(this.query).then((response) => {
        let { rows, total } = response;
        this.tableData = rows;
        this.total = total;
      });
    },

    // 获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 520;
    },

    // 导出
    exports() {
      this.$message({
        showClose: true,
        message: "待开发",
        type: "warning",
      });
    },

    // 详情窗口关闭
    closes() {
      this.roomInformation = [];
      this.dialogTableVisible = false;
    },

    // 查看详情
    details(data) {
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
      this.roomInformation = remould(data, {
        userId: "用户ID",
        userName: "用户名",
        loginName: "登录名",
        userCode: "工号",
        mobilePhone: "手机号",
        loginTime: "登陆时间",
        roleName: "权限类型",
      });

      this.dialogTableVisible = true;
    },

    // 表格多选
    handleSelectionChange(event) {
      console.log(event);
    },

    // 重置
    resetForm() {
      this.$refs["formQuery"].resetFields();
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
  overflow-y: scroll;
}

.btn-close-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.overflow_y_scroll_0::-webkit-scrollbar {
  width: 0 !important;
}
</style>
