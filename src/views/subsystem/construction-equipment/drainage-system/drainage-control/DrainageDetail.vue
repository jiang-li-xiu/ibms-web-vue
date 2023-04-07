<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-07 16:48:46
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-11 09:03:31
-->

<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="25%"
    append-to-body
  >
    <div class="border" v-for="(item, index) in detailsDataList" :key="index">
      <div class="flex-1">{{ item.title }}</div>
      <div class="flex-1">{{ item.value }}</div>
    </div>
  </el-dialog>
</template>
<script>
import { getEquipmentDetails } from "@/api/subsystem/drainage-system/drainageControl";

export default {
  name: "DrainageDetail",
  components: {},
  props: {},
  data() {
    return {
      // 详情表格数据
      detailsDataList: [],
      title: '',
      open: false,
    };
  },
  created() {
  },
  methods: {
    edit(record) {
        getEquipmentDetails(record).then((response) => {
          this.detailsDataList = [
          {
            title: "高位状态",
            value: (response.data.highLevelStatus = 0 ? "正常" : "过高"),
          },
          {
            title: "低位状态",
            value: (response.data.lowLevelStatus = 0 ? "正常" : "过低"),
          },
          {
            title: "手自动状态",
            value: (response.data.am = 0 ? "正常" : "报警"),
          },
          {
            title: "启停命令",
            value: (response.data.command = 0 ? "正常" : "报警"),
          },
          {
            title: "设备开启状态",
            value: (response.data.onOff = 0 ? "关闭" : "开启"),
          },
          {
            title: "故障状态",
            value: (response.data.fault = 0 ? "正常" : "报警"),
          },
        ];
        });
        this.open = !this.open;
    }
  },
};
</script>
<style lang="scss" scoped>
/* 弹窗（start） */
.border {
  display: flex;
  border-bottom: 1px solid #999;
}

.border:first-child {
  border-top: 1px solid #999;
}

.border > div {
  border-left: 1px solid #999;
  text-align: center;
  padding: 10px 0;
}

.border > div:first-child {
  width: 50%;
  background-color: #eee;
}

.border > div:last-child {
  width: 50%;
  border-right: 1px solid #999;
}
</style>