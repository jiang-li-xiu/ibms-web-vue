<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-14 09:31:07
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-14 10:32:25
-->
<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="30%"
    >
      <div class="dialog-box">
        <div class="dialog-item" v-for="item in detailData" :key="item.id">
          <div v-text="item.title"></div>
          <div v-text="item.value"></div>
        </div>
      </div>
    </el-dialog>
</template>
<script>
export default {
   name: 'BrodcastDeviceViewDetail',
   components: {},
   props: {},
   data() {
      return {
        dialogVisible: false,
        detailData: [],
        title: '',
      }
   },
   created(){
   },
   methods:{
    // 查看详情
    edit(row) {
      this.detailData = [
        {
          title: "设备名称",
          value: row.deviceName,
        },
        {
          title: "设备ID",
          value: row.deviceCode,
        },
        {
          title: "设备类型",
          value: row.deviceTypeName,
        },
        {
          title: "设备位置",
          value: row.regionName,
        },
        {
          title: "设备状态",
          value: row.isStatus === "0" ? "在线" : "离线",
        },
        {
          title: "创建时间",
          value: row.createTime,
        },
        {
          title: "备注",
          value: row.remarks,
        },
      ];
      this.dialogVisible = true;
    },
   },
}
</script>
<style lang="scss" scoped>
    .dialog-box {
    width: 100%;
    }

    .dialog-item {
    border-top: 1px solid #777;
    border-left: 1px solid #777;
    display: flex;
    }

    .dialog-item:last-child {
    border-bottom: 1px solid #777;
    }

    .dialog-item > div {
    display: inline-block;
    text-align: center;
    width: 50%;
    padding: 10px 0;
    }

    .dialog-item > div:first-child {
    background-color: #eee;
    }

    .dialog-item > div:last-child {
    border-left: 1px solid #777;
    border-right: 1px solid #777;
    }
</style>
