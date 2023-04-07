<!--
 * @Author       : Imor
 * @Date         : 2021-10-29 15:20:09
 * @LastEditTime: 2022-03-29 11:39:26
 * @LastEditors: PengXuanwei
 * @FilePath     : \ibms-web-vue\src\views\visualization\components\PageLoading.vue
 * @Description  : 
-->
<template>
  <div class="first-loading-wrp" v-show="isShow">
    <div class="loading-wrp">
      <span class="dot dot-spin">
        <em></em>
        <em></em>
        <em></em>
        <em></em>
      </span>
    </div>
    <h2>努力加载中...</h2>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: () => true,
    },
  },
};
</script>

<style>
.first-loading-wrp {
  float: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 5;
}

.first-loading-wrp > h2 {
  font-size: 2vh;
  font-weight: bolder;
}

.first-loading-wrp .loading-wrp {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.6vh 0;
}

.dot {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  width: 7.4vh;
  height: 7.4vh;
  font-size: 64px;
  transform: rotate(45deg);
  animation: antRotate 1.2s infinite linear;
}

.dot em {
  position: absolute;
  display: block;
  width: 3.2vh;
  height: 3.2vh;
  background-color: #1890ff;
  border-radius: 50%;
  opacity: 0.3;
  transform: scale(0.75);
  animation: antSpinMove 1s infinite linear alternate;
}

.dot em:nth-child(1) {
  top: 0;
  left: 0;
}

.dot em:nth-child(2) {
  top: 0;
  right: 0;
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.dot em:nth-child(3) {
  right: 0;
  bottom: 0;
  -webkit-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.dot em:nth-child(4) {
  bottom: 0;
  left: 0;
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}

@keyframes antRotate {
  to {
    -webkit-transform: rotate(405deg);
    transform: rotate(405deg);
  }
}

@-webkit-keyframes antRotate {
  to {
    -webkit-transform: rotate(405deg);
    transform: rotate(405deg);
  }
}

@keyframes antSpinMove {
  to {
    opacity: 1;
  }
}

@-webkit-keyframes antSpinMove {
  to {
    opacity: 1;
  }
}
</style>