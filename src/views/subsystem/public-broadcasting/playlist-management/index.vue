<!--
 * @Author: MJ
 * @Date: 2021-09-17 08:47:21
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-25 15:30:53
 * @Description: 
-->
<template>
  <div class="main-box">
    <el-row :gutter="20">
      <el-col :span="4">
        <subsystem-sideBar
          title="歌单列表"
          :list="songSheetData"
        ></subsystem-sideBar>
      </el-col>
      <el-col :span="20">
        <songs-table></songs-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SubsystemSideBar from "@/components/SubsystemSideBar/index.vue";
import SongsTable from "./SongsTable.vue";

import { getSongSheet } from "@/api/subsystem/public-broadcasting";

export default {
  components: {
    SongsTable,
    SubsystemSideBar,
  },
  data() {
    return {
      songSheetData: [],
    };
  },
  mounted() {
    this.getSongSheets();
  },
  methods: {
    // 获取 歌单列表
    getSongSheets() {
      getSongSheet().then((response) => {
        this.songSheetData = response.data.map((item) => {
          item.name = item.dirName;
          return item;
        });
      });
    },
  },
};
</script>

<style lang='scss' scoped>

</style>
