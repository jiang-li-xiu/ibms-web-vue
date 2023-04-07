<!--
 * @Author       : Imor
 * @Date         : 2022-03-05 11:16:17
 * @LastEditTime : 2022-03-05 14:29:30
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\views\visualization\device-view-3d\index.vue
 * @Description  : 
-->
<template>
  <div class="app-container canvas_manager">
    <div class="scene_canvas">
      <unity-view></unity-view>
    </div>
  </div>
</template>

<script>
import UsceneManager from "@/controller/unity/sceneManager.js";
import UnityView from "@/layout/components/UnityView.vue";
//loading
import PageLoading from "../components/PageLoading";
export default {
  components: {
    UnityView,
    PageLoading,
  },
  data() {
    return {
      loadingIsShow: true,
    };
  },
  mounted() {
    UsceneManager.loadScene("jinxiulincheng");
  },
  computed: {
    isUnityLoad() {
      return this.$store.state.unityInfo.isLoad;
    },
  },
  watch: {
    isUnityLoad(newVal) {
      if (newVal == "success") {
        this.loadingIsShow = false;
      }
    },
  },
  methods: {
    clearInfo() {
      this.$store.commit("upIsLoad", "waiting");
    },
  },
  beforeDestroy() {
    this.clearInfo();
  },
};
</script>

<style>
.scene_canvas {
  height: 100%;
}
</style>