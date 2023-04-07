<!--
 * @Author       : Imor
 * @Date         : 2021-10-11 16:11:09
 * @LastEditTime : 2021-10-15 09:42:28
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\views\visualization\components\CanvasTitle.vue
 * @Description  : 
-->
<template>
  <div class="scene_title">
    <div class="scene_name">{{ sceneName }}</div>
  </div>
</template>

<script>
export default {
  props: {
    sceneName: {
      type: String,
      default: () => {
        return "新华书店";
      },
    },
  },
};
</script>

<style>
.scene_title {
  background-color: #fff;
  height: 60px;
  border-bottom: 1.5px solid #dde2ee;
}
.scene_title .scene_name {
  margin-left: 30px;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  font-weight: 600;
}
</style>