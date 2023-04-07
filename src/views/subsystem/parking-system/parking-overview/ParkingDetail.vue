<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-11 14:20:33
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-12 17:58:44
-->
<template>
    <el-dialog
      :title="formData.title"
      :visible.sync="dialogVisible"
      width="60%"
      append-to-body
    >
      <el-image class="images" :src="formData.inImage"></el-image>
    </el-dialog>
</template>
<script>
export default {
   name: 'ParkingDetail',
   components: {},
   props: {},
   data() {
      return {
        formData: [], //弹出框数据
        //弹框显示
        dialogVisible: false,
      }
   },
   created(){
   },
   methods:{
      //查看详情
      edit(row) {
        this.dialogVisible = true;
        this.formData.inImage = row.inImage;
        this.formData.title =
          "车牌：" +
          row.plateNumber +
          " --- 出入口：" +
          row.inDeviceName +
          " --- 时间：" +
          row.inTime;
      },
   },
}
</script>
<style lang="scss" scoped>
    /* 弹框 */
    .images {
    width: 100%;
    height: 500px;
    }
</style>
