<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-14 10:41:59
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-14 10:52:07
-->
<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="40%">
      <div class="dialog-form" v-for="(item, index) in formData" :key="index">
        <div class="dialog-form-left">{{ item.name }}</div>
        <div class="dialog-form-right">{{ item.value }}</div>
      </div>
    </el-dialog>
</template>
<script>
export default {
   name: 'AlarmEqptDetail',
   components: {},
   props: {},
   data() {
      return {
        // 弹出框数据
        formData: [],
        dialogVisible: false, //弹框显示
        title: '',
      }
   },
   created(){
   },
   methods:{
    //查看详情
    edit(row) {
      this.dialogVisible = true;
      this.formData = [
        {
          name: "设备名称",
          value: row.deviceName,
        },
        {
          name: "设备ID",
          value: row.deviceCode,
        },
        {
          name: "设备类型",
          value: row.deviceTypeName,
        },
        {
          name: "设备位置",
          value: row.regionName,
        },
        {
          name: "设备状态",
          value: row.isStatus === "0" ? "在线" : "离线",
        },
        {
          name: "创建时间",
          value: row.createTime,
        },
        {
          name: "厂家",
          value: row.deviceBrand,
        },
        {
          name: "品牌",
          value: row.deviceFactory,
        },
        {
          name: "备注",
          value: row.remarks,
        },
      ];
    },
   },
}
</script>
<style lang="scss" scoped>
    /* 弹框 */
    .dialog-form {
    display: flex;
    div {
        flex: 1;
        border: 1px solid #bfbfbf;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-bottom: 0;
    }
    .dialog-form-left {
        background-color: #f2f2f2;
    }
    }
    .dialog-form:last-child {
    border-bottom: 1px solid #bfbfbf;
    }
</style>
