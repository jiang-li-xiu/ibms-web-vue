<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-01 11:29:19
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-16 17:04:52
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="50%"
    @close="closeCheck"
    append-to-body
  >
    <linkage-detail-dialog :data="dialogData"></linkage-detail-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" type="primary"> 返 回 </el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getLinkRecordDatail,
} from "@/api/linkage/linkRecord";
import LinkageDetailDialog from "@/views/linkage/linkage-record/LinkageDetailDialog";
export default {
  name: "LinkDetails",
  components: {
    LinkageDetailDialog,
  },
  props: {},
  data() {
    return {
      dialogData: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
    };
  },
  created() {},
  methods: {
    closeCheck() {
      this.$emit("ok")
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        linkName: null,
        triggerMode: null,
        triggerTime: null,
      };
      this.resetForm("form");
    },
    // 联动详情
    edit(id) {
      this.reset();
      getLinkRecordDatail(id).then((response) => {
        this.form = response.data;
        this.dialogData = response.data;
        this.open = !this.open;
        this.title = "联动触发详情";
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
