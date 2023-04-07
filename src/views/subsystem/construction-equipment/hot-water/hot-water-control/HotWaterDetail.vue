<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-05-23 11:31:12
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-23 11:37:11
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="40%"
    append-to-body
  >
    <div class="border" v-for="(item, key, index) in listDetail" :key="index">
      <div class="flex-1">{{ key }}</div>
      <div class="flex-1">{{ item }}</div>
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="参数说明" name="1">
        <div>流量/流动速率: 单位（m/h）</div>
        <div>压差: 单位（pa）</div>
        <div>反馈: 单位（%）</div>       
        <div>温度: 单位（℃）</div>
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>
<script>
import { getEquipmentDetails } from "@/api/subsystem/construction-equipment/hot-water/hotWater.js";

export default {
  name: "HotWaterDetail",
  components: {},
  props: {},
  data() {
    return {
      // 详情表格数据
      listDetail: {},
      title: '',
      open: false,
      activeNames: []
    };
  },
  created() {
  },
  methods: {
    edit(record) {
        getEquipmentDetails({deviceCode: record}).then((response) => {
          this.listDetail = response.data.statusMsg
        });
        this.open = !this.open;
    }
  },
};
</script>
<style lang="scss" scoped>
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