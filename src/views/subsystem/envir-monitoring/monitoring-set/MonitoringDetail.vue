<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-15 17:02:12
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-15 17:33:53
-->
<template>
  <el-dialog title="监控频率设置" :visible.sync="dialogVisible" width="700px">
      <div class="form-title">
        <h3>监测频率设置：</h3>
        <div class="form-box">
          <el-input
            
            class="form-box-input"
            v-model="frequency"
            type="number"
            :max="60"
            :min="1"
          ></el-input
          >分钟更新一次数据
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine">保 存</el-button>
      </div>
    </el-dialog>
</template>
<script>
import {
  getSetFrequency,
  getDeviceInfo,
} from "@/api/subsystem/envir-monitoring/envir-monitoring.js";
export default {
  name: "MonitoringDetail",
  components: {},
  props: {},
  data() {
    return {
      dialogVisible: false, //弹框显示
      frequency: 30,
    };
  },
  created() {},
  methods: {
      edit() {
        getDeviceInfo({ pageNum: 1, pageSize: 10 }).then((response) => {
            this.frequency = Number(response.rows[0].frequency);
            this.dialogVisible = true;
        });
      },
    //保存
    determine() {
      getSetFrequency({ frequency: this.frequency }).then((response) => {
        if (response.code == 200) {
          this.$message.success(response.msg);
          this.dialogVisible = false;
        } else {
          this.$message.error(response.msg);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/* 弹框 */
.form-title {
  width: 500px;
  margin: auto;
}
.form-box {
  margin-left: 120px;
  .form-box-input {
    width: 100px;
  }
}
</style>
