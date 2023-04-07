<!--
 * @Author       : Imor
 * @Date         : 2021-10-11 15:51:20
 * @LastEditTime : 2021-10-15 09:42:22
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\views\visualization\components\DeviceState.vue
 * @Description  : 
-->
<template>
  <div class="devs_state">
    <ul>
      <li><span class="working"></span><span>工作中</span></li>
      <li><span class="breakdown"></span><span>故障</span></li>
      <li><span class="shutdown"></span><span>关闭</span></li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style>
.devs_state {
  position: absolute;
  left: 40%;
  bottom: 5%;
  z-index: 1;
}
.devs_state ul li {
  display: inline-block;
  margin-right: 40px;
}
.working,
.breakdown,
.shutdown {
  display: inline-block;
  vertical-align: bottom;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 15px;
}
.working {
  background-color: #207bff;
}
.breakdown {
  background-color: #ff3d57;
}
.shutdown {
  background-color: #999999;
}
</style>
