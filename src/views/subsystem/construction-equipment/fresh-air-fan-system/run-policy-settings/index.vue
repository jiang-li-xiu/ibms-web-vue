<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-15 08:31:51
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-09 11:27:23
-->
<template>
  <div class="app-container assembly-container">
    <div class="assembly-container-col">
      <!-- 头部 -->
      <el-form :inline="true" :model="queryParams" ref="queryParams" v-show="showSearch">
        <el-form-item label="策略名称：">
          <el-input
            size="small"
            v-model="queryParams.planName"
            placeholder="请输入策略名称"
          ></el-input>
        </el-form-item>
        <el-form-item label=" " label-width="100px">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 添加和导出 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" @click="handAddEdit()" icon="el-icon-plus"
            >添加</el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <!-- 表格 -->
      <div class="table-container">
        <el-table
          :height="tableHeight"
          :data="tableData"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          tooltip-effect="dark"
          border
        >
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column
            align="center"
            label="消息标题"
            prop="planName"
            width="200"
          ></el-table-column>
          <el-table-column
            align="center"
            label="消息内容"
            prop="planDesc"
          ></el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.pattern == "1"
                    ? "手动发布"
                    : scope.row.pattern == "2"
                    ? "自动发布"
                    : "定时发布"
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="100" label="设置">
            <template slot-scope="scope">
              <div class="state-switch">
                <el-switch
                  v-model="scope.row.isRelease"
                  class="switchStyle"
                  active-color="#13ce66"
                  inactive-color="#989898"
                  active-text="发布"
                  inactive-text="搁置"
                  active-value="发布"
                  inactive-value="搁置"
                  @change="switchChange(scope.row)"
                ></el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发布设备" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-view"
                @click="viewdetailsClick(scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="handAddEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="deleteData(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <pagination
        class="pagination"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <release-management-dialog
      @getList="getList"
      ref="releaseDialog"
    ></release-management-dialog>
    <!-- Cron选择器 -->
    <el-dialog
      title="查看发布设备"
      :visible.sync="seeVisible"
      :width="'50%'"
      @closed="cronVisible = false"
    >
      <el-table style="margin-top: -20px" border :data="dialogTableData">
        <el-table-column
          align="center"
          label="设备名称"
          prop="deviceName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="所属分区"
          prop="regionName"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getInfomationsPlanList,
  deleteInfomationsPlan,
  updateInfomationsPlan,
  getInfomationsList,
} from "@/api/subsystem/information-release/information-release";
import ReleaseManagementDialog from "./RunPolicySettingsDialog.vue";
export default {
  components: { ReleaseManagementDialog },
  data() {
    return {
      seeVisible: false, // 查看设备
      showSearch: true, // 显示搜索条件
      loading: false, // 加载
      // 查询区域的高度
      tableHeight: 100,
      // 请求列表参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planName: "", //消息标题
        isRelease: "", //状态
      },
      total: 0, // 数据量
      tableData: [],
      ids: [],
      dialogTableData: [], //查看设备list
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
    this.getList();
  },
  methods: {
    //删除
    deleteData(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteInfomationsPlan(id).then((response) => {
          if (response.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          }
        });
      });
    },
    //查看设备
    viewdetailsClick(row) {
      getInfomationsList({
        regionId: 0,
        deviceName: "",
      }).then((response) => {
        if (response.code === 200) {
          let arr = row.releaseDevices.split(",");
          let list = [];
          for (const id of arr) {
            for (const item of response.rows) {
              if (id == item.id) {
                list.push(item);
              }
            }
          }
          this.dialogTableData = list;
          this.seeVisible = true;
        }
      });
    },
    //开关
    switchChange(row) {
      updateInfomationsPlan(row)
        .then((response) => {
          if (response.code === 200) {
            this.$message.success(response.message);
            this.$emit("getList");
            this.dialogVisible = false;
          }
        })
        .catch(() => {
          setTimeout(() => {
            row.isRelease == "发布" ? (row.isRelease = "搁置") : (row.isRelease = "发布");
          }, 1000);
        });
    },
    //调用子组件方法
    handAddEdit(row) {
      this.$refs.releaseDialog.handleMessageEdit(row);
    },
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 320;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryParams");
    },
    // table数据请求
    getList() {
      this.loading = true;
      getInfomationsPlanList(this.queryParams).then((response) => {
        let { total, rows } = response;
        this.total = total;
        this.tableData = rows;
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss">
.assembly-container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
.assembly-container-col {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 10px;
}
.query {
  padding-top: 10px;
}
.add-and-export {
  margin-bottom: 20px;
}
.form-item-table {
  padding-top: 20px;
}
.status {
  color: #ccc;
}
.online {
  color: green;
}
/* 按钮样式 */
/* 开关 */
.state-switch {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.state-switch > div:last-child {
  margin-top: 10px;
}
.switchStyle {
  margin-top: 0 !important;
}
.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}

.switchStyle .el-switch__label--left {
  z-index: 9;
  left: 6px;
}

.switchStyle .el-switch__label--right {
  z-index: 9;
  left: -14px;
}

.switchStyle .el-switch__label.is-active {
  display: block;
}

.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 70px !important;
}
</style>
