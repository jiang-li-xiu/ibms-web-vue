<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-19 10:56:40
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-22 15:32:14
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
        <el-form-item label="卡号" prop="cardId">
          <el-input
            v-model="queryParams.cardId"
            placeholder="请输入卡号"
          ></el-input>
        </el-form-item>

        <el-form-item label="持卡人姓名" prop="personName">
          <el-input
            v-model="queryParams.personName"
            placeholder="请输入持卡人姓名"
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
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
            新增
          </el-button>
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
          label="卡号"
          prop="cardId"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="设备id"
          prop="uid"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="持卡人姓名"
          prop="personName"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="250"
        >
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDelete(scope.row)"
              >管理设备
            </el-button>
            <el-button icon="el-icon-view" @click="handleDetail(scope.row)"
              >设备详情
            </el-button>
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

    <!-- 删除弹窗 -->
    <deleteSelectedUid
      ref="deleteForm"
      @refresh="getList()"
    ></deleteSelectedUid>

    <!-- 详情弹窗 -->
    <el-dialog
      title="设备信息详情"
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
  getList,
  deleteSmart,
  getDetail,
} from "@/api/subsystem/smart-card-management/smartCardApplication.js";
// 混入
import { TableListMixin } from "@/mixins/TableListMixin";
// 组件
import AddAndEditDiloag from "./AddAndEditDiloag.vue";
import deleteSelectedUid from "./deleteSelectedUid.vue";
export default {
  mixins: [TableListMixin],
  components: { AddAndEditDiloag, deleteSelectedUid },
  data() {
    return {
      // 唯一标识
      rowKey: "id",
      // 表单数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cardId: "", //卡号
        personName: "",
        uid: "",
        deviceInfo: "", //设备信息
      },
      dialogDetailVisible: false,
      // 详情
      details: [],
      interface: {
        // 获取列表
        getTableList: getList,
      },
      // 选中的id集合
      ids: [],
      // 选中的卡号集合
      cards: [],
      // 选中的uid
      uids: [],
    };
  },

  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.uids = selection.map((i) => i.uid);
      // 选中的id
      this.ids = selection.map((item) => item.id);
      // 卡号
      this.cards = selection.map((item) => item.cardId);
      this.selectedRowKeys = selection.map((item) => item[this.rowKey]);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    handleDelete(row) {
      this.$refs.deleteForm.open(row);
    },

    // 打开详情弹窗
    handleDetail(row) {
      getDetail(row.id).then(({ data }) => {
        console.log(data);
        let newData = [],
          template = {
            cardId: "卡号",
            uid: "设备id",
            personName: "持卡人姓名",
            deviceInfo: "设备列表",
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
