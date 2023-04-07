<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-15 08:31:51
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-06-06 08:48:11
-->
<template>
  <div class="app-container assembly-container">
    <div class="assembly-container-col">
      <!-- 头部 -->
      <el-form
        :inline="true"
        :model="queryParams"
        ref="queryForm"
        v-show="showSearch"
      >
        <el-form-item label="消息标题" prop="planName">
          <el-input
            v-model="queryParams.planName"
            placeholder="请输入消息标题"
          ></el-input>
        </el-form-item>

        <el-form-item label="状 态" label-width="100px" prop="isRelease">
          <el-select v-model="queryParams.isRelease" placeholder="请选择状态">
            <el-option label="发布" value="发布"></el-option>
            <el-option label="搁置" value="搁置"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 添加和导出 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" @click="handleEdit()" icon="el-icon-plus"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            @click="bindingClick"
            >导出</el-button
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
          :row-key="rowKey"
          :height="tableHeight"
          :data="tableList"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          tooltip-effect="dark"
          border
        >
          <el-table-column
            align="center"
            type="selection"
            width="55"
          ></el-table-column>
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
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" label="发布模式">
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
          <el-table-column align="center" width="100" label="状态">
            <template slot-scope="scope">
              <div class="state-switch">
                <el-switch
                  v-model="scope.row.status"
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
          <el-table-column align="center" label="发布设备" width="200">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-view"
                plain
                @click="viewdetailsClick(scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row.id)"
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
    <!-- 编辑新增弹窗 -->
    <release-management-dialog
      @getList="getList"
      ref="modelForm"
    ></release-management-dialog>
    
    <!-- 查看发布设备详情 -->
    <release-detail
      ref="releaseDetailDialog"
    ></release-detail>
  </div>
</template>

<script>
import {
  getInfomationsPlanList,
  deleteInfomationsPlan,
  updateInfomationsPlan,
  releasePlan,
} from "@/api/subsystem/information-release/information-release";
import ReleaseManagementDialog from "./ReleaseManagementDialog.vue";
import ReleaseDetail from "./ReleaseDetail";
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  components: {
    ReleaseManagementDialog,
    ReleaseDetail,
  },
  data() {
    return {
      rowKey: "id",
      // 查询区域的高度
      tableHeight: 100,
      // 请求列表参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planName: "", //消息标题
        status: "", //状态
      },
      interface: {
        getTableList: getInfomationsPlanList,
        delList: deleteInfomationsPlan,
      },
    };
  },
  created() {
    // 获取表格高度
    this.getHeight();
    // 监听表格高度变化
    window.addEventListener("resize", this.getHeight);
  },
  methods: {
    //查看设备
    viewdetailsClick(row) {
      this.$refs.releaseDetailDialog.edit(row);
    },
    //开关
    switchChange(row) {
      releasePlan(row)
        .then((response) => {
          if (response.code === 200) {
            this.$message.success(response.message);
            this.$emit("getList");
            this.dialogVisible = false;
          }
        })
        .catch(() => {
          setTimeout(() => {
            row.status == "发布"
              ? (row.status = "搁置")
              : (row.status = "发布");
          }, 1000);
        });
    },
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 320;
    },
    // 导出
    bindingClick() {
      const _this = this;
      let msg = "是否确认导出选中数据？";
      if (this.selectedRowKeys.length == 0) {
        msg = "是否确认导出数据？";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (_this.selectedRowKeys.length == 0) {
            _this.download(
              "/infomations/plan/export",
              this.queryParams,
              `抄表数据_${new Date().getTime()}.xlsx`
            );
          } else {
            let url = "/infomations/plan/exportMore/" + this.selectedRowKeys;
            _this.download(url, {}, `抄表数据_${new Date().getTime()}.xlsx`);
          }
        })
        .catch(() => {});
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
