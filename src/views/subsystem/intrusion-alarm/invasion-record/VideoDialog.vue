<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-03-31 17:45:33
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-07 08:59:39
-->
<template>
  <el-dialog
    title="视频记录回放"
    :visible.sync="visible"
    width="40%"
    :before-close="handleClose"
  >
    <div id="playerId" class="player"></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from "moment";
import FlvJsPlayer from "xgplayer-flv.js";
import { getStreamGetPlaybackStream } from "@/api/subsystem/video-monitoring/videomonitor";
export default {
  name: "VideoDialog",
  props: {},
  data() {
    return {
      visible: false,
      player: null,
    };
  },
  methods: {
    edit(row) {
      this.visible = true;
      let query = {
        deviceCode: row.deviceCode,
        startTime: moment(row.triggerTime)
          .subtract({ second: 30 })
          .format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(row.triggerTime)
          .add({ second: 30 })
          .format("YYYY-MM-DD HH:mm:ss"),
      };
      this.getUrl(query);
    },
    getUrl(query) {
      let that = this;
      getStreamGetPlaybackStream(query)
        .then((response) => {
          return response.data.uri;
        })
        .then((url) => {
          if (that.player) {
            that.player.destroy();
          }
          this.$nextTick().then(() => {
            that.player = new FlvJsPlayer({
              id: "playerId", //选择器
              url: url, //视频源地址
              duration: 60,
              width: 600, //尺寸
              height: 337.5, //尺寸
              fluid: true, //流式布局
              // // fitVideoSize: "fixWidth", //'fixWidth' | 'fixHeight' | 'auto'
              volume: 0.4, //0-1 音量
              autoplay: true, //自动播放
              pip: true, //画中画
              // screenShot: true,//截图？
              //   isLive: true,
              // preloadTime: 10, //预加载
              // minCachedTime: 2, //当前播放时间距离已缓存资源片段结束点剩多长时间时开始请求新片段(秒)
              cors: true,
              playsinline: true,
            });
            that.player.play();
          });
        });
    },
    handleClose() {
      this.visible = false;
    },
  },
};
</script>
<style scoped lang='scss' >
</style>