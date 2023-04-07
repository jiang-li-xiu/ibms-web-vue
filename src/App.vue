<!--
 * @Author: MJ
 * @Date: 2021-07-13 09:06:01
 * @LastEditors: MJ
 * @LastEditTime: 2021-09-24 08:36:16
 * @Description: 
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  metaInfo() {
    return {
      title:
        this.$store.state.settings.dynamicTitle &&
        this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title
          ? `${title} - ${process.env.VUE_APP_TITLE}`
          : process.env.VUE_APP_TITLE;
      },
    };
  },
};
</script>
<style lang='scss'>
/* 修改表格的滚动条*/
.el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

/* 表格滚动条的滑块*/
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #409eff;
  border-radius: 10px;
}
</style>
