<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 11:25:32
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-22 15:34:06
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    @close="close"
    width="800px"
  >
    <!-- table表格 -->
    <el-table
      v-loading="loading"
      :data="tableList"
      :row-key="rowKey"
      @selection-change="handleSelectionChange"
      border
      ref="table"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        :reserve-selection="true"
      />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备id" align="center" prop="deviceCode" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" @click="submitForm">
        {{ loading ? "提交中..." : "确 定" }}
      </el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addSmart,
  getEquimentList,
} from "@/api/subsystem/smart-card-management/smartCardApplication.js";
import { TableListMixin } from "@/mixins/TableListMixin";
import uniq from "lodash/uniq";
export default {
  mixins: [TableListMixin],
  data() {
    return {
      rowKey: "deviceId",
      // 显示弹窗
      visible: false,
      loading: false,
      //控制可编辑
      disableSubmit: false,
      // 标题
      title: "选择设备",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // 区域ID
        regionId: 0,
        // 设备名称
        name: "",
        // 设备状态
        status: "",
      },
      // 接口集合
      interface: {
        // 获取表格接口
        getTableList: getEquimentList,
      },
      // 多选获取到的deviceCode
      uid: [],
      arr: [],
      id: [],
      selectOldId: [],
      // 保存根据页码的表格数据
      dataSourceList: [],
    };
  },

  methods: {
    // 关闭弹窗
    close() {
      this.visible = false;
      // 清空列表选择
      this.dataSourceList = [];
      this.selectOldId = [];
      this.$refs.table.clearSelection();
    },

    // 打开弹窗
    open(id, arr) {
      // console.log(id, arr);
      this.visible = true;
      // 表格列表
      // this.interface.getTableList();
      this.getList();
      this.arr = arr;
      this.id = id;
      if (id) {
        this.selectedRowKeys.push(this.id);
      }
      this.$nextTick(() => {
        if (arr) {
          // 回显数据
          arr.forEach((row) => {
            this.$refs.table.toggleRowSelection(row, true);
          });
        }
      });
    },

    // 获取列表
    getList() {
      this.loading = true;
      if (!this.dataSourceList[this.queryParams.pageNum]) {
        this.interface
          .getTableList(this.queryParams)
          .then((response) => {
            this.tableList = response.rows || response.data.records;
            this.total = response.total || response.data.total;
            // 保存请求的数据
            this.dataSourceList[this.queryParams.pageNum] =
              response.rows || response.data.records;

            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.tableList = [...this.dataSourceList[this.queryParams.pageNum]];
        this.loading = false;
      }
    },

    /** 表格多选获取id */
    handleSelectionChange(selection) {
      console.log(selection);
      this.selection = selection;
      this.selectedRowKeys = selection.map((item) => item.deviceId);
      this.uid = selection.map((item) => item.deviceCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      // 保存切换分页表格选中的数据
      this.selectOldId = uniq([...this.selectedRowKeys]);
      // console.log(this.selectOldId, this.id);
    },

    // 提交
    submitForm() {
      // 处理表格数组
      let data = [];
      this.dataSourceList.map(function (value, index, array) {
        data = data.concat(value);
      });
      let newSelectedDataRow = data.filter(
        (item) => this.selectOldId.indexOf(item.deviceId) !== -1
      );
      // this.$emit("setSelectUid", this.selectedRowKeys, [...uniq(selection)]);
      // 发射选中的id和行数据
      this.$emit("setSelectUid", this.selectOldId, newSelectedDataRow);
      this.close();
    },
  },
};
</script>

<style></style>
