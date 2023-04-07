<!--
 * @Author: MJ
 * @Date: 2021-09-16 09:22:51
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-04 11:27:32
 * @Description: 
-->
<template>
  <div class="public-address-settings-box">
    <el-row :gutter="20" type="flex">
      <el-col :span="4">
        <server-information></server-information>
        <!-- <song-sheetList title="歌单列表"></song-sheetList> -->
      </el-col>

      <el-col :span="20">
        <general-control-of-public-address></general-control-of-public-address>
      </el-col>
    </el-row>
    <el-row>
      <broadcasting-equipment></broadcasting-equipment>
    </el-row>
  </div>
</template>

<script>
import ServerInformation from "./ServerInformation";
import SongSheetList from "./SongSheetList.vue";
import GeneralControlOfPublicAddress from "./GeneralControlOfPublicAddress.vue";
import BroadcastingEquipment from "./BroadcastingEquipment";
export default {
  components: {
    ServerInformation,
    SongSheetList,
    GeneralControlOfPublicAddress,
    BroadcastingEquipment,
  },
};
</script>

<style lang="scss" scoped>
.public-address-settings-box {
  padding: 20px;
  box-sizing: border-box;
  background-color: #eee;
}
</style>
