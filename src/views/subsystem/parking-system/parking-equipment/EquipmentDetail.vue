<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-11 10:23:23
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-12 16:56:45
-->
<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="25%"
        append-to-body
    >
      <div class="properties_panel_box">
        <div class="properties_panel_item"
            v-for="(item, index) in formData"
            :key="index"
        >
          <div  v-text="item.title"></div>
          <div>{{ item.value }}</div>
        </div>
      </div>
    </el-dialog>
</template>
<script>
export default {
   name: 'EquipmentDetail',
   components: {},
   props: {},
   data() {
      return {
        // 弹出层标题
        title: "",
        formData: [], //弹出框数据
        dialogVisible: false, //弹框显示
      }
   },
   created(){
   },
   methods:{
       //查看详情
    edit(record) {
      this.dialogVisible = true;
      this.formData = [
        {
          title: "设备名称",
          value: record.deviceName,
        },
        {
          title: "设备ID",
          value: record.deviceAttributeId,
        },
        {
          title: "设备类型",
          value: record.deviceTypeName,
        },
        {
          title: "设备位置",
          value: record.regionName,
        },
        {
          title: "设备状态",
          value: record.isStatus == 0 ? "在线" : "离线",
        },
        {
          title: "创建时间",
          value: record.createTime,
        },
        {
          title: "最后上线时间",
          value: record.updateTime,
        },
        {
          title: "厂家",
          value: record.deviceFactory,
        },
        {
          title: "品牌",
          value: record.deviceBrand,
        },
        {
          title: "连接协议",
          value: record.connectionAgreement,
        },
        {
          title: "备注",
          value: record.remarks,
        },
      ];
    },
   },
}
</script>
<style lang="scss" scoped>
    /* 弹窗（start） */
    .properties_panel_box {
    margin: 0 auto;
    }

    .properties_panel_item {
    display: flex;
    border-bottom: 1px solid #999;
    }

    .properties_panel_item:first-child {
    border-top: 1px solid #999;
    }

    .properties_panel_item > div {
    border-left: 1px solid #999;
    text-align: center;
    padding: 1vh 0;
    }

    .properties_panel_item > div:first-child {
    width: 50%;
    background-color: #eee;
    }

    .properties_panel_item > div:last-child {
    width: 50%;
    border-right: 1px solid #999;
    }
</style>
