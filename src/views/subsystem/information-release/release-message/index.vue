<!--
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-10-08 09:30:07
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-27 09:57:53
-->
<template>
  <div class="main-box">
    <el-card class="min-height-124">
      <!-- 查询选项 -->
      <el-form :model="queryParams" ref="queryForm" :rules="queryFormRules" :inline="true" v-show="showSearch">
        <el-form-item label="消息标题：" prop="programName">
          <el-input v-model="queryParams.programName" placeholder="请输入消息标题" clearable size="small" />
        </el-form-item>
        <el-form-item label=" " label-width="100px">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <el-button type="primary" @click="handleAdd" icon="el-icon-plus">添加</el-button>
        </el-col> -->
        <!-- <el-col :span="1.5">
          <el-button type="danger" @click="handleDelete()" icon="el-icon-delete">删除</el-button>
        </el-col> -->
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <!-- table表格 -->
      <el-table :height="tableHeight" v-loading="loading" :data="tableList" border>
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="ID" align="center" prop="id" />
        <el-table-column label="消息标题" align="center" prop="programName" />
        <el-table-column label="消息内容" align="center" prop="programDesc" show-overflow-tooltip />
        <!-- <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-view" plain @click="viewdetailsClick(scope.row.imgUrls)">查看图片</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"
              v-hasPermi="['system:post:edit']">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"
              v-hasPermi="['system:post:remove']">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </el-card>

    <!-- 查看图片-弹框 -->
    <check-img ref="checkImgClick"></check-img>
    <!-- 添加和修改-弹框 -->
    <edit-dialog ref="modelForm" @ok="modalFormOk"></edit-dialog>
  </div>
</template>

<script>
import {
  getProgramList,
  deleteProgramDelete,
} from "@/api/subsystem/information-release/information-release";
import { TableListMixin } from "@/mixins/TableListMixin";
import CheckImg from "./CheckImg";
import EditDialog from "./EditDialog";

export default {
  mixins: [TableListMixin],
  components: {
    CheckImg,
    EditDialog,
  },
  data() {
    return {
      rowKey: "id",
      tableHeight: 0, //表格高度
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        programName: "", // 消息标题
      },
      // 检索验证
      queryFormRules: {
        programName: [
          {
            validator: this.validateQueryFormRules,
            trigger: ["blur", "change"],
          },
        ],
      },
      interface: {
        getTableList: getProgramList,
        delList: deleteProgramDelete,
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
    //查看图片-弹窗
    viewdetailsClick(imgUrls) {
      console.log(imgUrls.length);
      this.$refs.checkImgClick.viewCheckclick(imgUrls);
    },
    //获取table表格高度
    getHeight() {
      this.tableHeight = window.innerHeight - 320;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
