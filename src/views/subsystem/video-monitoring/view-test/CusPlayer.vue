<!--
 * @Author: MJ
 * @Date: 2021-10-11 10:52:03
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-09 09:11:09
 * @Description: 
-->
<template>
  <div
    style="
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <div class="video" v-show="isPlay" :id="elId"></div>

    <div v-show="!isPlay" style="color: #08979c; font-size: 25px">
      暂无视频源
    </div>
  </div>
</template>

<script>
import FlvJsPlayer from "xgplayer-flv.js";
import Player from "xgplayer";
import { v4 } from "uuid";
import ptz from "@/components/XgPlayer/controls/ptz/index.js";

import {
  getControlDirection,
  getZoomInAndOut,
} from "@/api/subsystem/video-monitoring/videomonitor";

export default {
  name: "CusPlayer",
  props: {
    items: {
      type: Object,
    },
  },
  components: {},
  data() {
    return {
      isPlay: false,
      player: null,
      elId: "",
    };
  },
  created() {
    this.elId = v4(); // 避免key重复
  },
  mounted() {
    var that = this;
    document.addEventListener("visibilitychange", function () {
      // console.log(document.visibilityState);
      // console.log(document.hidden);
      if (document.hidden) {
        console.log("页面隐藏");
      }
    });
  },
  methods: {
    createPlayer(deviceCode, url, hasCloseBtn, index) {
      if (!url) {
        return;
      }

      if (this.player) {
        this.changeVideo(url);
        return;
      }

      let query = { channelId: deviceCode };
      // let query = { channelId: 110 };
      this.isPlay = true;
      this.player = new FlvJsPlayer({
        id: this.elId,
        url: url,
        controlPlugins: [ptz],
        // fitVideoSize: 'auto',
        fluid: true,
        autoplay: true,
        isLive: true,
        playsinline: false,
        screenShot: true,
        whitelist: [""],
        ignores: ["time"],
        closeVideoClick: true,
        // errorTips: '<span class="app-error">无视频源</span>',
        customConfig: {
          isClickPlayBack: false,
        },
        flvOptionalConfig: {
          enableWorker: true,
          enableStashBuffer: true, //启用缓存
          stashInitialSize: 4096, //缓存大小4m
          lazyLoad: false,
          lazyLoadMaxDuration: 40 * 60,
          autoCleanupSourceBuffer: true,
          autoCleanupMaxBackwardDuration: 35 * 60,
          autoCleanupMinBackwardDuration: 30 * 60,
        }, //flv.js可选配置项 [flv.js配置](https://github.com/bilibili/flv.js/blob/master/docs/api.md#config)

        customConfig: {
          ptz: {
            active: true,
            deviceId: "123",
            controlFallback: {
              up: (did) => {
                query.direct = 1;
                console.log("向上");
                getControlDirection(query).then((response) => {
                  console.log("向上:", response);
                });
              },
              down: (did) => {
                console.log(did);
                query.direct = 2;
                console.log("向下");
                getControlDirection(query).then((response) => {
                  console.log("向下:", response);
                });
              },
              left: (did) => {
                query.direct = 3;
                console.log("向左");
                getControlDirection(query).then((response) => {
                  console.log("向左:", response);
                });
              },
              right: (did) => {
                query.direct = 4;
                console.log("向右");
                getControlDirection(query).then((response) => {
                  console.log("向右:", response);
                });
              },
              enla: (did) => {
                query.direct = 1;
                console.log("放大");
                getZoomInAndOut(query).then((response) => {
                  console.log("放大:", response);
                });
              },
              shrink: (did) => {
                query.direct = 2;
                console.log("缩小");
                getZoomInAndOut(query).then((response) => {
                  console.log("缩小:", response);
                });
              },
            },
          },
        },
      });

      // 自定义播放器按钮
      // let divStr =
      //   '<em class="btn-hover el-icon-camera button-screen-shot" style="font-size: 23px;margin-right: 10px;pointer-events: auto;"></em>' +
      //   '<em class="btn-hover el-icon-s-tools button-set" style="font-size: 23px;margin-right: 10px;pointer-events: auto;"></em>' +
      //   '<em class="btn-hover el-icon-video-camera-solid button-history" style="font-size: 23px;margin-right: 10px;pointer-events: auto;"></em>';

      let divStr =
        '<em class="btn-hover el-icon-d-arrow-left button-playback" style="font-size: 23px; pointer-events: auto;"></em>';

      let divClose =
        '<em @click="closePlayer" class="btn-hover el-icon-close app-close-btn-c"></em>';

      let util = Player.util;
      // let customBtn = util.createDom('div', divStr, {}, 'flex align-center justify-center app-player-button'); //'div', divStr, {}, 'class'
      let customBtn = util.createDom(
        "div",
        divStr,
        {
          style:
            "width: 40px;heigth:40px;position: absolute;right: 155px;top: 7px;",
        },
        "flex align-center justify-center app-player-button"
      ); //'div', divStr, {}, 'class'
      let closeBtn = util.createDom("div", divClose, {}, "app-close-btn");
      let xgControls = this.player.root.querySelector("xg-controls");
      let xgError = this.player.root.querySelector("xg-error");
      xgControls.appendChild(customBtn);
      this.player.root.appendChild(closeBtn);

      // let shot = customBtn.querySelector('.button-screen-shot');
      // let set = customBtn.querySelector('.button-set');
      // let history = customBtn.querySelector('.button-history');
      let closeBtnc = closeBtn.querySelector(".app-close-btn-c");
      let playback = customBtn.querySelector(".button-playback");

      this.player.on("play", () => {});
      this.player.on("focus", () => {
        if (hasCloseBtn) {
          closeBtn.style.display = "block";
        }
      });
      this.player.on("ended", () => {});
      this.player.on("blur", () => {
        closeBtn.style.display = "none";
      });

      this.player.on("error", () => {});

      if (closeBtnc) {
        closeBtnc.addEventListener("click", () => {
          this.closePlayer();
        });
      }

      // 点击视频时间，设置selectIndex
      this.player.video.addEventListener("click", () => {
        // this.selectIndex = index;
        // this.$parent.setSelectIndex(index);
        this.$emit("clickPlayer", index);
      });

      // if (shot) {
      //   shot.addEventListener('click', () => {
      //     this.screenShot(index);
      //   });
      // }
      // if (set) {
      //   set.addEventListener('click', () => {
      //     this.setPlay(index);
      //   });
      // }
      // if (history) {
      //   history.addEventListener('click', () => {
      //     this.playHistory(index);
      //   });
      // }
    },

    changeVideo(url) {
      this.player.src = url;
    },

    closePlayer() {
      this.isPlay = false;
      if (this.player) {
        this.player.destroy();
      }
    },
  },

  beforeDestroy() {
    if (this.player) {
      this.player.destroy();
    }
    // clearInterval(this.intvBuffer);
    console.log("销毁了");
  },

  // destroyed() {
  //   if(this.player){
  //     this.player.destroy();
  //   }
  // }
};
</script>

<style lang="scss" scoped>
.btn-hover:hover {
  color: #08979c;
  cursor: pointer;
}
.btn-hover {
  color: #ffffff;
}
.video {
  position: relative !important;
  height: 100% !important;
  width: 100% !important;
  padding-top: 0px !important;
}
.app-close-btn {
  position: absolute;
  top: 0px;
  right: 5px;
  z-index: 500;
  display: none;
}
.app-close-btn-c {
  color: #aaffff;
  font-size: 25px;
  pointer-events: auto;
  z-index: 500;
}
</style>
