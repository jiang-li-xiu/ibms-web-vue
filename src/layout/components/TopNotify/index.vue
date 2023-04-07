<!--
 * @Author: Yelucc
 * @Date: 2021-08-12 14:01:35
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-24 11:30:43
 * @Description:
-->
<template>
  <div class="top-notify">
    <!-- 消息通知 -->
    <el-dialog
      title="联动详情"
      :visible.sync="notifyOpen"
      width="30%"
      append-to-body
      
    >
      <linkage-detail-dialog :data="dialogData"></linkage-detail-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="notifyOpen = false" type="primary"> 返 回 </el-button>
      </div>
    </el-dialog>
    <!-- 打开视频流 -->
    <el-dialog
      :title="linkName"
      :visible.sync="videoOpen"
      width="50%"
      append-to-body
      @close="close"
    >
      <div :id="vid" class="player"></div>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @close="close" type="primary"> 返 回 </el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
import Stomp from "stompjs";
import FlvJsPlayer from "xgplayer-flv.js";
import LinkageDetailDialog from "@/views/linkage/linkage-record/LinkageDetailDialog";
import { getLinkRecordDatail } from "@/api/linkage/linkRecord";
export default {
  name: "TopNotify",
  components: {
    LinkageDetailDialog,
    // XgPlayer,
  },
  props: {
    mqconf: {
      type: Object,
      default: () => {
        return {
          // baseUri: "ws://10.0.210.21:16674/ws", //北投
          // baseUri: "ws://192.168.11.251:16674/ws", //盛邦
          // baseUri: "ws://45.78.111.158:16674/ws", //麟城
          // baseUri: "ws://http://10.11.1.12:16674/ws", //山西大同
          // baseUri: "ws://192.168.16.233:15674/ws", //新华
          // baseUri: "ws://192.168.1.240:16674/ws", //公司
          baseUri: process.env.VUE_APP_MQ_BASE_URI,
          user: process.env.VUE_APP_MQ_USER,
          password: process.env.VUE_APP_MQ_PASSWORD,
          channels: [
            {
              title: "linkage",
              topic: "/exchange/ibmsplus/linkage",
            },
            {
              title: "notify",
              topic: "/exchange/ibmsplus/notify",
            },
          ],
        };
      },
    },
  },
  data() {
    return {
      // 联动详情显隐
      notifyOpen: false,
      // 联动弹窗显隐
      videoOpen: false,
      // 联动详情
      dialogData: {},
      // 联动弹窗标题
      linkName: "",
      vid: "tempVideo",
      player: null,
    };
  },
  created() {
    this.connet();
  },
  methods: {
    //连接rabbitmq
    connet() {
      let client;
      client = Stomp.client(this.mqconf.baseUri);
      // 重写debug
      client.debug = (msg) => {};
      client.connect(
        this.mqconf.user,
        this.mqconf.password,
        () => {
          // console.log("[STOMP] 消息服务器连接成功");
          this.$notify.success({
            title: "STOMP消息服务",
            message: "消息服务器连接成功",
          });
          client.subscribe(this.mqconf.channels[0].topic, (msg) => {
            let res = JSON.parse(msg.body);
            console.log(res);
            this.notifyHandler(res);
          });
          client.subscribe(this.mqconf.channels[1].topic, (msg) => {
            // console.log(msg);
          });
        },
        (err) => {
          this.$notify.error({
            title: "STOMP消息服务",
            message: "消息服务器连接错误,请联系管理员",
          });
          // this.winNotify(
          //   "[IBMS] STOMP消息服务",
          //   "消息服务器连接失败" + err,
          //   "",
          //   3000
          // );
          this.connet();
        }
      );
      client.heartbeat.outgoing = 20000;
      client.heartbeat.incoming = 20000;
    },
    // 操作钩子
    notifyHandler(obj) {
      if (obj.invoke == "linkNotify") {
        let params = obj.inputData;
        this.linkNotify(
          params.title,
          params.type,
          params.message,
          params.linkRecordId
        );
      } else if (obj.invoke == "linkOpenVideoStream") {
        console.log(obj.inputData);
        let data = obj.inputData;
        this.linkName = data.linkName;
        if (data.streamType == "flv") {
          console.log(this.player);
          if (this.player) {
            this.player.destroy();
          }
          this.$nextTick().then(() => {
            this.player = new FlvJsPlayer({
              id: "tempVideo", //选择器
              url: data.url, //视频源地址
              width: 600, //尺寸
              height: 337.5, //尺寸
              fluid: true, //流式布局
              // // fitVideoSize: "fixWidth", //'fixWidth' | 'fixHeight' | 'auto'
              volume: 0.4, //0-1 音量
              autoplay: true, //自动播放
              pip: true, //画中画
              // screenShot: true,//截图？
              isLive: true,
              preloadTime: 10, //预加载
              minCachedTime: 2, //当前播放时间距离已缓存资源片段结束点剩多长时间时开始请求新片段(秒)
              cors: true,
              playsinline: true,
            });
            console.log(this.player);
            this.player.reload();
          });
          this.videoOpen = true;
        }
      }
    },
    // 联动消息通知钩子
    linkNotify(title, type, message, id) {
      console.log(title, type);
      this.$notify({
        title: title,
        type: type,
        message: message,
        position: "bottom-right",
        onClick: () => {
          getLinkRecordDatail(id).then((response) => {
            this.dialogData = response.data;
            this.notifyOpen = true;
            setTimeout(() => {
              this.open = false;
            }, 10000);
          });
        },
      });
    },
    close(){
      this.videoOpen = false
      if(this.player){
        console.log(this.player);
        this.player.destroy();
      }
      
      console.log(this.player);
    }
  },
};
</script>
<style lang="scss" scoped>
.top-notify {
  display: none;
  // width: 100px;
  // height: 100px;
}
</style>
