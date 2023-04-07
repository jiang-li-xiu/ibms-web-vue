<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-26 14:18:23
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-26 14:32:07
-->
<template>
  <el-dialog
    title="查看发布设备"
    :visible.sync="seeVisible"
    :width="'50%'"
    @closed="cronVisible = false"
  >
    <el-table style="margin-top: -20px" border :data="dialogTableData">
      <el-table-column
        align="center"
        label="设备名称"
        prop="deviceName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="所属分区"
        prop="regionName"
      ></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import {
  getInfomationsList,
} from "@/api/subsystem/information-release/information-release";
export default {
  name: "ReleaseDetail",
  components: {},
  props: {},
  data() {
    return {
      seeVisible: false, // 查看设备
      dialogTableData: [], //查看设备list
    };
  },
  created() {},
  methods: {
    //查看设备
    edit(row) {
      getInfomationsList({
        regionId: 0,
        deviceName: "",
      }).then((response) => {
        if (response.code === 200) {
          let arr = row.releaseDevices.split(",");
          let list = [];
          for (const id of arr) {
            for (const item of response.rows) {
              if (id == item.id) {
                list.push(item);
              }
            }
          }
          this.dialogTableData = list;
          this.seeVisible = true;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
