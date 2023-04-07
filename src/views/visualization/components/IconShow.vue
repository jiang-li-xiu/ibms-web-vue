<!--
 * @Author       : Imor
 * @Date         : 2021-10-11 16:00:25
 * @LastEditTime: 2022-03-29 11:39:17
 * @LastEditors: PengXuanwei
 * @FilePath     : \ibms-web-vue\src\views\visualization\components\IconShow.vue
 * @Description  : 
-->
<template>
  <div class="icons_show" v-show="iconTitleShow">
    <div class="icon_title">图标:</div>
    <ul>
      <li v-for="(t, i) in typeList" :key="i">
        <span class="icon_img">
          <img :src="require(`@/assets/images/modelsPreviews/${t.type}.png`)" />
        </span>
        <span class="icon_name">{{ t.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    typeList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    iconTitleShow: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
};
</script>

<style>
.icons_show {
  position: absolute;
  left: 4%;
  bottom: 5%;
  z-index: 1;
}
.icons_show .icon_title {
  font-weight: 600;
  font-size: 22px;
  letter-spacing: 3px;
  margin-bottom: 15px;
}
.icons_show .icon_img {
  display: inline-block;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  text-align: center;
  background-color: #207bff;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  box-shadow: 0 0 10px rgb(72, 151, 255, 0.6);
}
.icons_show .icon_img img {
  margin-top: 3px;
  width: 80%;
  height: 80%;
}
.icons_show .icon_name {
  padding-top: 3px;
  font-size: 18px;
}
.icons_show ul li {
  margin-bottom: 15px;
}
</style>