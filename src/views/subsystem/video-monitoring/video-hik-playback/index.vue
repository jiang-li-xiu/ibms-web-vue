<!--
 * @Author: MJ
 * @Date: 2021-10-11 10:24:50
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-31 10:01:14
 * @Description: 
-->
<template>
  <div class="access-control-record-box">
    <el-row>
      <!-- 左侧 -->
      <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="8">
        <div class="left_modular_box video-monitor-system-card">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>

          <!-- 树形 -->
          <div
            class="overflow_y_scroll overflow_y_scroll_0"
            style="height: 36em; margin-top: 1em"
          >
            <el-tree
              ref="tree"
              :data="videoDeviceTreeData"
              :props="videoDeviceTreeProps"
              :filter-node-method="filterNode"
              @node-click="videoDeviceTreeNodeClick"
              accordion
            >
              <div class="custom_tree_node" slot-scope="{ node, data }">
                <div>{{ node.label }}</div>

                <div v-if="data.type == 1">
                  <svg
                    t="1628576508832"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2962"
                    width="24"
                    height="24"
                  >
                    <path
                      d="M682.666667 426.666667l139.797333-69.888a21.333333 21.333333 0 0 1 30.869333 19.072v272.298666a21.333333 21.333333 0 0 1-30.869333 19.072L682.666667 597.333333v85.333334a85.333333 85.333333 0 0 1-85.333334 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333V341.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h341.333333a85.333333 85.333333 0 0 1 85.333334 85.333333v85.333334z m-138.901334 98.453333a21.333333 21.333333 0 0 0 0-37.376l-147.733333-81.258667a21.333333 21.333333 0 0 0-31.616 18.709334v162.496a21.333333 21.333333 0 0 0 31.616 18.688l147.733333-81.258667z"
                      :fill="data.isStatus == '0'?'#068d58':'#FF0000'"
                      p-id="2963"
                    ></path>
                  </svg>
                </div>
              </div>
            </el-tree>
          </div>

          <div>
            <div class="mb8">开始时间：</div>
            <el-date-picker
              v-model="startTimeStamp"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
            >
            </el-date-picker>
          </div>

          <div style="margin-top: 1em">
            <div class="mb8">结束时间：</div>

            <el-date-picker
              v-model="endTimeStamp"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>

      <!-- 右侧 -->
      <el-col :xl="20" :lg="18" :md="18" :sm="16" :xs="16" ref="right">
        <!--视频窗口展示-->
        <div id="playWnd" class="playWnd"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import "xgplayer";
import "@/utils/hik/jsencrypt.min.js";
import {
  WebControl,
  cbIntegrationCallBack,
} from "@/utils/hik/jsWebControl-1.0.0.min.js";
import FlvJsPlayer from "xgplayer-flv.js";

import {
  listVideoDevice,
  getStreamUrlByDeviceId,
  putVideoView,
  postVideoView,
  postVideoViewAddCamera,
  deleteVideoViewDeleteCamera,
  deleteVideoViewDelete,
  getVideoDeviceHikInfo,
} from "@/api/subsystem/video-monitoring/videomonitor";

let initCount = 0;
let pubKey = "";
let oWebControl = null;

