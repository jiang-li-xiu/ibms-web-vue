<!--
 * @Author: MJ
 * @Date: 2021-10-11 10:24:50
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-02-15 09:20:02
 * @Description: 
-->
<template>
  <div class="access-control-record-box">
    <el-row>
      <!-- 左侧 -->
      <!-- style="display: block" -->
      <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="8" ref="left">
        <el-row class="video-monitor-system-card">
          <!-- 用户视图 -->
          <el-col>
            <div class="view-add-box" :inline="true">
              <span>用户视图</span>

              <el-button type="primary" @click.stop="newAddFolder">
                新增
              </el-button>
            </div>

            <div v-if="isView" style="margin-top: 17px">
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                :inline="true"
                class="view-add-box"
              >
                <el-form-item prop="viewName">
                  <el-input
                    v-model="ruleForm.viewName"
                    placeholder="请输入视图名称"
                  ></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                  <el-button type="primary" @click="submitForm('ruleForm')"
                    >提交</el-button
                  >
                </el-form-item>
              </el-form>
            </div>

            <div class="video-name-box">
              <el-input
                v-model="queryView.viewName"
                placeholder="请输入视图名称"
                clearable
                size="small"
                @input="inputSearchView"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click.stop="getVideoViewLists"
                ></el-button>
              </el-input>
            </div>

            <div>
              <div
                v-for="(item, i) in videoViewList"
                :key="item.id"
                @dragenter="dragenter(item, i)"
                @dragend="dragend()"
              >
                <div
                  class="view_name_box"
                  @click.stop="openFolder(i)"
                  @contextmenu.prevent="rightClick(i)"
                  @mouseover.stop="mouseOver(i)"
                  @mouseleave.stop="mouseLeave"
                >
                  <div style="font-weight: 700; cursor: pointer">
                    <span v-if="item.isFolder">▲</span>
                    <span v-else>▼</span>
                    <span :title="item.viewName">{{ item.viewName }}</span>
                  </div>

                  <div v-show="isBtn && isBtnIndex == i">
                    <span class="edit-view" @click.stop="rightClick(i)"
                      >编辑</span
                    >
                    <span class="delete-view" @click.stop="deleteView(item.id)"
                      >删除</span
                    >
                  </div>
                </div>

                <div v-show="item.isFolder">
                  <div
                    class="is-folder"
                    v-for="items in item.viewInfos"
                    :key="items.id"
                    @click.stop="viewPlaySingle(items)"
                  >
                    <div>
                      <span style="margin-left: 23px">{{
                        items.viewName
                      }}</span>

                      <el-popconfirm
                        confirm-button-text="是"
                        cancel-button-text="否"
                        icon="el-icon-info"
                        icon-color="red"
                        title="此操作将永久删除该数据, 是否继续?"
                        @confirm="deletePointPosition(items.id)"
                      >
                        <el-button class="delete-video" slot="reference"
                          >×</el-button
                        >
                      </el-popconfirm>
                    </div>

                    <!-- <div v-if="item.deviceCode != 'null'">
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
                          :fill="item.isStatus == '1'?'#068d58':'#FF0000'"
                          p-id="2963"
                        ></path>
                      </svg>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </el-col>

          <!-- 监控点列表 -->
          <el-col style="margin-top: 17px">
            <div>监控点列表</div>

            <!-- 树形 -->
            <div style="margin-top: 10px">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText" />

              <div class="tree-box">
                <el-tree
                  :data="videoDeviceTreeData"
                  :props="videoDeviceTreeProps"
                  node-key="id"
                  @node-click="handlePlay"
                  :filter-node-method="filterNode"
                  :default-expanded-keys="treeArr"
                  accordion
                  ref="tree"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span
                      draggable="true"
                      @dragstart="dragstart(data)"
                      @dragenter="dragenter(data)"
                      @dragend="dragend()"
                    >
                      {{ node.label }}
                    </span>

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
                  </span>
                </el-tree>
              </div>
            </div>
          </el-col>
        </el-row>
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
  getVideoViewList,
  postVideoViewAddCamera,
  deleteVideoViewDeleteCamera,
  deleteVideoViewDelete,
  getVideoDeviceHikInfo,
} from "@/api/subsystem/video-monitoring/videomonitor";
var initCount = 0;
var pubKey = "";
var oWebControl = null;

