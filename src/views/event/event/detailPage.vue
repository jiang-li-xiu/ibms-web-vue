<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-09-24 16:53:42
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-29 11:36:36
-->
<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
      title="Dialog Titile"
    >
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      formData: {
        field108: 0,
      },
      rules: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs["imageViewForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs["imageViewForm"].validate((valid) => {
        if (!valid) return;
        this.close();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
