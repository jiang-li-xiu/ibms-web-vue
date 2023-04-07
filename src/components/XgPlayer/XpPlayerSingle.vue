<!--
 * @Author       : Imor
 * @Date         : 2021-10-18 10:30:47
 * @LastEditTime: 2022-03-30 17:18:15
 * @LastEditors: PengXuanwei
 * @FilePath     : \ibms-web-vue\src\components\XgPlayer\XpPlayerSingle.vue
 * @Description  :
-->
<template>
  <div class="video_container" v-show="playerShow">
    <div :id="vid" class="player"></div>
    <div class="v_title" style="padding-left: 10px">
      <div class="v_devName">{{ devName }}</div>
      <div class="close_button" @click="closeWindow">X</div>
    </div>
  </div>
</template>

<script>
import "xgplayer";
import Player from "xgplayer/dist/simple_player";
import FlvPlayer from "xgplayer-flv";
import HlsPlayer from "xgplayer-hls";
import HlsJsPlayer from "xgplayer-hls.js";
import FlvJsPlayer from "xgplayer-flv.js";
import ptz from "@/components/XgPlayer/controls/ptz/index.js";
import {
  getControlDirection,
  getZoomInAndOut,
} from "@/api/subsystem/video-monitoring/videomonitor";
export default {
  name: "XgPlayerSingle",
  data() {
    return {
      player: null,
      url: null,
      isPlay: false,
    };
  },
  props: {
    devName: {
      type: String,
      default: () => "摄像机",
    },
    vid: {
      type: String,
      default: () => {
        return (
          "V" +
          (Math.round(new Date().valueOf(), 0) + Math.random() * 100)
            .toString()
            .replace(".", "")
        );
      },
    },
    items: {
      type: Object,
      default: () => {
        return {
          // viewName: "摄像机",
          index: 0,
          uri: null,
          channelId: null,
        };
      },
    },
    source: {
      type: String,
      require: true,
      default: () => "",
    },
    streamType: {
      type: String,
      default: () => "flv", //'hls','flv','xghls','xgflv','mp4'
    },
    config: {
      type: Object,
      default: () => {
        return {
          width: 600,
          height: 400,
          fluid: true,
          // fitVideoSize: "fixWidth", //'fixWidth' | 'fixHeight' | 'auto'
          volume: 0, //0-1
          autoplay: true,
          pip: true, // 画中画
          screenShot: true, //截图
          isLive: true, //实时视频
          preloadTime: 10, // 预加载
          minCachedTime: 2, // 当前播放时间距离已缓存资源片段结束点剩多长时间时开始请求新片段(秒)
          cors: true, //请求跨域
          playsinline: true,
          index: 0,
        };
      },
    },
    playerShow: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    //初始化视频参数并创建Player
    initPlay(url) {
      let query = { channelId: this.items.channelId };
      var CONF_URL = {
        id: this.vid,
        url: url,
        controlPlugins: [ptz],
        playsinline: this.config.playsinline,
        width: this.config.width,
        height: this.config.height,
        fluid: this.config.fluid,
        fitVideoSize: this.config.fitVideoSize,
        volume: this.config.volume,
        autoplay: this.config.autoplay,
        pip: this.config.pip,
        screenShot: this.config.screenShot,
        isLive: this.config.isLive,
        preloadTime: this.config.preloadTime,
        minCachedTime: this.config.minCachedTime,
        cors: this.config.cors,
        index: this.items.index,
        customConfig: {
          ptz: {
            active: true,
            deviceId: "123",
            controlFallback: {
              up: (did) => {
                query.direct = 1;
                getControlDirection(query).then((response) => {
                  console.log("向上:", response);
                });
              },
              down: (did) => {
                query.direct = 2;
                getControlDirection(query).then((response) => {
                  console.log("向下:", response);
                });
              },
              left: (did) => {
                query.direct = 3;
                getControlDirection(query).then((response) => {
                  console.log("向左:", response);
                });
              },
              right: (did) => {
                query.direct = 4;
                getControlDirection(query).then((response) => {
                  console.log("向右:", response);
                });
              },
              enla: (did) => {
                query.direct = 1;
                getZoomInAndOut(query).then((response) => {
                  console.log("放大:", response);
                });
              },
              shrink: (did) => {
                query.direct = 2;
                getZoomInAndOut(query).then((response) => {
                  console.log("缩小:", response);
                });
              },
            },
          },
        },
      };
      switch (this.streamType) {
        case "hls": {
          this.player = new HlsJsPlayer(CONF_URL);
          console.log("[Model] : HLS");
          break;
        }
        case "flv": {
          this.player = new FlvJsPlayer(CONF_URL);
          console.log("[Model] : FLV", this.player);
          break;
        }
        case "xghls": {
          this.player = new HlsPlayer(CONF_URL);
          console.log("[Model] : XG-HLS");
          break;
        }
        case "xgflv": {
          this.player = new FlvPlayer(CONF_URL);
          console.log("[Model] : XG-FLV");
          break;
        }
        default: {
          this.player = new Player(CONF_URL);
          console.log("[Model] : MP4");
          break;
        }
      }
      this.player.on("ready", () => {
        this.isPlay = true;
      });
      let that = this;
      //如果视频一直加载不了，左键双击可以关闭视频框
      this.player.on("waiting", function () {
        let dragDiv = document.querySelector(".video_container");
        dragDiv.addEventListener("dblclick", function () {
          that.$emit("close_widow", false);
        });
      });
      // this.player.on("ended", () => {});
      // this.player.on("error", () => {});
      // this.dragWindow();
    },
    //关闭视窗
    closeWindow() {
      if (this.playerShow) {
        this.originWindow();
        this.$emit("close_widow", false);
        this.player.destroy();
        this.player = null;
      }
    },
    //视频可拖拽
    dragWindow() {
      let dragDiv = document.querySelector(".video_container");
      dragDiv.addEventListener("mousedown", function (e) {
        let divRect = dragDiv.getBoundingClientRect();
        let downX = e.clientX;
        let downY = e.clientY;
        let startMove = true;
        dragDiv.style.cursor = "move";
        window.onmousemove = function (e) {
          if (!startMove) {
            return;
          }
          let newLeft = e.clientX - downX + divRect.left - 320;
          let newTop = e.clientY - downY + divRect.top + 130;
          dragDiv.style.left = newLeft + "px";
          dragDiv.style.top = newTop + "px";
          return false;
        };
        window.onmouseup = function (e) {
          startMove = false;
          dragDiv.style.cursor = "default";
          return false;
        };
        e.stopPropagation();
      });
    },
    //拖拽后div位置需要还原
    originWindow() {
      let dragDiv = document.querySelector(".video_container");
      dragDiv.style.left = "";
      dragDiv.style.top = "10%";
    },
  },
  beforeDestroy() {
    if (this.player) {
      this.isPlay = false;
      this.player.destroy();
    }
  },
};
</script>

<style>
.video_container {
  position: absolute;
  left: 0;
  top: 10%;
  background-color: #000;
  width: 600px;
  height: 400px;
  overflow: hidden;
  z-index: 1;
  vertical-align: middle;
}
.video_container:hover > .v_title {
  display: block;
  z-index: 100;
}
.v_title {
  display: none;
  z-index: 100;
  position: absolute;
  top: 0px;
  height: 50px;
  width: 100%;
  color: #fff;
  background-color: rgba(100, 100, 100, 0.205);
  background-image: linear-gradient(#202020, #2e2e2ebe, #ffffff00);
}
.v_devName {
  position: absolute;
  left: 5%;
  height: 50px;
  line-height: 50px;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 2px;
}
.close_button {
  position: absolute;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  text-indent: 0;
  text-align: center;
  font-weight: normal;
  background: rgba(120, 120, 120, 0.5);
  top: 10px;
  right: 2em;
  cursor: pointer;
}
.close_button:hover {
  background: rgba(120, 120, 120);
}
</style>
