<!--
 * @Author: MJ
 * @Date: 2021-10-25 15:11:32
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-08 17:23:12
 * @Description: 
-->
<template>
  <div class="app-container conference-room-view-box">
    <div class="reservation-information-table-box">
      <el-form :inline="true" :model="query" ref="formQuery">
        <el-form-item label="物品名称：" prop="resourceName">
          <el-input v-model="query.resourceName" placeholder="请输入物品名称"></el-input>
        </el-form-item>

        <!-- <el-form-item label-width="130px" label="状态：" prop="status">
          <el-select v-model="query.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label=" " label-width="130px">
          <el-button icon="el-icon-search" type="primary" @click="onSubmit"
            >查询</el-button
          >
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

            <el-table-column label="物品编码">
              <template slot-scope="scope">{{ scope.row.resourceCode }}</template>
            </el-table-column>

            <el-table-column prop="resourceName" label="物品名称"> </el-table-column>
            <el-table-column prop="disposable" label="单位"> </el-table-column>
            <el-table-column prop="resourceCount" label="总数"> </el-table-column>
            <el-table-column prop="resourceDesc" label="物品介绍"> </el-table-column>
            <el-table-column prop="measureWord" label="所属公司"> </el-table-column>
            <!-- <el-table-column prop="status" label="状态"> </el-table-column> -->
            <!-- <el-table-column prop="h" label="创建人"> </el-table-column> -->
            <el-table-column prop="createTime" label="创建时间"> </el-table-column>
            <el-table-column prop="updateTime" label="更新时间"> </el-table-column>

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
        title="资源详情"
        :visible.sync="dialogTableVisible"
        @close="closes"
      >
        <el-row>
          <el-col>
            <div class="details-box">
              <div class="details-item" v-for="item in roomInformation" :key="item.id">
                <div v-text="item.title"></div>
                <div class="overflow_y_scroll_0">
                  {{ item.value }}
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="btn-close-box">
          <el-button style="margin-top: 1em" @click="closes">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getMeetingResourceList } from "@/api/subsystem/conference-room/index.js";

export default {
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 15,
        resourceName: "", // 物品名称
        status: null, // 状态
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
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
    this.getDicts().then((response) => {
      console.log(response);
    });
  },
  mounted() {
    this.getList();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight, true);
  },

  methods: {
    // 获取数据
    getList() {
      getMeetingResourceList(this.query).then((response) => {
        console.log("获取数据:", response);
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
        resourceCode: "物品编码",
        resourceName: "物品名称",
        disposable: "单位",
        resourceCount: "总数",
        resourceDesc: "物品介绍",
        measureWord: "所属公司",
        status: "状态",
        createTime: "创建时间",
        updateTime: "更新时间",
      });

      this.dialogTableVisible = true;
    },

    // 表格多选
    handleSelectionChange(event) {
      console.log(event);
    },

    // 导出
    exports() {
      this.$message({
        showClose: true,
        message: "待开发",
        type: "warning",
      });
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
.conference-room-view-box {
  background-color: #eee;
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}

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
  height: 3em;
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
