<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-07 11:16:31
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-11 09:04:48
-->

<template>
  <el-dialog :title="title" :visible.sync="open" width="25%" append-to-body>
    <div class="border" v-for="(item, index) in detailsDataList" :key="index">
      <div class="flex-1">{{ item.title }}</div>
      <div class="flex-1">{{ item.value }}</div>
    </div>
  </el-dialog>
</template>
<script>
import { getEquipmentDetails } from "@/api/subsystem/send-exhaust-system/exhaustControl";

export default {
  name: "ExhaustDetail",
  components: {},
  props: {},
  data() {
    return {
      // 详情表格数据
      detailsDataList: [],
      title: "",
      open: false,
    };
  },
  created() {},
  methods: {
    edit(record) {
      getEquipmentDetails({ deviceCode: record }).then((response) => {
        this.detailsDataList = [
          {
            title: "手自动状态",
            value: (response.data.AM = 0 ? "手动" : "自动"),
          },
          {
            title: "设备类型",
            value: (response.data.onOff = 0 ? "关闭" : "开启"),
          },
          {
            title: "报警状态",
            value: (response.data.fault = 0 ? "正常" : "报警"),
          },
          {
            title: "压差状态",
            value: (response.data.DP = 0 ? "关闭" : "开启"),
          },
        ];
      });
      this.open = !this.open;
    },
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
