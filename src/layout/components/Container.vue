<!--
 * @Author       : Imor
 * @Date         : 2021-08-23 16:18:42
 * @LastEditTime : 2021-09-15 16:23:17
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\layout\components\Container.vue
 * @Description  : 
-->
<template>
  <div class="layer_control">
    <div class="left">
      <slot name="left"> left-左侧面板 </slot>
    </div>
    <div class="right">
      <slot name="right"> right-右侧面板 </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Container",
};
</script>
<style scoped lang='scss' >
.layer_control{
  display: flex;
  justify-content: space-between;
}
.left {
  position: absolute;
  top: 1vh;
  bottom: 0;
  margin-left: 1vw;
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  z-index: 1;
}
.right {
  position: absolute;
  top: 1vh;
  right: 0;
  bottom: 0;
  margin-right: 1vw;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  left: initial;
  z-index: 1;
}
</style>
