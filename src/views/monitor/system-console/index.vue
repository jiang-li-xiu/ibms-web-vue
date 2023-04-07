<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-26 11:05:00
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-14 14:29:29
-->
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="子系统名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入子系统名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <div v-show="total > 0" class="sub-system-card-style">
      <subsystem-card
        v-for="(item, k) in systemList"
        :systemInfo="item"
        :key="k"
      ></subsystem-card>
    </div>

    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page-sizes="[100, 150, 200, 300]"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <div v-show="total == 0">
      <el-empty description="暂无数据" :image-size="400"></el-empty>
    </div>
  </div>
</template>

<script>
import { listSystem } from "@/api/subsystem/system";

import SubsystemCard from "./SubsystemCard";

export default {
  name: "System",
  components: {
    SubsystemCard,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 子系统管理表格数据
      systemList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        title: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询子系统管理列表 */
    getList() {
      this.loading = true;
      listSystem(this.queryParams).then((response) => {
        this.systemList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
        this.systemList = this.systemList.map((item) => {
          item.isStatus = item.status == "ENABLE" ? true : false;

          return item;
        });
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
.sub-system-card-style {
  height: calc(100vh - 224px);
  overflow-y: scroll;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}
</style>
