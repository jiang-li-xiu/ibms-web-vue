<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-31 14:38:47
 * @LastEditors: MJ
 * @LastEditTime: 2021-09-09 08:48:29
-->
<template>
  <div class="app-container districtmanagement">
    <!-- 顶部绿化面积 -->
    <district-acreage></district-acreage>

    <!-- 树形+table -->
    <div class="districtmanagement-main flex justify-between flex-1 mt-20">
      <!-- 树形 -->
      <district-tree></district-tree>
      
      <!-- 右侧tabel数据 -->
      <district-table></district-table>
    </div>
  </div>
</template>

<script>
import DistrictAcreage from "./DistrictAcreage.vue";
import DistrictTree from "./DistrictTree.vue";
import DistrictTable from "./DistrictTable.vue";
export default {
  name: "DistrictManagement",
  components: {
    DistrictAcreage,
    DistrictTree,
    DistrictTable,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang='scss' >
.districtmanagement {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
</style>