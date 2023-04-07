<!--
 * @Author: MJ
 * @Date: 2021-09-17 11:36:07
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 16:52:55
 * @Description: 
-->
<template>
  <div class="timed-playback-management-card">
    <el-form>
      <el-form-item>
        <div class="assembly-table-title">{{ title }}</div>
      </el-form-item>

      <div class="padding-left-right-16">
        <el-form-item>
          <el-form :model="queryParams" :inline="true" ref="queryForm">
            <el-form-item label="计划名称：" prop="jobName">
              <el-input
                v-model="queryParams.jobName"
                placeholder="请输入计划名称"
              ></el-input>
            </el-form-item>

            <el-form-item label="启用状态：" prop="status" label-width="120px">
              <el-select
                v-model="queryParams.status"
                placeholder="请选择启用状态"
              >
                <el-option label="正常" value="0"></el-option>
                <el-option label="暂停" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label=" " label-width="120px">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleQuery"
                >查询</el-button
              >
              <el-button icon="el-icon-refresh" plain @click.stop="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="newAddEditTiming('add', null)"
            >新增定时</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-table :height="tableHeight" border :data="tableList">
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column
              align="center"
              label="播放日期"
              prop="dates"
            ></el-table-column>
            <el-table-column
              align="center"
              label="播放时间"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.startTime }} ~ {{ scope.row.endTime }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="计划名称"
              prop="jobName"
            ></el-table-column>

            <el-table-column
              align="center"
              label="播放歌曲"
              prop="directName"
            ></el-table-column>

            <el-table-column
              align="center"
              label="播放模式"
              prop="playModel"
            ></el-table-column>

            <el-table-column align="center" label="是否启用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeSwitch(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  @click="newAddEditTiming('edit', scope.row)"
                >
                  编辑
                </el-button>
                <el-button type="danger" @click.stop="deleteBtn(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            :page-sizes="[10, 15, 20, 30]"
            @pagination="getList"
          />
        </el-form-item>
      </div>
    </el-form>

    <!-- 新增/编辑 -->
    <time-play-detail ref="modelForm" @ok="modalFormOk"></time-play-detail>
  </div>
</template>

<script>
import {
  getJobTable,
  deleteJob,
  putStatus,
} from "@/api/subsystem/public-broadcasting/index";
import TimePlayDetail from "./TimePlayDetail";
import { TableListMixin } from "@/mixins/TableListMixin";

export default {
  mixins: [TableListMixin],
  components: {
    TimePlayDetail,
  },
  props: {
    treeNode: Object,
  },
  data() {
    return {
      title: "全部",
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        jobName: "",
        status: "",
        regionId: "",
      },
      // table数据源
      tableList: [],
      // 数据总数
      total: 0,
      // table遮罩层
      loading: true,
      tableHeight: null,
      dialogFormVisibleText: "新增定时",
      PLAY_MODEL: [],
    };
  },
  mounted() {
    // 获取字典 播放模式
    this.getDicts("PLAY_MODEL").then((response) => {
      this.PLAY_MODEL = response.data;
    });

    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight());
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight());
  },

  methods: {
    // 获取数据列表
    getList() {
      getJobTable(this.queryParams).then((response) => {
        this.loading = true;
        this.tableList = response.rows.map((item) => {
          item.tableList = response.rows;
          item.playModel = this.selectDictLabel(
            this.PLAY_MODEL,
            item.playModel
          );
          item.status = item.status == 0 ? true : false;
          return item;
        });
        this.total = response.total;
        this.loading = false;
      });
    },

    // 修改状态
    changeSwitch(event) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      putStatus(event.jobId).then((response) => {
        this.$message({
          type: "success",
          message: "状态修改成功",
        });
        loading.close();
        this.getList();
      });
    },

    // 删除
    deleteBtn(event) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          deleteJob(event.jobId).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            loading.close();
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 打开新增/编辑面板
    newAddEditTiming(type, data) {
      if (type == "edit") {
        this.$refs.modelForm.edit(type, data);
        this.$refs.modelForm.dialogFormVisibleText = "修改定时";
      } else if (type == "add") {
        this.$refs.modelForm.add(type, data);
        this.$refs.modelForm.dialogFormVisibleText = "新增定时";
      }
    },

    // 获取 table 表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 390;
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

<style lang="scss" scoped>
.timed-playback-management-card {
  min-height: calc(100vh - 124px);
  background-color: #fff;
}

.assembly-table-title {
  letter-spacing: 2px;
  font-weight: 600;
  padding: 10px;
  font-size: 18px;
  border-bottom: 1px solid #d6d6d6;
}

.padding-left-right-16 {
  padding-left: 16px;
  padding-right: 16px;
}
</style>
