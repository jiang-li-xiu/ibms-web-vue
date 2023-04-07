<!--
 * @Author       : Humility
 * @Date         : 2022-06-04 11:53:57
 * @LastEditTime : 2022-06-07 08:26:54
 * @LastEditors  : Humility
 * @FilePath     : \ibms-web-vue\src\views\visualization\device-edit\ShowPage.vue
 * @Description  : 演示页面
-->

<template>
  <div class="show_page" :class="fullScreen ? 'full_screen' : ''">
    <!-- 3D -->
    <unity-view></unity-view>
    <!-- UI -->
    <div class="page_ui">
      <div class="full_btn" @click="handleFullScreen">
        <i :class="fullScreen ? 'el-icon-crop' : 'el-icon-full-screen'" />
      </div>
      <!--  -->
      <div class="ui_top">
        <dv-decoration-8 ref="chart1" style="width:30%;height:50px;" />
        <dv-decoration-5 ref="chart2" style="width:25%;height:40px;" />
        <dv-decoration-8 ref="chart3" style="width:30%;height:50px;" :dur="3" :reverse="true" />
        <div class="top_title">园区电子地图</div>
      </div>
      <!--  -->
      <div class="ui_left">
        <dv-border-box-11 ref="chart4" title="人员数据" style="width:100%;height:33%;" class="p_t_40">
          <dv-active-ring-chart ref="chart5" :config="configPerson" style="width:100%;height:100%" />
        </dv-border-box-11>
        <dv-border-box-11 ref="chart6" title="车位信息" style="width:100%;height:33%;" class="p_t_40">
          <dv-active-ring-chart ref="chart7" :config="configCar" style="width:100%;height:100%" />
        </dv-border-box-11>
        <dv-border-box-11
          ref="chart8"
          title="环境状态"
          style="width:100%;height:33%;padding: 70px 20px 10px 20px;"
        >
          <dv-capsule-chart ref="chart9" :config="configEvn" style="height:100%" />
        </dv-border-box-11>
      </div>
      <!--  -->
      <div class="ui_right">
        <dv-border-box-9
          ref="chart10"
          style="width:100%;height:33%;padding:20px;"
          class="space_around"
        >
          <!-- <dv-flyline-chart ref="chart11" :config="configCity" style="width:100%;height:100%;" /> -->
          <el-select
            v-model="selectDeviceCode"
            @change="change"
            style="width:90%;"
            placeholder="请选择监控"
          >
            <el-option
              v-for="item in options"
              :key="item.deviceCode"
              :label="item.label"
              :value="item.deviceCode"
            ></el-option>
          </el-select>
          <xg-player
            style="width:90%;margin: 0 auto;"
            ref="player2d"
            vid="player_2d"
            :source="selectSourceURI"
          ></xg-player>
        </dv-border-box-9>
        <dv-decoration-11 ref="chart12" style="width:100%;height:4%;color: #fff;">今日人员进出记录</dv-decoration-11>
        <dv-scroll-board
          ref="chart13"
          :config="configInfoPerson"
          style="width:100%;height:30%;padding:0 10px;"
        />
        <dv-decoration-11 ref="chart14" style="width:100%;height:4%;color: #fff;">今日车辆进出记录</dv-decoration-11>
        <dv-scroll-board
          ref="chart15"
          :config="configInfoCar"
          style="width:100%;height:30%;padding:0 10px;"
        />
      </div>
    </div>
    <el-dialog
      :modal="false"
      title="监控画面"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <xg-player ref="player3d" vid="player_3d" :source="sourceURI"></xg-player>
    </el-dialog>
  </div>
</template>

<script>
import UnityView from "@/layout/components/UnityView.vue";

import UsceneManager from "@/controller/unity/sceneManager.js";
import ObjManager from "@/controller/unity/objectManager.js";

