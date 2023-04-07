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
  </el-dialog>
</template>
<script>
import { getEquipmentDetails } from "@/api/subsystem/construction-equipment/elevator/ElevatorEquipment.js";

export default {
  name: "ElevatorEquipmentDetail",
  components: {},
  props: {},
  data() {
    return {
      // 详情表格数据
      listDetail: {},
      title: '',
      open: false,
    };
  },
  created() {
  },
  methods: {
    edit(record) {
        getEquipmentDetails({deviceCode: record}).then((response) => {
          this.listDetail = response.data
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