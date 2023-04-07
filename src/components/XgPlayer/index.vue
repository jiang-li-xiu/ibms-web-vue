<!--
 * @Author: Yelucc
 * @Date: 2021-06-30 17:03:18
 * @LastEditors  : Humility
 * @LastEditTime : 2022-06-05 16:21:38
 * @Description: 
-->
<template>
  <div :class="items.isCheck ? 'click' : 'no_click'" class="main" @click="onClicked">
    <div :id="vid" class="player"></div>
    <div style="padding-left: 10px">{{ items.viewName }}</div>
  </div>
</template>

<script>
// 简易引用
import "xgplayer";
import Player from "xgplayer/dist/simple_player";
import FlvPlayer from "xgplayer-flv";
import HlsPlayer from "xgplayer-hls";
import HlsJsPlayer from "xgplayer-hls.js";
import FlvJsPlayer from "xgplayer-flv.js";
// import danmu from 'xgplayer/dist/controls/danmu';
import ptz from "@/components/XgPlayer/controls/ptz/index.js";
// import shaft from "@/components/XgPlayer/controls/shaft/index.js";
// import ptz from "@/components/XgPlayer/controls/xgplayer-source/src/controls/ptz.js";
// import { getUserViewUri } from "@/api/subsystem/videoMonitor/videomonitor";

import {
  getControlDirection,
  getZoomInAndOut,
} from "@/api/subsystem/video-monitoring/videomonitor";

export default {
  name: "XgPlayer",
  props: {
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
    streamType: {
      type: String,
      default: () => "flv", //'hls','flv','xghls','xgflv','mp4'
    },
    source: {
      type: String,
      require: true,
      default: () => "",
    },
    name: {
      type: String,
      require: true,
      default: () => "相机",
    },
    config: {
      type: Object,
      default: () => {
        return {
          // playsinline: true,
          width: 600,
          height: 337.5,
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
    isCheck: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    items: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      // 本例播放器对象
      player: null,
      click: false,
      url: null,
      onplaying: false,
    };
  },

  watch: {
    vid: {
      handler(newVal) {
        console.log("曾孙:", newVal);
      },
      deep: true,
    },
    items: {
      handler(newVal) {
        console.log("曾孙:", newVal);
        this.$forceUpdate();
        // this.player.play();
      },
      deep: true,
    },
    source(newURI) {
      if (this.player) {
        this.player.destroy();
        this.player = null;
        this.initPlay(newURI);
      } else {
        this.initPlay(newURI);
      }
    },
  },

  methods: {
    onClicked() {
      this.$emit("player", {
        id: this.vid,
        selects: "suspend",
        player: this.player,
        items: this.items,
      });
    },

    initPlay(url) {
      let query = { channelId: this.items.channelId };
      var CONF_URL = {
        id: this.vid,
        url: url,
        // controlPlugins: [ptz],
        controlPlugins: [],
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
        // 在这里播放会报错
        // this.player.play();
        this.onplaying = true;
        // this.$emit("player", {id:this.vid,player:this.player});
      });

      this.player.on("canplay", () => {
        this.player.play();
        // this.$emit("player", {id:this.vid,player:this.player});
      });

      this.player.on("pause", () => {
        this.click = true;
        this.$emit("player", {
          id: this.vid,
          selects: "suspend",
          player: this.player,
          items: this.items,
        });
      });

      this.player.on("playing", () => {
        this.click = false;
        this.$emit("player", {
          id: this.vid,
          selects: "player",
          player: this.player,
          items: this.items,
        });
      });
    },
  },

  mounted() {
    if (this.source) {
      this.initPlay(this.source);
    }
  },

  updated() {
    if (this.source) {
      if (!this.onplaying) {
        this.initPlay(this.source);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.main {
}
.player {
}

.click {
  border: 2px solid #ff0000;
}

.no_click {
  border: 2px solid #ffffff;
}
</style>