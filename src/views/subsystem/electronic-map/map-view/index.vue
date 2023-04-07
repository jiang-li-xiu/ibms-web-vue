<!--
 * @Author: LuoJiaJu
 * @Date: 2021-09-08 18:06:43
 * @LastEditTime: 2021-09-17 17:00:13
 * @LastEditors: LuoJiaJu
 * @Description: In User Settings Edit
 * @FilePath:  ibms-web-vue\src\views\subsystem\event-manage\event-alarm-record\index.vue
-->
<template>
  <div class="app-container assembly-container">
    <el-row :gutter="20">
          <el-col :span="4">
            <!-- 树形 -->
            <subsystem-tree :treeData="treeData" title="区域列表"></subsystem-tree>
          </el-col>
      <el-col :span="20">
        <!-- 右侧tabel数据 -->
        <DeviceViewMap class="assembly-container-col"></DeviceViewMap>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAreaTree } from "@/api/device/districtManagement";
import SubsystemTree from "@/components/SubsystemTree";
import DeviceViewMap from "./DeviceViewMap";


export default {
  name: "ParkingOverview",
  components: {
    SubsystemTree,
    DeviceViewMap
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
<style scoped lang='scss' >
.assembly-container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
.assembly-container-col {
  min-height: calc(100vh - 124px);
  background-color: #fff;
}
</style>
