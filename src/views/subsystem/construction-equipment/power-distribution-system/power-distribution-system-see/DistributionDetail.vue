<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-04-07 11:50:31
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-07 16:23:06
-->
<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="600px"
    :loading="spinning"
    append-to-body
  >
    <div
      class="flex border"
      v-for="(item, key, index) in listDetail"
      :key="index"
    >
      <div class="flex-1">{{ key }}</div>
      <div class="flex-1">{{ item }}</div>
    </div>
  </el-dialog>
</template>

<script>
import { getLisDetail } from "@/api/subsystem/construction-equipment/distribution/distribution-equipment";

export default {
  name: "DistributionDetail",
  props: {},
  data() {
    return {
      // 控制弹窗显隐
      visible: false,
      //   弹窗标题
      title: "设备详情",
      //   详情加载动画
      spinning: false,
      //   详情数据
      listDetail: {},
    };
  },
  methods: {
    edit(id) {
      this.spinning = true;
      getLisDetail({deviceCode: id}).then((response) => {
        this.listDetail = response;
        this.spinning = false;
      });
      this.visible = true;
    },
  },
};
</script>
<style scoped lang='scss' >
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