export default {
  components: {},
  data() {
    return {
      selected: 1, // 表格类型
      videoIndex: 0, // 表格索引
      tableData: [], // 列表
      selectValue: "", // 当前选择的相机
      playUrl: "", // 播放的url

      // ------------------------------------------左侧（start）------------------------------------------
      queryView: {
        id: "",
        viewName: "",
      },
      videoViewList: [],
      queryParams: {},
      videoDeviceTreeData: [], // 视频设备树
      videoDeviceTreeProps: {
        children: "children",
        label: "label",
      },
      viewTitle: "新增视图",
      isView: false,
      ruleForm: {
        id: null,
        viewName: "",
      },
      rules: {
        viewName: [
          { required: true, message: "请输入视图名称", trigger: "blur" },
        ],
      },
      isBtn: false,
      isBtnIndex: null,
      isFolder: false,
      filterText: "", // 树形搜索
      treeArr: [],
      // ------------------------------------------左侧（end）------------------------------------------
    };
  },
  mounted() {
    this.initPlugin();
    this.getVideoViewLists();
    this.listVideoDevices();
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
    // setWndCover() {
    //   var iWidth = $(window).width();
    //   var iHeight = $(window).height();
    //   var oDivRect = $("#playWnd").get(0).getBoundingClientRect();

    //   var iCoverLeft = oDivRect.left < 0 ? Math.abs(oDivRect.left) : 0;
    //   var iCoverTop = oDivRect.top < 0 ? Math.abs(oDivRect.top) : 0;
    //   var iCoverRight =
    //     oDivRect.right - iWidth > 0 ? Math.round(oDivRect.right - iWidth) : 0;
    //   var iCoverBottom =
    //     oDivRect.bottom - iHeight > 0
    //       ? Math.round(oDivRect.bottom - iHeight)
    //       : 0;

    //   iCoverLeft = iCoverLeft > 1000 ? 1000 : iCoverLeft;
    //   iCoverTop = iCoverTop > 600 ? 600 : iCoverTop;
    //   iCoverRight = iCoverRight > 1000 ? 1000 : iCoverRight;
    //   iCoverBottom = iCoverBottom > 600 ? 600 : iCoverBottom;

    //   oWebControl.JS_RepairPartWindow(0, 0, 1001, 600); // 多1个像素点防止还原后边界缺失一个像素条
    //   if (iCoverLeft != 0) {
    //     oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, 600);
    //   }
    //   if (iCoverTop != 0) {
    //     oWebControl.JS_CuttingPartWindow(0, 0, 1001, iCoverTop); // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
    //   }
    //   if (iCoverRight != 0) {
    //     oWebControl.JS_CuttingPartWindow(
    //       1000 - iCoverRight,
    //       0,
    //       iCoverRight,
    //       600
    //     );
    //   }
    //   if (iCoverBottom != 0) {
    //     oWebControl.JS_CuttingPartWindow(
    //       0,
    //       600 - iCoverBottom,
    //       1000,
    //       iCoverBottom
    //     );
    //   }
    // },
    initPlugin() {
      console.log("2222222222222222222222222222222222");
      let that = this;
      oWebControl = new WebControl({
        szPluginContainer: "playWnd", // 指定容器id
        iServicePortStart: 15900, // 指定起止端口号，建议使用该值
        iServicePortEnd: 15909,
        szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11", // 用于IE10使用ActiveX的clsid
        cbConnectSuccess: function () {
          // 创建WebControl实例成功
          oWebControl
            .JS_StartService("window", {
              // WebControl实例创建成功后需要启动服务
              dllPath: "./VideoPluginConnect.dll", // 值"./VideoPluginConnect.dll"写死
            })
            .then(
              function () {
                // 启动插件服务成功
                oWebControl.JS_SetWindowControlCallback({
                  // 设置消息回调
                  cbIntegrationCallBack: cbIntegrationCallBack,
                });
                oWebControl
                  .JS_CreateWnd(
                    "playWnd",
                    that.$refs.right.$el.clientWidth - 20,
                    window.innerHeight - 123
                  )
                  .then(function () {
                    //JS_CreateWnd创建视频播放窗口，宽高可设定
                    that.init(); // 创建播放实例成功后初始化
                  });
              },
              function () {
                // 启动插件服务失败
              }
            );
        },

        cbConnectError: function () {
          // 创建WebControl实例失败
          oWebControl = null;
          $("#playWnd").html("插件未启动，正在尝试启动，请稍候...");
          WebControl.JS_WakeUp("VideoWebPlugin://"); // 程序未启动时执行error函数，采用wakeup来启动程序
          initCount++;
          if (initCount < 3) {
            setTimeout(function () {
              initPlugin();
            }, 3000);
          } else {
            $("#playWnd").html("插件启动失败，请检查插件是否安装！");
          }
        },
        cbConnectClose: function (bNormalClose) {
          // 异常断开：bNormalClose = false
          // JS_Disconnect正常断开：bNormalClose = true
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
      console.log("111111111111111111111111111");
      let that = this;
      // 获取key
      that.getPubKey(function () {
        getVideoDeviceHikInfo().then(({ data: { appKey, secret, ip } }) => {
          ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
          var appkey = appKey; // 综合安防管理平台提供的appkey，必填
          var secret = that.setEncrypt(secret); // 综合安防管理平台提供的secret，必填
          var ip = ip; // 综合安防管理平台IP地址，必填

          var playMode = 0; // 初始播放模式：0-预览，1-回放
          var port = 443; // 综合安防管理平台端口，若启用HTTPS协议，默认443
          var snapDir = "D:\\SnapDir"; // 抓图存储路径
          var videoDir = "D:\\VideoDir"; // 紧急录像或录像剪辑存储路径
          var layout = "1x1"; // playMode指定模式的布局
          var enableHTTPS = 1; // 是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
          var encryptedFields = "secret"; //加密字段，默认加密领域为secret
          var showToolbar = 1; // 是否显示工具栏，0-不显示，非0-显示
          var showSmart = 0; // 是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
          var buttonIDs =
            "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769"; //自定义工具条按钮
          ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////

          oWebControl
            .JS_RequestInterface({
              funcName: "init",
              argument: JSON.stringify({
                appkey: appkey, //API网关提供的appkey
                secret: secret, //API网关提供的secret
                ip: ip, //API网关IP地址
                playMode: playMode, //播放模式（决定显示预览还是回放界面）
                port: port, //端口
                snapDir: snapDir, //抓图存储路径
                videoDir: videoDir, //紧急录像或录像剪辑存储路径
                layout: layout, //布局
                enableHTTPS: enableHTTPS, //是否启用HTTPS协议
                encryptedFields: encryptedFields, //加密字段
                showToolbar: showToolbar, //是否显示工具栏
                showSmart: showSmart, //是否显示智能信息
                buttonIDs: buttonIDs, //自定义工具条按钮
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

    // ------------------------------------------左侧（start）------------------------------------------
    // 树形搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // 用户视图 请求 播放 数据（单个）
    viewPlaySingle(item) {
      this.hikPlay(item.deviceCode);
    },

    hikPlay(deviceCode) {
      var cameraIndexCode = deviceCode; //获取输入的监控点编号值，必填
      var streamMode = 0; //主子码流标识：0-主码流，1-子码流
      var transMode = 1; //传输协议：0-UDP，1-TCP
      var gpuMode = 0; //是否启用GPU硬解，0-不启用，1-启用
      var wndId = -1; //播放窗口序号（在2x2以上布局下可指定播放窗口）

      cameraIndexCode = cameraIndexCode.replace(/(^\s*)/g, "");
      cameraIndexCode = cameraIndexCode.replace(/(\s*$)/g, "");

      oWebControl.JS_RequestInterface({
        funcName: "startPreview",
        argument: JSON.stringify({
          cameraIndexCode: cameraIndexCode, //监控点编号
          streamMode: streamMode, //主子码流标识
          transMode: transMode, //传输协议
          gpuMode: gpuMode, //是否开启GPU硬解
          wndId: wndId, //可指定播放窗口
        }),
      });
    },

    // 删除视图
    deleteView(id) {
      deleteVideoViewDelete(id).then(() => {
        this.getVideoViewLists();
        this.$message.success("删除成功");
      });
    },

    // 文件夹右键（编辑）
    rightClick(i) {
      this.viewTitle = "编辑视图";
      this.ruleForm = {
        id: this.videoViewList[i].id,
        viewName: this.videoViewList[i].viewName,
      };
      this.isView = !this.isView;
    },

    // 删除点位信息
    deletePointPosition(id) {
      deleteVideoViewDeleteCamera(id).then(({ code, message }) => {
        if (code != 200) return this.$message.success(message);
        this.getVideoViewLists();
        this.$message.success(message);
      });
    },

    // 用户视图 展开和关闭文件夹
    openFolder(i) {
      this.indexView = i;
      let videoViewList = this.videoViewList;
      for (let is = 0; is < videoViewList.length; is++) {
        if (i == is && !videoViewList[i].isFolder) {
          videoViewList[is].isFolder = true;
        } else {
          videoViewList[is].isFolder = false;
        }
      }
    },

    // 最终操作
    dragend() {
      if (!this.oldItem.deviceCode)
        return this.$message.warning("不能添加文件夹");
      if (
        this.oldItem.deviceCode != this.newItem.deviceCode &&
        this.videoViewListId.includes(this.newItem.id) &&
        this.newItem.id
      ) {
        this.addFile = {
          viewId: this.newItem.id,
          deviceCode: this.oldItem.deviceCode,
          videoName: this.oldItem.label,
        };
        let videoViewList = this.videoViewList;

        postVideoViewAddCamera(this.addFile).then(() => {
          this.getVideoViewLists();
          this.$message.success("添加成功");
          for (let is = 0; is < videoViewList.length; is++) {
            if (
              this.newItem.i == is &&
              !videoViewList[this.newItem.i].isFolder
            ) {
              videoViewList[this.newItem.i].isFolder = true;
            } else {
              videoViewList[is].isFolder = false;
            }
          }
        });
      }
    },

    // 初始信息
    dragstart(node) {
      this.oldItem = node;
    },

    // 过程信息
    dragenter(node, i) {
      node.i = i;
      this.newItem = node;
    },

    // 移出
    mouseLeave() {
      this.isBtnIndex = null;
      this.isBtn = false;
    },

    // 移入
    mouseOver(i) {
      this.isBtnIndex = i;
      this.isBtn = true;
    },

    // 获取视图数据
    getVideoViewLists() {
      getVideoViewList(this.queryView).then((response) => {
        let videoViewListId = [];
        this.videoViewList = response.data.map((item) => {
          item.isFolder = false;
          videoViewListId.push(item.id);
          return item;
        });
        this.videoViewListId = videoViewListId;

        this.$nextTick(() => {
          if (this.newItem) {
            this.videoViewList[this.newItem.i].isFolder = true;
            return false;
          } else if (this.indexView) {
            this.videoViewList[this.indexView].isFolder = true;
            return false;
          }
        });
      });
    },

    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            putVideoView(this.ruleForm).then(() => {
              this.getVideoViewLists();
              this.$message.success("编辑成功");
              this.isView = !this.isView;
            });
          } else {
            postVideoView(this.ruleForm).then(() => {
              this.getVideoViewLists();
              this.$message.success("添加成功");
              this.isView = !this.isView;
            });
          }
        } else {
          return false;
        }
      });
    },

    // 关闭 新增视图 面板
    closes() {
      this.ruleForm = {
        id: "",
        viewName: "",
      };
    },

    // 新增视图
    newAddFolder() {
      this.isView = !this.isView;
    },

    // 监控点列表
    listVideoDevices() {
      listVideoDevice().then((res) => {
        this.videoDeviceTreeData = res.data;
      });
    },

    // 搜索
    inputSearchView(val) {
      if (!val) this.getVideoViewLists();
    },
    // ------------------------------------------左侧（end）------------------------------------------

    // 点击树形节点播放
    handlePlay(data) {
      this.hikPlay(data.deviceCode);
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
  height: 100%;
  width: 100%;
  position: relative;
}
.video {
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
.module input[type="text"] {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
}

.delete-video {
  margin-left: 16px;
  color: #ff0000;
  font-weight: 600;
  padding: 2px;
  cursor: pointer;
}

.is-folder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.delete-view {
  font-size: 14px;
  color: #ff0000;
  cursor: pointer;
  padding: 3px;
}

.edit-view {
  font-size: 14px;
  color: #1890ff;
  cursor: pointer;
  padding: 3px;
  margin-left: 6px;
  margin-right: 6px;
}
</style>
