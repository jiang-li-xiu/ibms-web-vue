<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-11 15:19:58
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-13 11:55:54
-->
<template>
    <el-dialog
      :title="formData.title"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-image class="images" :src="imageUrl"></el-image>
    </el-dialog>
</template>
<script>
import { getParkingImageUrl } from "@/api/subsystem/parking-system/parking-system.js";

export default {
   name: 'AccessDetail',
   components: {},
   props: {},
   data() {
      return {
        dialogVisible: false, //弹框显示
        formData: {}, //弹框数据
        imageUrl: "",
      }
   },
   created(){
   },
   methods:{
       //查询图片url
        getImageUrl(pictureFile) {
          console.log(pictureFile);
          getParkingImageUrl({pictureFile:pictureFile}).then(res=>{
            this.imageUrl = res.data;
            this.dialogVisible = true;
          })
          
          
        },
        //查看详情
        edit(row) {
          this.formData.title =
              "车牌：" +
              row.plateNo +
              " --- " +
              row.recordType +
              "闸口：" +
              row.deviceName +
              " --- 时间：" +
              row.recordTime;
          this.getImageUrl(row.carImageUrl);
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
