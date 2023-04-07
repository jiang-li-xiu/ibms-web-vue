<!--
 * @Author       : Humility
 * @Date         : 2020-10-29 16:22:59
 * @LastEditTime : 2022-03-25 14:22:59
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\layout\components\UnityView.vue
 * @Description  : Unity视图
-->

<template>
  <div class="div3d">
    <unity
      src="/static/Build/Web.json"
      unityLoader="/static/Build/UnityLoader.js"
      ref="unityvue"
    >
    </unity>
  </div>
</template>

<script>
import Unity from "vue-unity-webgl";
import UnityTool from "@/controller/windowAPI";
import DeviceEditor from "@/api/device/deviceEditor.js";
import ObjManager from "@/controller/unity/objectManager.js";
export default {
  name: "UnityView",
  props: {
    // Unity相对于public下的路径，默认为static
    url: {
      type: String,
      default: () => {
        return "/static";
      },
    },
  },
  computed: {
    hoverDeviceId() {
      return this.$store.state.unityInfo.hoverDeviceId;
    },
    hoverServeId() {
      return this.$store.state.unityInfo.hoverServeId;
    },
  },
  components: {
    Unity,
  },
  watch: {
    hoverDeviceId(newVal) {
      if (newVal.indexOf("Default") > -1) {
        document.getElementById("#canvas").style.cursor = "default";
      } else {
        document.getElementById("#canvas").style.cursor = "pointer";
      }
    },
    hoverServeId(newVal) {
      if (newVal.indexOf("Default") == -1) {
        DeviceEditor.devGet(newVal)
          .then((res) => {
            let dState;
            console.log(res);
            if (res.data.state == "0") {
              dState = "在线";
            } else if (res.data.state == "1") {
              dState = "离线";
            } else {
              dState = "故障";
            }
            // let finalString =
            //   res.data.name +
            //   "_" +
            //   dState +
            //   "_" +
            //   res.data.deviceId +
            //   "_" +
            //   res.data.deviceBrand +
            //   "_" +
            //   res.data.deviceFactory;
            let finalString = {
              devName: res.data.name,
              devState: dState,
              devID: res.data.deviceId,
              devType: res.data.deviceBrand,
              devFactory: res.data.deviceFactory
            }
            ObjManager.sendUIInfo(JSON.stringify(finalString));
          })
          .catch(() => {
            console.log("id错误");
          });
      }
    },
  },
  methods: {},
  created() {
    UnityTool();
  },
  mounted() {
    //将unityvue存入Vuex中
    this.$store.state.unityvue = this.$refs.unityvue;
  },
};
</script>
<style scoped lang='scss' >
.div3d {
  display: block;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>