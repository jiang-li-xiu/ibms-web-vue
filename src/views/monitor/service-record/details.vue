<!--
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-10-08 16:53:59
 * @LastEditors: Chen
 * @LastEditTime: 2021-10-09 10:00:38
-->
<template>
  <div>
    <el-dialog
      title="详情"
      :visible.sync="dialogOpen"
      width="780px"
      top="30vh"
      append-to-body
    >
      <el-descriptions class="margin-top" :column="2" :size="size">
        <el-descriptions-item label="实例ID">{{
          form.instanceId
        }}</el-descriptions-item>
        <el-descriptions-item label="服务名">{{
          form.serviceName
        }}</el-descriptions-item>
        <el-descriptions-item label="服务URL">{{
          form.serviceUrl
        }}</el-descriptions-item>
        <el-descriptions-item label="服务健康状态">
          <el-tag size="small">{{ statusFormat(form.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发生时间">{{
          form.occurrenceTime
        }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top" :column="1" :size="size">
        <el-descriptions-item label="详情">
          <div style="overflow: auto; max-height: 600px; min-height: 20px">
            <json-view
              v-if="form.details"
              :data="form.details"
              deep="3"
              theme="one-dark"
              style="heigth: 100%"
            />
            <span v-else>无</span>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import jsonView from "vue-json-views";

export default {
  name: "recordDetails",
  components: { jsonView },
  data() {
    return {
      dialogOpen: false,
      size: "",
      form: {},
      serviceOptions: [],
    };
  },
  methods: {
    init(data) {
      this.dialogOpen = true;

      this.$nextTick(() => {
        this.form = data.form;
        this.serviceOptions = data.options;
      });
    },
    statusFormat(status) {
      return this.selectDictLabel(this.serviceOptions, status);
    },
  },
};
</script>

<style scoped>

</style>