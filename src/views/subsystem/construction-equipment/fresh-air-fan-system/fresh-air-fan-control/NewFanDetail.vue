<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-04-07 17:01:43
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-11 16:58:41
-->
<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="600px"
    :loading="spinning"
    append-to-body
  >
    <div class="border" v-if="listDetail['新风温度']">
      <div class="flex-1">新风温度</div>
      <div class="flex-1">{{ listDetail['新风温度'] }}</div>
    </div>
    <div class="border" v-if="listDetail['送风机故障报警']">
      <div class="flex-1">送风机故障报警</div>
      <div class="flex-1">{{ listDetail['送风机故障报警'] = 0 ? '正常' : '报警' }}</div>
    </div>
    <div class="border" v-if="listDetail['FILT-状态']">
      <div class="flex-1">FILT-状态</div>
      <div class="flex-1">{{ listDetail['FILT-状态'] = 0 ? '关' : '开' }}</div>
    </div>
    <div class="border" v-if="listDetail['回风温度']">
      <div class="flex-1">回风温度</div>
      <div class="flex-1">{{ listDetail['回风温度'] }}</div>
    </div>
    <div class="border" v-if="listDetail['送风温度']">
      <div class="flex-1">送风温度</div>
      <div class="flex-1">{{ listDetail['送风温度'] }}</div>
    </div>
    <div class="border" v-if="listDetail['送风机手动/自动']">
      <div class="flex-1">送风机手动/自动</div>
      <div class="flex-1">{{ listDetail['送风机手动/自动'] = 0 ? '手动' : '自动' }}</div>
    </div>
    <div class="border" v-if="listDetail['送风机压差状态']">
      <div class="flex-1">送风机压差状态</div>
      <div class="flex-1">{{ listDetail['送风机压差状态'] = 0 ? '关' : '开' }}</div>
    </div>
    <div class="border" v-if="listDetail['回风风阀反馈']">
      <div class="flex-1">回风风阀反馈</div>
      <div class="flex-1">{{ listDetail['回风风阀反馈'] }}</div>
    </div>
    <div class="border" v-if="listDetail['温度']">
      <div class="flex-1">温度</div>
      <div class="flex-1">{{ listDetail['温度'] }}</div>
    </div>
    <div class="border" v-if="listDetail['室外/新风阀反馈']">
      <div class="flex-1">室外/新风阀反馈</div>
      <div class="flex-1">{{ listDetail['室外/新风阀反馈'] }}</div>
    </div>
    <div class="border" v-if="listDetail['回风二氧化碳含量']">
      <div class="flex-1">回风二氧化碳含量</div>
      <div class="flex-1">{{ listDetail['回风二氧化碳含量'] }}</div>
    </div>
    <div class="border" v-if="listDetail['送风机状态']">
      <div class="flex-1">送风机状态</div>
      <div class="flex-1">{{ listDetail['送风机状态'] = 0 ? '关' : '开' }}</div>
    </div>
  </el-dialog>
</template>

<script>
import { getLisDetail } from "@/api/subsystem/construction-equipment/new-fan/new-fan-equipment";

export default {
  name: "NewFanDetail",
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
    open(id) {
      this.spinning = true;
      getLisDetail({ deviceCode: id }).then((response) => {
        this.listDetail = response.data.statusMsg;
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