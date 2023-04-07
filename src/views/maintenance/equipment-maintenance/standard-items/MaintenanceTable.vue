<!--
 * @Author: RobertFan
 * @Date: 2022-06-07 15:57:34
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-06-09 16:30:35
 * @Description: 
-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="850px"
      append-to-body
      @close="closeDialog"
    >
      <!-- 查询区域 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="auto"
      >
        <el-form-item label="检查项目:" prop="inspectProject">
          <el-input
            v-model="queryParams.inspectProject"
            placeholder="请输入检查项目"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格区域 -->
      <el-table
        ref="refSelect"
        class="table"
        :row-key="rowKey"
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column
          label="检查项目"
          align="center"
          prop="inspectProject"
        />
        <el-table-column label="步骤指导" align="center" prop="stepGuidance" />
      </el-table>

      <!-- 分页 -->
      <!-- <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      /> -->

      <!-- 底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="submitForm">
          保存
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { TableListMixin } from "@/mixins/TableListMixin";
import { getTableList } from "@/api/maintenance/maintenanceItems";
export default {
  mixins: [TableListMixin],
  data() {
    return {
      rowKey: "maintenanceId",
      // 是否加载
      loading: false,
      // 标题
      title: "选择维保项目",
      // 对话框的显示
      visible: false,
      tableList: [
        { id: "1", inspectProject: "saf", stepGuidance: "hello world" },
        { id: "2", inspectProject: "robert", stepGuidance: "hello world" },
      ],
      // 接口地址
      interface: {
        // 获取表格数据
        getTableList: getTableList,
      },
      // 后端需要的数据
      submitData: {
        maintenanceId: null,
        inspectProject: null,
        stepGuidance: null,
      },
    };
  },
  methods: {
    // 点击添加-选择维保项目
    add() {
      this.visible = true;
    },

    // 取消按钮
    cancel() {
      this.visible = false;
    },

    // 多选获取Id
    handleSelectionChange(row) {
      console.log(row);
      let { maintenanceId, inspectProject, stepGuidance } = row;
      this.submitData.maintenanceId = maintenanceId;
      this.submitData.inspectProject = inspectProject;
      this.submitData.stepGuidance = stepGuidance;
    },

    // 保存按钮
    submitForm() {
      console.log(this.submitData);
      this.$emit("ok", this.submitData);
      this.visible = false;
    },

    // 点击空白处关闭对话框
    closeDialog() {
      this.visible = false;
    },
  },
};
</script>

<style></style>
