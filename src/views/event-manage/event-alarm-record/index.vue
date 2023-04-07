<!--
 * @Author: LuoJiaJu
 * @Date: 2021-09-08 18:06:43
 * @LastEditTime: 2021-11-05 15:28:26
 * @LastEditors: MJ
 * @Description: In User Settings Edit
 * @FilePath:  ibms-web-vue\src\views\subsystem\event-manage\event-alarm-record\index.vue
-->
<template>
  <div class="app-container assembly-container">
    <el-row :gutter="20">
      <!--      <el-col :span="4">-->
      <!--        &lt;!&ndash; 树形 &ndash;&gt;-->
      <!--        <subsystem-tree :treeData="treeData" title="区域列表"></subsystem-tree>-->
      <!--      </el-col>-->
      <el-col :span="24">
        <!-- 右侧tabel数据 -->
        <event-alarm-record class="assembly-container-col"></event-alarm-record>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAreaTree } from "@/api/device/districtManagement";
import SubsystemTree from "@/components/SubsystemTree";
import EventAlarmRecord from "./EventAlarmRecord";

export default {
  name: "ParkingOverview",
  components: {
    SubsystemTree,
    EventAlarmRecord,
  },
  data() {
    return {
      treeData: [], //树形数据
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    // 获取树形数据
    getTree() {
      getAreaTree({ regionId: 0 }).then((response) => {
        this.treeData = response.data;
      });
    },
  },
};
</script>
<style scoped lang="scss">
.assembly-container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
.assembly-container-col {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 10px;
}
</style>
