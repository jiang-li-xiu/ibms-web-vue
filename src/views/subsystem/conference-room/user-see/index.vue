<!--
 * @Author: MJ
 * @Date: 2021-10-25 15:47:02
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-27 16:22:53
 * @Description: 
-->
<template>
  <div class="app-container conference-room-view-box">
    <el-row :gutter="20">
      <!-- <el-col :span="4"> -->
        <!-- 树形 -->
        <!-- <subsystem-tree :treeData="treeData" title="区域列表"></subsystem-tree>
      </el-col> -->
      
      <el-col :span="24">
        <user-see></user-see>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SubsystemTree from "@/components/SubsystemTree";
import UserSee from "./UserSee";

import { getAreaTree } from "@/api/subsystem/intrusion-alarm";

export default {
  components: {
    SubsystemTree,
    UserSee,
  },
  data() {
    return {
      treeData: [],
    };
  },
  mounted() {
    this.getAreaListTree();
  },

  methods: {
    // 获取属性数据
    getAreaListTree() {
      getAreaTree({ regionId: 0 }).then((res) => {
        this.treeData = res.data;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.conference-room-view-box {
  background-color: #eee;
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
</style>
