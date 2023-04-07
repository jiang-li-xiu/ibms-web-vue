<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-07 17:46:16
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-17 09:22:54
-->

<template>
  <div class="container">
    <div class="container-record">
      <el-form
        :inline="true"
        ref="queryForm"
        :model="queryParams"
        class="demo-form-inline"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>

        <el-form-item label="门禁卡号" prop="cardNo">
          <el-input
            v-model="queryParams.cardNo"
            placeholder="请输入门禁卡号"
          ></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <!-- <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
            新增
          </el-button> -->
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
        :row-key="rowKey"
      >
        <el-table-column type="selection" header-align="center" align="center">
        </el-table-column>
        <el-table-column
          label="序号"
          prop="num"
          type="index"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="name"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="门禁卡号"
          prop="cardNo"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="是否指纹录入"
          prop="finger"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="200"
        >
          <template slot-scope="scope">
            <!-- <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >修改
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除
            </el-button> -->
            <el-button icon="el-icon-view" @click="handleDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 新增编辑弹窗 -->
    <add-and-edit-diloag
      ref="modelForm"
      @refresh="getList"
    ></add-and-edit-diloag>

    <!-- 详情弹窗 -->
    <el-dialog
      title="人员信息详情"
      :visible.sync="dialogDetailVisible"
      width="30%"
    >
      <div class="title-value-box">
        <div class="title-value-item" v-for="item in details" :key="item.id">
          <div class="title-box">{{ item.title }}</div>
          <div class="value-box">{{ item.value }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// API
import {
  getPersonnlInfoList,
  deletePersonnlInfo,
  getDetail,
} from "@/api/subsystem/door-lock-management-system/personnelInformationManagement.js";
// 混入
import { TableListMixin } from "@/mixins/TableListMixin";
// 组件
import AddAndEditDiloag from "./AddAndEditDiloag.vue";
export default {
  mixins: [TableListMixin],
  components: { AddAndEditDiloag },
  data() {
    return {
      // 唯一标识
      rowKey: "id",
      // 表单数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        num: "", //序号
        name: "", //姓名
        finger: "", //是否指纹录入
        cardNo: "", //门禁卡
        createTime: null, //创建时间
      },

      dialogDetailVisible: false,
      // 详情
      details: [],
      interface: {
        // 获取人员信息列表
        getTableList: getPersonnlInfoList,
      },
    };
  },
  created() {
    // 获取性别列表字典
    this.getDicts("sys_user_sex").then((res) => {
      this.sexTypeList = res.data;
    });
  },
  methods: {
    /** 删除按钮操作 */
    handleDelete(id) {
      const ids = this.selectedRowKeys || id;
      console.log(ids);
      let that = this;
      that
        .$confirm("是否确认删除此数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function () {
          return deletePersonnlInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    // 打开详情弹窗
    handleDetail(row) {
      console.log(row);
      getDetail(row.id).then(({ data }) => {
        let newData = [],
          template = {
            name: "姓名",
            cardNo: "门禁卡号",
            finger: "是否指纹录入",
            createTime: "创建时间",
          },
          i = 1;

        for (let key in template) {
          newData.push({
            id: i,
            title: template[key],
            value: data[key],
          });
          i++;
        }
        this.details = newData;
        this.dialogDetailVisible = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  padding: 1em;

  .container-record {
    min-height: calc(100vh - 124px);
    background-color: #fff;
    padding: 0.7em;
    border-radius: 0.2em;
  }
}

.title-value-item {
  display: flex;

  .title-box {
    background-color: #eee;
    text-align: center;
    flex: 1;
  }

  .value-box {
    text-align: center;
    flex: 2;
    border-right: 1px solid #777;
  }
}

.title-value-item:first-child {
  border-top: 1px solid #777;
}

.title-value-item > div {
  padding: 0.3em 0;
  border-bottom: 1px solid #777;
  border-left: 1px solid #777;
}
</style>
