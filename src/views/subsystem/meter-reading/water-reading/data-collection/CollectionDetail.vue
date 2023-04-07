<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-26 16:53:05
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-26 17:03:17
-->
<template>
  <el-dialog title="抄表历史记录" :visible.sync="dialogVisible" width="40%">
    <el-table :data="formData" border style="width: 100%">
      <el-table-column label="仪表名称" align="center" prop="meterName" />
      <el-table-column label="上次抄表读数" align="center" prop="oldValue" />
      <el-table-column label="本次抄表读数" align="center" prop="curValue" />
      <el-table-column
        label="抄表日期"
        width="200"
        align="center"
        prop="createTime"
      />
    </el-table>
    <div class="collection-dialog"></div>
  </el-dialog>
</template>
<script>
import {
  getOneByDataId,
} from "@/api/subsystem/meter-reading/pricing-management.js";
export default {
  name: "CollectionDetail",
  components: {},
  props: {},
  data() {
    return {
        dialogVisible: false, //弹框显示
        formData: [], //弹出框数据
    };
  },
  created() {},
  methods: {
      //查看详情
    edit(id) {
      getOneByDataId({ id }).then((response) => {
        this.formData = response.rows;
        this.dialogVisible = true;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