export default {
  components: {},
  data() {
    return {
      startTimeStamp: new Date(
        new Date(new Date().toLocaleDateString()).getTime()
      ),
      endTimeStamp: new Date(),
      videoDeviceTreeData: [], // 视频设备树
      videoDeviceTreeProps: {
        children: "children",
        label: "label",
      },
      filterText: "", // 树形搜索
      treeArr: [],
    };
  },
  mounted() {
    this.initPlugin();
    this.listVideoDevices();
    console.log(this.$refs.right.$el.clientWidth);
    window.addEventListener("resize", this.getHW);
  },
  destroyed() {
    oWebControl.JS_HideWnd();
    oWebControl.JS_Disconnect().then(
      function () {
        console.log("断开与插件服务连接成功");
      },
      function () {
        console.log("断开与插件服务连接失败");
      }
    );
    window.removeEventListener("resize", this.getHW);
  },
  watch: {
    // 树形搜索
    filterText(val) {
      if (!val) {
        this.treeArr = null;
      }
      this.$refs.tree.filter(val);
    },
  },

  methods: {
    getHW() {
      if (oWebControl != null) {
        oWebControl.JS_Resize(
          this.$refs.right.$el.clientWidth - 20,
          window.innerHeight - 123
        );
        // this.setWndCover();
      }
    },
    initPlugin() {
      let that = this;
      oWebControl = new WebControl({
        szPluginContainer: "playWnd", //指定容器id
        iServicePortStart: 15900, //指定起止端口号，建议使用该值
        iServicePortEnd: 15909,
        cbConnectSuccess: function () {
          // setCallbacks();
          //实例创建成功后需要启动服务
          oWebControl
            .JS_StartService("window", {
              dllPath: "./VideoPluginConnect.dll",
            })
            .then(
              function () {
                oWebControl
                  .JS_CreateWnd(
                    "playWnd",
                    that.$refs.right.$el.clientWidth - 20,
                    window.innerHeight - 123
                  )
                  .then(function () {
                    //JS_CreateWnd创建视频播放窗口，宽高可设定
                    that.init(); //创建播放实例成功后初始化
                  });
              },
              function () {}
            );
        },
        cbConnectError: function () {
          oWebControl = null;
          $("#playWnd").html("插件未启动，正在尝试启动，请稍候...");
          WebControl.JS_WakeUp("VideoWebPlugin://"); //程序未启动时执行error函数，采用wakeup来启动程序
          initCount++;
          if (initCount < 3) {
            setTimeout(function () {
              that.initPlugin();
            }, 3000);
          } else {
            $("#playWnd").html("插件启动失败，请检查插件是否安装！");
          }
        },
        cbConnectClose: function () {
          oWebControl = null;
        },
      });
    },

    // 设置窗口控制回调
    setCallbacks() {
      oWebControl.JS_SetWindowControlCallback({
        cbIntegrationCallBack: cbIntegrationCallBack,
      });
    },

    // 推送消息
    cbIntegrationCallBack(oData) {
      showCBInfo(JSON.stringify(oData.responseMsg));
    },

    //获取公钥
    getPubKey(callback) {
      oWebControl
        .JS_RequestInterface({
          funcName: "getRSAPubKey",
          argument: JSON.stringify({
            keyLength: 1024,
          }),
        })
        .then(function (oData) {
          if (oData.responseMsg.data) {
            pubKey = oData.responseMsg.data;
            callback();
          }
        });
    },

    init() {
      let that = this;
      that.getPubKey(function () {
        getVideoDeviceHikInfo().then(({ data: { appKey, secret, ip } }) => {
          ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
          var appkey = appKey; //综合安防管理平台提供的appkey，必填
          var secret = that.setEncrypt(secret); //综合安防管理平台提供的secret，必填
          var ip = ip; //综合安防管理平台IP地址，必填
          var playMode = 1; //初始播放模式：0-预览，1-回放
          var port = 443; //综合安防管理平台端口，若启用HTTPS协议，默认443
          var snapDir = "D:\\SnapDir"; //抓图存储路径
          var videoDir = "D:\\VideoDir"; //紧急录像或录像剪辑存储路径
          var layout = "1x1"; //playMode指定模式的布局
          var enableHTTPS = 1; //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
          var encryptedFields = "secret"; //加密字段，默认加密领域为secret
          var showToolbar = 1; //是否显示工具栏，0-不显示，非0-显示
          var showSmart = 1; //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
          var buttonIDs =
            "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769"; //自定义工具条按钮
          //var reconnectTimes = 2;                            // 重连次数，回放异常情况下有效
          //var reconnectTime = 4;                             // 每次重连的重连间隔 >= reconnectTime
          ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////

          oWebControl
            .JS_RequestInterface({
              funcName: "init",
              argument: JSON.stringify({
                appkey: appkey, // API网关提供的appkey
                secret: secret, // API网关提供的secret
                ip: ip, // API网关IP地址
                playMode: playMode, // 播放模式（决定显示预览还是回放界面）
                port: port, // 端口
                snapDir: snapDir, // 抓图存储路径
                videoDir: videoDir, // 紧急录像或录像剪辑存储路径
                layout: layout, // 布局
                enableHTTPS: enableHTTPS, // 是否启用HTTPS协议
                encryptedFields: encryptedFields, // 加密字段
                showToolbar: showToolbar, // 是否显示工具栏
                showSmart: showSmart, // 是否显示智能信息
                buttonIDs: buttonIDs, // 自定义工具条按钮
                //reconnectTimes：reconnectTimes,            //重连次数
                //reconnectDuration：reconnectTime           //重连间隔
              }),
            })
            .then(function (oData) {
              that.getHW(); // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
            });
        });
      });
    },

    //RSA加密
    setEncrypt(value) {
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(pubKey);
      return encrypt.encrypt(value);
    },

    // 树形搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    hikPlay(deviceCode) {
      var cameraIndexCode = deviceCode; //获取输入的监控点编号值，必填
      // var startTimeStamp = new Date(startTime.replace(/-/g, "/")).getTime(); //回放开始时间戳，必填
      // var endTimeStamp = new Date(endTime.replace(/-/g, "/")).getTime(); //回放结束时间戳，必填

      var startTimeStamp = this.startTimeStamp.getTime(); //回放开始时间戳，必填
      var endTimeStamp = this.endTimeStamp.getTime(); //回放结束时间戳，必填

      console.log(":", startTimeStamp, endTimeStamp);

      var recordLocation = 1; //录像存储位置：0-中心存储，1-设备存储
      var transMode = 1; //传输协议：0-UDP，1-TCP
      var gpuMode = 0; //是否启用GPU硬解，0-不启用，1-启用
      var wndId = -1; //播放窗口序号（在2x2以上布局下可指定播放窗口）

      oWebControl.JS_RequestInterface({
        funcName: "startPlayback",
        argument: JSON.stringify({
          cameraIndexCode: cameraIndexCode, //监控点编号
          startTimeStamp: Math.floor(startTimeStamp / 1000).toString(), //录像查询开始时间戳，单位：秒
          endTimeStamp: Math.floor(endTimeStamp / 1000).toString(), //录像结束开始时间戳，单位：秒
          recordLocation: recordLocation, //录像存储类型：0-中心存储，1-设备存储
          transMode: transMode, //传输协议：0-UDP，1-TCP
          gpuMode: gpuMode, //是否启用GPU硬解，0-不启用，1-启用
          wndId: wndId, //可指定播放窗口
        }),
      });
    },

    // 监控点列表
    listVideoDevices() {
      listVideoDevice().then((res) => {
        this.videoDeviceTreeData = res.data;
      });
    },

    // 监控点列表 请求 播放 数据
    videoDeviceTreeNodeClick(data) {
      if (data.type == 1) {
        this.hikPlay(data.deviceCode);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.access-control-record-box {
  padding: 20px;
  background-color: #eee;
}
.playWnd {
  margin-left: 20px;
}
.selectVideo {
  // border: solid 2px red;
  height: 100%;
  width: 100%;
  position: relative;
}
.video {
  border: solid 1px #55557f;
  height: 100%;
  width: 100%;
  position: relative;
}

.video-monitor-system-box {
  padding: 20px;
  background-color: #eee;
}

.video-monitor-system-card {
  min-height: calc(100vh - 124px);
  background-color: #fff;
  padding: 16px;
}

.overflow_y_scroll {
  overflow-y: scroll;
}

.overflow_y_scroll_0::-webkit-scrollbar {
  width: 0 !important;
}

.view_name_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  background-color: #aaa;
  // height: 90vh;
}
.monitor-title {
  display: flex;
  justify-items: flex-end;
}

.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  // min-height: 36px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node {
  div {
    margin-top: 10px;
  }
}

.view-add-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-name-box {
  margin-top: 5px;
  margin-bottom: 10px;
}

.el-form--inline .el-form-item {
  margin-right: 0;
}

.ellipsis {
  /* 超出隐藏 */
  overflow: hidden;
  /* 不换行 */
  white-space: nowrap;
  /* 使用省略号 */
  text-overflow: ellipsis;
}

.btn-select-type {
  display: flex;
  justify-content: flex-end;
  margin: 10px;
  width: 89.45%;
}

.tree-box {
  height: 27em;
  overflow-y: scroll;
}

.tree-box::-webkit-scrollbar {
  width: 0 !important;
}
html,
body {
  padding: 0;
  margin: 0;
}
.operate {
  margin-top: 24px;
}
.operate::after {
  content: "";
  display: block;
  clear: both;
}
.module {
  float: left;
  // width: 340px;
  /*min-height: 320px;*/
  margin-left: 16px;
  padding: 16px 8px;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
}
.module .item {
  margin-bottom: 4px;
}
.module input[type="text"] {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  margin-left: 0;
  // width: 150px;
  // min-height: 20px;
}
.module .btn {
  min-width: 80px;
  min-height: 24px;
  margin-top: 100px;
  margin-left: 80px;
}

.custom_tree_node {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