import DeviceEditor from "@/api/device/deviceEditor.js";
import { getAreaTree } from "@/api/device/districtManagement.js";
import { getStreamUrlByDeviceId } from "@/api/subsystem/video-monitoring/videomonitor";
import XgPlayer from "@/components/XgPlayer";
import { dateFormat } from "humble-utils";
export default {
  mounted() {
    UsceneManager.loadScene("EditorScene");
  },
  data() {
    return {
      fullScreen: false,
      // fullScreen: true,
      dialogVisible: false,
      //   sourceURI: "ws://45.78.111.158:20101/live?token=041037154ef06978652ec90bc4eeb4b5",
      sourceURI: "",
      selectSourceURI: "",
      selectDeviceCode: "",
      configPerson: {
        lineWidth: 26,
        showOriginValue: true,
        animationFrame: 10,
        digitalFlopStyle: {
          fontSize: 16,
        },
        data: [
          {
            name: "小区人员",
            value: 1256,
          },
          {
            name: "物业人员",
            value: 30,
          },
          {
            name: "其他",
            value: 20,
          },
        ],
      },
      configCar: {
        lineWidth: 26,
        showOriginValue: true,
        animationFrame: 10,
        digitalFlopStyle: {
          fontSize: 16,
        },
        data: [
          {
            name: "临时车",
            value: 80,
          },
          {
            name: "固定车",
            value: 642,
          },
          {
            name: "专用车位",
            value: 112,
          },
          {
            name: "其他",
            value: 20,
          },
        ],
      },
      configEvn: {
        unit: "舒适度(%)",
        showValue: true,
        data: [
          {
            name: "温度",
            value: 80,
          },
          {
            name: "湿度",
            value: 76,
          },
          {
            name: "紫外线",
            value: 68,
          },
          {
            name: "风速",
            value: 30,
          },
        ],
      },
      configCity: {
        centerPoint: [0.44, 0.89],
        points: [
          {
            position: [0.4, 0.15],
            text: "马山",
          },
          {
            position: [0.6, 0.3],
            text: "上林",
          },
          {
            position: [0.7, 0.5],
            text: "宾阳",
          },
          {
            position: [0.8, 0.7],
            text: "横县",
          },
          {
            position: [0.6, 0.7],
            text: "青秀",
          },
          {
            position: [0.55, 0.8],
            text: "邕宁",
          },
          {
            position: [0.4, 0.7],
            text: "江南",
          },
          {
            position: [0.35, 0.6],
            text: "西乡塘",
          },
          {
            position: [0.15, 0.5],
            text: "隆安",
          },
          {
            position: [0.42, 0.45],
            text: "武鸣",
          },
          {
            position: [0.5, 0.6],
            text: "兴宁",
          },
        ],
        bgImgUrl: require("@/assets/images/visualization/map_naning.png"),
      },
      options: [
        {
          id: 7881,
          label: "8-1西面摄像机",
          deviceCode: "7086370fa19145b2a3f6843c0096a414",
          type: "1",
        },
        {
          id: 7898,
          label: "西门门后监控枪机",
          deviceCode: "c9ad10b0734946e590b817909f0a4888",
          type: "1",
        },
        {
          id: 7899,
          label: "西大门墙上摄像机",
          deviceCode: "256968d1b0ff4a92af44b56a89483af1",
          type: "1",
        },

        {
          id: 7956,
          label: "南门门口监控枪机",
          deviceCode: "ac35e4c05cfe4b84a799aea2b8758c5c",
          type: "1",
        },
        {
          id: 7957,
          label: "南门桥边监控枪机",
          deviceCode: "9a78dde787fa4742806d658df9b2feb2",
          type: "1",
        },
        {
          id: 7958,
          label: "周界1-南门右",
          deviceCode: "a55c6b356750480ea11cdcf7d941dca5",
          type: "1",
        },
        {
          id: 7959,
          label: "周界2-南门左",
          deviceCode: "3536b0098dd44fe3bea93f73fe75b368",
          type: "1",
        },
        {
          id: 7960,
          label: "1-2号楼1号电梯",
          deviceCode: "c92c6c9766144d7fa8200504ba103098",
          type: "1",
        },
        {
          id: 7961,
          label: "1-2号楼2号电梯",
          deviceCode: "09cab855f6f14783a2b5cf94ecc040f3",
          type: "1",
        },
        {
          id: 7962,
          label: "1-2号楼负一层电梯间",
          deviceCode: "eab31486fbce4152a8c13b8972066ba7",
          type: "1",
        },
        {
          id: 7963,
          label: "1-1号楼正门低层高空抛物",
          deviceCode: "3e2241cc0c8d49f0b401cde2080b07af",
          type: "1",
        },
        {
          id: 9063,
          label: "消控室监控",
          deviceCode: "0a531418ba314a628d10153ecdda40f2",
          type: "1",
        },
        {
          id: 9069,
          label: "3号楼外围监控1",
          deviceCode: "9abad6c85a8a4bb1ad84cf61ff55a957",
          type: "1",
        },
        {
          id: 9070,
          label: "3号楼外围监控2",
          deviceCode: "00bc885959104a80bb4233e384d9a762",
          type: "1",
        },
        {
          id: 9071,
          label: "1号楼室外监控1",
          deviceCode: "f9056c6b05e0488cae07ce035cf14b34",
          type: "1",
        },
        {
          id: 9072,
          label: "2-2号楼负二层电梯间",
          deviceCode: "d37487ba8a714a6ca8e9d1464b7ff414",
          type: "1",
        },
        {
          id: 9073,
          label: "1号楼室外监控2",
          deviceCode: "5bd4f54d6ea4482eb628fe56e6bc7fa4",
          type: "1",
        },
        {
          id: 9074,
          label: "3号楼一层电梯间",
          deviceCode: "455362e12930459cb767db4fb36b3618",
          type: "1",
        },
        {
          id: 9075,
          label: "8-1附近中庭球机",
          deviceCode: "1ed49c3e6987412a96b8ff40aae2544e",
          type: "1",
        },
        {
          id: 9076,
          label: "3号楼门前总坪球机",
          deviceCode: "140e0b3592894d04af88cf7c602e2661",
          type: "1",
        },
        {
          id: 9077,
          label: "9F附近中庭球机",
          deviceCode: "e15384d1826b44eea7fb74f0ea370a92",
          type: "1",
        },
        {
          id: 9078,
          label: "11F附近监控枪机",
          deviceCode: "27268ec05dec46bb99ba4d4c5ac40a3c",
          type: "1",
        },
        {
          id: 9139,
          label: "7号出入口",
          deviceCode: "80fd16e9902445b283a6277d17df14c5",
          type: "1",
        },
        {
          id: 9147,
          label: "总坪别墅15栋外围州界摄像机1",
          deviceCode: "0de2cc71838049828d861397f48f0c75",
          type: "1",
        },
        {
          id: 9148,
          label: "总坪别墅15栋外围州界摄像机2",
          deviceCode: "187052035e314c1ea3e3580887388d5d",
          type: "1",
        },
        {
          id: 9149,
          label: "总坪别墅20栋外围州界摄像机1",
          deviceCode: "9c5c58512e8f4ad2a14adcda44f603bd",
          type: "1",
        },
        {
          id: 9150,
          label: "总坪别墅20栋外围州界摄像机2",
          deviceCode: "35ac8736e67244ea9b0540b0b9c1b623",
          type: "1",
        },
        {
          id: 9151,
          label: "7号楼门前总坪",
          deviceCode: "26b1eee2bd844f8b92e3d65bc3ba4f5c",
          type: "1",
        },
        {
          id: 9152,
          label: "1-1号楼正门高层高空抛物",
          deviceCode: "30700394251041059ba5c466c7754341",
          type: "1",
        },
        {
          id: 9153,
          label: "1-1号楼后门低层高空抛物",
          deviceCode: "e6d9d4b9c40d43c89e15ce04a9a6a5a8",
          type: "1",
        },
        {
          id: 9154,
          label: "1-1号楼后门高层高空抛物",
          deviceCode: "9449f7d35bd647c4b4ff8f9b4007266f",
          type: "1",
        },
        {
          id: 9155,
          label: "1-2单元后门高层高空抛物",
          deviceCode: "0fb202a079db4894a0fa8f730036e9d5",
          type: "1",
        },
        {
          id: 9156,
          label: "1-2单元后门低层高空抛物",
          deviceCode: "d5742c68ba744fc98e1396d545086639",
          type: "1",
        },
        {
          id: 9157,
          label: "1-2号楼正门高层高空抛物",
          deviceCode: "3701dc08e80d4bd095fbc013de273362",
          type: "1",
        },
        {
          id: 9158,
          label: "1-2号楼正门低层高空抛物",
          deviceCode: "dfb469ab9bd040f2a9714e721c21d68d",
          type: "1",
        },
        {
          id: 9159,
          label: "2-1号楼正门低层高空抛物",
          deviceCode: "36b0b00d5e634ceb8dab5cad0515f82f",
          type: "1",
        },
        {
          id: 9160,
          label: "2-1号楼正门高层高空抛物",
          deviceCode: "bd373fc47b5940c3b665884754a21acc",
          type: "1",
        },
        {
          id: 9161,
          label: "2-1号楼后门低层高空抛物",
          deviceCode: "37b64b00f10d40e18f1f60be53334633",
          type: "1",
        },
        {
          id: 9162,
          label: "2-1号楼后门高层高空抛物",
          deviceCode: "230fc6f584424e19bf6816b2d31be097",
          type: "1",
        },
        {
          id: 9163,
          label: "2-2号楼正门低层高空抛物",
          deviceCode: "1a255e10782d4c748a6302b99deb697d",
          type: "1",
        },
        {
          id: 9164,
          label: "2-2号楼正门高层高空抛物",
          deviceCode: "2f50aaf8eed14cdb884581be7d89cc83",
          type: "1",
        },
        {
          id: 9165,
          label: "3号楼正门高层高空抛物",
          deviceCode: "e7c411aace584581b06a92e81371b87a",
          type: "1",
        },
        {
          id: 9166,
          label: "3号楼正门低层高空抛物",
          deviceCode: "b45151c6b83b4295858ed3c8428bf76c",
          type: "1",
        },
        {
          id: 9167,
          label: "5-1号楼正门高层高空抛物",
          deviceCode: "0e0c0a01db0c4e7a878a36a7aba4cc68",
          type: "1",
        },
        {
          id: 9168,
          label: "5-1号楼正门低层高空抛物",
          deviceCode: "4a6ef50589d94ae0a418f156f7038d55",
          type: "1",
        },
        {
          id: 9169,
          label: "5-2号楼正门低层高空抛物",
          deviceCode: "3f38df19594747c6b9f04d8aaf4e65d1",
          type: "1",
        },
        {
          id: 9170,
          label: "5-2号楼正门高层高空抛物",
          deviceCode: "f6281fad751e450e8bdb95b15609649e",
          type: "1",
        },
        {
          id: 9171,
          label: "6号楼正门低层高空抛物",
          deviceCode: "835ba5a16d884059b5c03e9a811ac197",
          type: "1",
        },
        {
          id: 9172,
          label: "6号楼正门高层高空抛物",
          deviceCode: "5e46aa80094d4c03ac1819194081eb42",
          type: "1",
        },
        {
          id: 9173,
          label: "7号楼正门低层高空抛物",
          deviceCode: "06321752a454469eadf6498ee651aa49",
          type: "1",
        },
        {
          id: 9174,
          label: "7号楼正门高层高空抛物",
          deviceCode: "313b809a6ea24a6ba11de0527003d6f2",
          type: "1",
        },
        {
          id: 9175,
          label: "8-1号楼后门高层高空抛物",
          deviceCode: "40c06d1023f841efa0594b48c0de790b",
          type: "1",
        },
        {
          id: 9176,
          label: "8-1号楼后门低层高空抛物",
          deviceCode: "1b42e71cd55643eeab27ad3e7609b3b6",
          type: "1",
        },
        {
          id: 9177,
          label: "8-1号楼正门高层高空抛物",
          deviceCode: "03373d22c5d6464b89ed6f7824888434",
          type: "1",
        },
        {
          id: 9178,
          label: "8-1号楼正门低层高空抛物",
          deviceCode: "80daaf56d7224539bf0a32e57a05170f",
          type: "1",
        },
        {
          id: 9179,
          label: "8-2号楼正门高层高空抛物",
          deviceCode: "9bf3449d74d24f8291637358156fc105",
          type: "1",
        },
        {
          id: 9180,
          label: "8-2号楼正门低层高空抛物",
          deviceCode: "4ef6c74f85ed4d46862f9aa1cc5ca48f",
          type: "1",
        },
        {
          id: 9181,
          label: "9号楼后门低层高空抛物",
          deviceCode: "46f33c6aff1e450e9345e73de5ec09f7",
          type: "1",
        },
        {
          id: 9182,
          label: "9号楼后门高层高空抛物",
          deviceCode: "1cbc4192a6884ea084d63123d35adea5",
          type: "1",
        },
        {
          id: 9183,
          label: "9号楼正门低层高空抛物",
          deviceCode: "912a7ad01c3d48fc86ba7c10df3c13aa",
          type: "1",
        },
        {
          id: 9184,
          label: "9号楼正门高层高空抛物",
          deviceCode: "f91334fe8c5e4627bd39d01d86adf2f8",
          type: "1",
        },
        {
          id: 9185,
          label: "7号楼东面停车场前",
          deviceCode: "b7c0b6c3dfb145c999ee3bd1d63c419d",
          type: "1",
        },
        {
          id: 9186,
          label: "7号楼东面超市",
          deviceCode: "00f666c8b6864819828c8a9a13dda126",
          type: "1",
        },
        {
          id: 9187,
          label: "4号出入口边上",
          deviceCode: "ccb1e6f47bb74ffb82db181be9be0321",
          type: "1",
        },
        {
          id: 9188,
          label: "2号楼外围监控1",
          deviceCode: "093b4ac56c8845409c4b5e7f2c3b32aa",
          type: "1",
        },
        {
          id: 9189,
          label: "2号楼外围监控2",
          deviceCode: "fcb570f1bb7948ec8bb159d6cfe70181",
          type: "1",
        },
        {
          id: 9190,
          label: "3号楼对面摄像机",
          deviceCode: "70ebe0fd55a9449bb0e3ab1b1e3a3065",
          type: "1",
        },
        {
          id: 9191,
          label: "4号出入口正对面",
          deviceCode: "1f6d0623c6364b248835715ca5cb61d6",
          type: "1",
        },
        {
          id: 9192,
          label: "8-2外围2",
          deviceCode: "76d05d28433343c3856c06eb2ce22a4c",
          type: "1",
        },
        {
          id: 9193,
          label: "5号楼东面1",
          deviceCode: "1a3b7a1d6d244e96bdd4fdccda8267bc",
          type: "1",
        },
        {
          id: 9194,
          label: "5号楼东面2",
          deviceCode: "9c3ea7629acc41bfb7ee75920c9abe8f",
          type: "1",
        },
        {
          id: 9195,
          label: "8号楼东面",
          deviceCode: "20fd132a925742758364034fa8f009cd",
          type: "1",
        },
        {
          id: 9196,
          label: "8-2外围1",
          deviceCode: "1a447c87f34e48a2a26c2f3a04ad6cc6",
          type: "1",
        },
      ],
    };
  },
  components: {
    UnityView,
    XgPlayer,
  },
  methods: {
    handleFullScreen() {
      this.fullScreen = !this.fullScreen;
      this.$forceUpdate();
      this.$refs.chart1.$forceUpdate();
      this.$refs.chart2.$forceUpdate();
      //   for (let index = 0; index <= 15; index++) {
      //     this.$refs[`chart${index}`].$forceUpdate();
      //   }
    },
    playVideo(deviceCode) {
      getStreamUrlByDeviceId({ deviceCode }).then((res) => {
        console.log("getStreamUrlByDeviceId", res);
        this.sourceURI = res.data.uri;
      });
    },
    change(e) {
      console.log("deviceCode", e);
      this.playSelectVideo(e);
    },
    playSelectVideo(deviceCode) {
      getStreamUrlByDeviceId({ deviceCode }).then((res) => {
        this.selectSourceURI = res.data.uri;
      });
    },
    handleClose() {
      this.$store.commit("upDeviceId", "DefaultDeviceID");
      this.dialogVisible = false;
    },
  },
  computed: {
    isUnityLoad() {
      return this.$store.state.unityInfo.isLoad;
    },
    deviceId() {
      return this.$store.state.unityInfo.deviceId;
    },
    configInfoPerson() {
      let date = Date.parse(new Date());
      return {
        header: ["姓名", "时间", "进/出"],
        data: [
          ["王雨生", dateFormat(date - 1 * 1 * 55 * 1000, "hh:mm:ss"), "出"],
          ["简自傲", dateFormat(date - 1 * 2 * 44 * 1000, "hh:mm:ss"), "进"],
          ["李忠胜", dateFormat(date - 1 * 3 * 33 * 1000, "hh:mm:ss"), "进"],
          ["彭璇玮", dateFormat(date - 2 * 4 * 55 * 1000, "hh:mm:ss"), "出"],
          ["马星漠", dateFormat(date - 2 * 5 * 11 * 1000, "hh:mm:ss"), "进"],
          ["陈诚傅", dateFormat(date - 2 * 6 * 22 * 1000, "hh:mm:ss"), "出"],
          ["韦树铭", dateFormat(date - 2 * 7 * 55 * 1000, "hh:mm:ss"), "出"],
          ["王若云", dateFormat(date - 2 * 8 * 33 * 1000, "hh:mm:ss"), "进"],
          ["李大中", dateFormat(date - 2 * 9 * 44 * 1000, "hh:mm:ss"), "出"],
          ["张晓丽", dateFormat(date - 3 * 9 * 55 * 1000, "hh:mm:ss"), "进"],
        ],
        index: true,
        columnWidth: [50],
        align: ["center"],
      };
    },
    configInfoCar() {
      let date = Date.parse(new Date());
      return {
        header: ["车牌", "时间", "进/出"],
        data: [
          ["桂AUC360", dateFormat(date - 1 * 1 * 55 * 1000, "hh:mm:ss"), "出"],
          ["桂A55605", dateFormat(date - 1 * 2 * 44 * 1000, "hh:mm:ss"), "进"],
          ["桂AU5608", dateFormat(date - 1 * 3 * 33 * 1000, "hh:mm:ss"), "进"],
          ["桂A66656", dateFormat(date - 2 * 4 * 55 * 1000, "hh:mm:ss"), "出"],
          ["桂A555U7", dateFormat(date - 2 * 5 * 11 * 1000, "hh:mm:ss"), "进"],
          ["桂A88C05", dateFormat(date - 2 * 6 * 22 * 1000, "hh:mm:ss"), "出"],
          ["桂A64600", dateFormat(date - 2 * 7 * 55 * 1000, "hh:mm:ss"), "出"],
          ["桂A33208", dateFormat(date - 2 * 8 * 33 * 1000, "hh:mm:ss"), "进"],
          ["桂A00224", dateFormat(date - 2 * 9 * 44 * 1000, "hh:mm:ss"), "出"],
          ["桂A57708", dateFormat(date - 3 * 9 * 55 * 1000, "hh:mm:ss"), "进"],
        ],
        index: true,
        columnWidth: [50],
        align: ["center"],
      };
    },
  },
  mounted() {
    // getStreamUrlByDeviceId({
    //   deviceCode: "256968d1b0ff4a92af44b56a89483af1",
    // }).then((res) => {
    //   console.log("getStreamUrlByDeviceId", res);
    //   this.sourceURI = res.data.uri;
    // });
    getStreamUrlByDeviceId({
      deviceCode: "256968d1b0ff4a92af44b56a89483af1",
    }).then((res) => {
      this.selectSourceURI = res.data.uri;
    });
  },
  watch: {
    deviceId(deviceCode) {
      if (deviceCode != "DefaultDeviceID") {
        this.dialogVisible = true;
        this.playVideo(deviceCode);
      }
    },
  },
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
.show_page {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 84px);
  z-index: 2001;
  .page_ui {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    > div {
      position: absolute;
    }
    .ui_top {
      top: 0;
      left: 0;
      height: 8vh;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .top_title {
        position: absolute;
        color: #2037a3;
        font-size: 30px;
        font-weight: bold;
        left: 50%;
        top: 10px;
        transform: translateX(-50%);
      }
    }
    .ui_left {
      top: 9vh;
      left: 4px;
      height: 82vh;
      width: 18%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
    .ui_right {
      top: 9vh;
      right: 4px;
      height: 82vh;
      width: 18%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
    .full_btn {
      right: 10px;
      top: 2vh;
      cursor: pointer;
      z-index: 2001;
      i {
        font-size: 46px;
      }
    }
  }
}
// 全屏样式
.full_screen {
  position: fixed;
  width: 100vw;
  height: 100vh;
}
.p_t_40 {
  padding-top: 40px;
}
</style>
<style>
.space_around .border-box-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>