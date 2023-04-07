<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 11:25:32
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-22 15:33:04
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
      border
      ref="table"
    >
      <el-table-column width="55" align="center" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备id" align="center" prop="uid" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="250"
      >
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  deleteSmart,
  getDetail,
} from "@/api/subsystem/smart-card-management/smartCardApplication.js";
export default {
  data() {
    return {
      rowKey: "deviceId",
      // 显示弹窗
      visible: false,
      loading: false,
      //控制可编辑
      disableSubmit: false,
      // 标题
      title: "管理设备",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: "",
        deviceName: "",
      },
      // 表格数据
      tableList: [],
      uid: [],
      // 卡号
      cardId: "",
      // 删除需要传的唯一id
      id: "",
    };
  },

  methods: {
    // 关闭弹窗
    close() {
      this.visible = false;
      this.$refs.table.clearSelection();
    },

    // 打开弹窗
    open(row, arr) {
      // console.log(row, arr);
      // 显示弹窗
      this.visible = true;
      // 保存cardId卡号和列表id
      this.cardId = row.cardId;
      this.id = row.id;

      // let uids = row.uid.split(",");
      //因为后端会多返回一个分号，所以把最后一个分号去掉
      // this.uid = uids.slice(0, uids.length - 1);
      // 表格数据
      // this.tableList = this.uid.map((i) => ({ uid: i }));

      // **调详情接口 为了得到设备名称
      getDetail(row.id).then((res) => {
        const tableData = [res.data].map((item, i) => {
          let uids = item.uid.split(",");
          //因为后端会多返回一个分号，所以把最后一个分号去掉
          let uid = uids.slice(0, uids.length - 1);
          let deviceName = item.deviceInfo;
          // 处理数据结构
          let newData = uid.map((item, index) => {
            return {
              uid: item,
              deviceName: deviceName[index],
            };
          });
          this.tableList = newData;
        });
      });
    },

    // 删除
    handleDelete(row) {
      const data = {
        card: this.cardId,
        uid: row.uid,
        id: this.id,
      };
      deleteSmart(data).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          // 刷新列表
          this.$emit("refresh");
        } else {
          this.$message.error("删除失败");
        }
      });
      this.close();
    },
  },
};
</script>

<style></style>
