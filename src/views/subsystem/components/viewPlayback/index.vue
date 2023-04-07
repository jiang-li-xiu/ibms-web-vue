<!--
 * @Author: MJ
 * @Date: 2021-08-31 14:40:37
 * @LastEditors: MJ
 * @LastEditTime: 2021-09-01 09:12:37
 * @Description: 
-->
<template>
  <div @click="onClicked">
    <div :id="vid" class="player" v-if="source"></div>
    <el-empty description="选择视频" v-else></el-empty>
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

// import ptz from "@/components/XgPlayer/controls/ptz/index.js";

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
          width: 600,
          height: 337.5,
          fluid: true,
          volume: 1, // 0静音 1扩音
          autoplay: true,
          pip: false, // 画中画
          screenShot: true,
          isLive: true, // 是否属于直播
          preloadTime: 10, // 预加载
          minCachedTime: 2, // 当前播放时间距离已缓存资源片段结束点剩多长时间时开始请求新片段(秒)
          cors: true,
          playsinline: true,
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
      uri: null,
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
  },

  methods: {
    // 选中的视频
    onClicked() {
      console.log(159);
    },

    initPlay(url) {
      var CONF_URL = {
        id: this.vid,
        url: url,
        // controlPlugins: [ptz],
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
        // 自定义配置
        customConfig: {
          //   ptz: {
          //     active: true,
          //     deviceId: "123",
          //     controlFallback: {
          //       up: (did) => {
          //         console.log(did, "向上");
          //       },
          //       down: (did) => {
          //         console.log(did, "向下");
          //       },
          //       left: (did) => {
          //         console.log(did, "向左");
          //       },
          //       right: (did) => {
          //         console.log(did, "向右");
          //       },
          //       enla: (did) => {
          //         console.log(did, "放大");
          //       },
          //       shrink: (did) => {
          //         console.log(did, "缩小");
          //       },
          //     },
          //   },
        },
      };

      switch (this.streamType) {
        case "hls": {
          this.player = new HlsJsPlayer(CONF_URL);
          break;
        }
        case "flv": {
          this.player = new FlvJsPlayer(CONF_URL);
          break;
        }
        case "xghls": {
          this.player = new HlsPlayer(CONF_URL);
          break;
        }
        case "xgflv": {
          this.player = new FlvPlayer(CONF_URL);
          break;
        }
        default: {
          this.player = new Player(CONF_URL);
          break;
        }
      }

      // 播放 页面加载时执行
      this.player.on("ready", () => {
        console.log("ready");
        this.player.play();
        this.onplaying = true;
        // this.$emit("player", {id:this.vid,player:this.player});
      });

      // 页面加载时执行
      this.player.on("canplay", () => {
        console.log("canplay");
        // this.$emit("player", {id:this.vid,player:this.player});
      });

      // 页面加载时执行（与canplay）轮流执行
      this.player.on("playing", () => {
        console.log("playing");
        this.click = false;
        // this.$emit("player", {id:this.vid,player:this.player});
      });

      // 暂停播放
      this.player.on("pause", () => {
        console.log("pause");
        this.click = true;
        // this.$emit("player", {id:this.vid,player:this.player});
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
  border: 2px solid red;
}
</style>