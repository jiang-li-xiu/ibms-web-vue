<!--
 * @Author       : Imor
 * @Date         : 2021-08-23 09:25:40
 * @LastEditTime: 2022-06-02 16:35:00
 * @LastEditors: ZhouYongqiu
 * @FilePath     : \ibms-web-vue\src\views\visualization\device-edit\index.vue
 * @Description  :
-->
<template>
  <div class="app-container canvas_manager">
    <page-loading :isShow="loadingIsShow"></page-loading>
    <div class="district_divide flex">
      <scene-tree
        :componentTitle="leftTitle"
        :default_pholder="leftPlaceHolder"
        @inputText="filterSceneName"
      >
        <div slot="component_content">
          <el-tree
            class="filter-tree visual_tree"
            :data="treeData"
            :props="defaultProps"
            :highlight-current="true"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            ref="tree"
          >
          </el-tree>
        </div>
      </scene-tree>
      <div class="middle_view">
        <canvas-title :sceneName="sceneName"></canvas-title>
        <div class="scene_canvas">
          <unity-view></unity-view>
        </div>
        <div class="dev_channels">
          <ul>
            <li v-for="(t, i) in typeList" :key="i">
              <input
                type="checkbox"
                v-model="t.state"
                @click="iconControl(t.type)"
              />
              <label :class="{ active_color: t.state }">{{ t.name }}</label>
            </li>
          </ul>
        </div>
        <icon-show
          :typeList="typeList"
          :iconTitleShow="iconTitleShow"
        ></icon-show>
        <div class="shortcut_help">
          <el-popover
            class="edit_helper"
            title="电子地图使用说明"
            width="200"
            trigger="click"
            placement="left-start"
          >
            <div slot class="edit_helper_text">
              <b>1.添加设备：</b
              >右侧“设备列表”左键选择设备后，鼠标拖到场景视图中移至想要放置的区域再点击左键完成添加设备操作；<br />
              <b>2.删除设备：</b
              >场景视图中选中设备状态下，按键盘“Delete”键进行删除设备操作；<br />
              <b>3.移动设备：</b
              >场景视图选中设备后，会出现设备移动轴：<br />(1)拖动蓝色轴仅可以实现上下移动；<br />(2)拖动红色轴仅可以实现左右移动；<br />(3)拖动绿色方形区域可以实现自由移动<b
                >(推荐)</b
              ><br />
              <b>4.显示设备信息：</b
              >鼠标移入设备图标后会显示设备信息顶牌，但是鼠标移出后会隐藏设备信息顶牌；<br />
              <b>5.视图的缩放与移动：</b
              >鼠标中键滚轮可实现缩放视图，鼠标中键按住拖动可实现视图移动查看；<br />
              <b>6.区域选择：</b
              >左侧区域列表可进行区域选择，点击后实现场景切换；<br />
              <b>7.设备与区域查询：</b
              >设备列表/区域列表的搜索栏可通过模糊搜索查询设备/区域；
            </div>
            <el-button slot="reference" class="icon_helper">?</el-button>
          </el-popover>
        </div>
        <dev-state></dev-state>
      </div>
      <scene-tree
        :componentTitle="rightTitle"
        :default_pholder="rightPlaceHolder"
        @inputText="filterDevList"
      >
        <div slot="component_content">
          <ul class="right_content">
            <li
              v-for="(m, i) in modelList"
              :key="i"
              v-show="devsShow(m.type, m.set)"
              @click="addModel(m)"
            >
              <div class="img">
                <img
                  v-if="m.type"
                  :src="require(`@/assets/images/modelsPreviews/${m.type}.png`)"
                />
              </div>
              <div class="discribe">
                <div style="font-weight: 600">{{ m.name }}</div>
                <div style="margin-top: 1vh">ID：{{ m.deviceId }}</div>
              </div>
            </li>
            <li class="no_dev_text" v-show="noDevTextShow">
              {{ rightDevText }}
            </li>
          </ul>
        </div>
      </scene-tree>
    </div>
  </div>
</template>

<script>
import UsceneManager from "@/controller/unity/sceneManager.js";
import ObjManager from "@/controller/unity/objectManager.js";
import UnityView from "@/layout/components/UnityView.vue";
import DeviceEditor from "@/api/device/deviceEditor.js";
import { getAreaTree } from "@/api/device/districtManagement.js";
//局部共用组件
import SceneTree from "../components/SceneTree";
import DevState from "../components/DeviceState";
import IconShow from "../components/IconShow";
import CanvasTitle from "../components/CanvasTitle";
//loading
import PageLoading from "../components/PageLoading";
export default {
  mounted() {
    UsceneManager.loadScene("EditorScene");
    setTimeout(() => {
      this.loadingIsShow = false
    }, 1000);
    document.onkeyup = (e) => {
      // if (e.key == "w") {
      //   this.changeGizmo("1");
      // }
      // if (e.key == "e") {
      //   this.changeGizmo("2");
      // }
      // if (e.key == "r") {
      //   this.changeGizmo("3");
      // }
      if (e.key == "Delete" || e.key == ".") {
        this.removeModel();
      }
    };
  },
  data() {
    return {
      leftTitle: "区域列表",
      leftPlaceHolder: "输入区域名称查询",
      rightTitle: "设备列表",
      rightPlaceHolder: "输入设备名称 / 设备ID",
      // 树形数据
      treeData: [],
      // 修改树形默认数据
      defaultProps: {
        children: "children",
        label: "regionName",
      },
      modelList: [], //单个区域所有的设备信息
      noFilterModelList: [], //单个区域所有的设备信息，备份用于搜索还原
      typeList: [], //存储{设备类型、设备名称、设备UI激活状态}对象集
      sceneName: "园区", //画布区域名
      rightDevText: "当前区域暂无设备", //右边无设备时，空白区域展示的内容
      switcher: false, //3D/2D相机切换
      loadingIsShow: true, //加载页面显隐
    };
  },
  components: {
    UnityView,
    SceneTree,
    DevState,
    IconShow,
    CanvasTitle,
    PageLoading,
  },
  methods: {
    //UI指定显示/隐藏
    iconControl(type) {
      UsceneManager.uiIconController(type);
    },
    //修饰场景名
    setSceneName(list, ico = "", site = "") {
      return list.map((item) => {
        item.label = site + ico + item.regionName;
        // 判断有没有子节点 NO
        if (!item.children) {
          return item;
        } else {
          item.children = this.setSceneName(item.children, " - ", item.label);
          return item;
        }
      });
    },
    //获取区域信息
    getTree(regionId) {
      getAreaTree(regionId).then((response) => {
        this.treeData = this.setSceneName(response.data);
        // this.$message.success("当前场景：" + this.treeData[4].regionName); //TODO 很久以前，默认的园区场景的index是4，如果有变数，则需要改
        DeviceEditor.sceneGet(this.treeData[4].regionId)
          .then((res) => {
            this.modelList = res;
            console.log("设备列表-----", this.modelList);
            this.noFilterModelList = res;
            this.modelList.forEach((child) => {
              if (child.set) {
                //如果已放置，则在场景中创建它
                UsceneManager.sendModelsInfo(JSON.stringify(child));
              }
              let childType = child.type.split("_")[0]; //m1,m2,m3......
              switch (childType.split("m")[1]) {
                case "1":
                  this.getTypeListMember(child.type, "枪机");
                  break;
                case "2":
                  this.getTypeListMember(child.type, "球机");
                  break;
                case "3":
                  this.getTypeListMember(child.type, "门禁设备");
                  break;
                case "4":
                  this.getTypeListMember(child.type, "访客对讲机");
                  break;
                case "5":
                  this.getTypeListMember(child.type, "电子巡更");
                  break;
              }
            });
            this.loadingIsShow = false;
          })
          .catch((err) => {
            console.error("获取场景信息错误！");
          });
      });
    },
    // 鼠标左键方法
    handleNodeClick(data) {
      this.$message.success({
        duration: 1500,
        message: "当前场景：" + data.regionName,
      });
      this.sceneName = data.label;
      let SceneIndex = data.label.slice(0, 1);
      switch (SceneIndex) {
        case "1":
          UsceneManager.loadScene("Map_01");
          break;
        case "2":
          UsceneManager.loadScene("Map_02");
          break;
        case "3":
          UsceneManager.loadScene("Map_03");
          break;
        case "4":
          UsceneManager.loadScene("Map_04");
          break;
        case "园":
          UsceneManager.loadScene("EditorScene");
          break;
        default:
          UsceneManager.loadScene("EditorScene");
          break;
      }
      DeviceEditor.sceneGet(data.regionId)
        .then((res) => {
          this.modelList = res;
          // console.log(this.modelList);
          this.noFilterModelList = res;
          this.typeList.length = 0; //清空数组
          this.modelList.forEach((child) => {
            if (child.set) {
              UsceneManager.sendModelsInfo(JSON.stringify(child));
            }
            let childType = child.type.split("_")[0]; //m1,m2,m3......
            switch (childType.split("m")[1]) {
              case "1":
                this.getTypeListMember(child.type, "枪机");
                break;
              case "2":
                this.getTypeListMember(child.type, "球机");
                break;
              case "3":
                this.getTypeListMember(child.type, "门禁设备");
                break;
              case "4":
                this.getTypeListMember(child.type, "访客对讲机");
                break;
              case "5":
                this.getTypeListMember(child.type, "电子巡更");
                break;
            }
          });
        })
        .catch((err) => {
          console.error("获取场景信息错误！");
        });
    },
    getTypeListMember(ctype, typeName) {
      if (this.typeList.length == 0) {
        //如果数组为空 直接塞进去
        this.typeList.push({
          name: typeName,
          state: true,
          type: ctype,
        });
      } else {
        if (this.typeList.findIndex((tl) => tl.type === ctype) < 0) {
          //不为空，则判断数组中是否已存在该类型
          this.typeList.push({
            name: typeName,
            state: true,
            type: ctype,
          });
        }
      }
    },
    // 搜索功能：对树节点进行筛选时执行的方法
    filterNode(value, data) {
      if (!value) return true;
      return data.regionName.indexOf(value) !== -1;
    },
    //切换正交/透视视角-平面项目未使用
    pOrO() {
      this.switcher = !this.switcher;
      UsceneManager.perspOrOrtho();
    },
    //改变编辑模式-平面项目未使用
    changeGizmo(index) {
      ObjManager.changeGizmo(index);
    },
    //添加模型，_3Did改变值以便监听
    addModel(model) {
      console.log(model);
      this.modelInfo.unityId = "addModel";
      ObjManager.addModel(model.type);
      model.set = true;
      let createInfo = {
        id: model.id,
        deviceId: model.deviceId,
        position: model.position,
        rotation: model.rotation,
        scale: model.scale,
        name: model.name,
        type: model.type,
        unityId: model.unityId,
        regionId: model.regionId,
        set: model.set,
        state: model.state,
      };
      ObjManager.sendModelInfo(JSON.stringify(createInfo));
    },
    //删除模型
    removeModel() {
      ObjManager.removeModel();
    },
    //还原全局（模型具体信息、存储删除信息以及加载场景信息）的默认值
    clearInfo() {
      this.$store.commit("upDeleteInfo", "");
      this.$store.commit("upIsLoad", "waiting");
      console.log("clearclearclearclearclearclearclear");
    },
    devsShow(type, isSet) {
      if (this.typeList.length > 0) {
        if (type) {
          let i = this.typeList.findIndex((t) => type === t.type);
          if (!isSet == this.typeList[i].state) {
            return this.typeList[i].state;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    filterSceneName(text) {
      this.$refs.tree.filter(text);
    },
    //搜索内容的主要方法
    filterDevList(text) {
      if (text.length != 0) {
        let queryList = this.noFilterModelList.filter(
          (ml) => ml.name.indexOf(text) > -1 || ml.deviceId.indexOf(text) > -1
        );
        this.modelList = queryList;
        this.rightDevText = "当前搜索没有对应设备";
      } else {
        this.rightDevText = "当前区域暂无设备";
        this.modelList = this.noFilterModelList;
      }
    },
  },
  computed: {
    modelInfo() {
      let info = this.$store.state.unityInfo.modelInfo;
      let infoJson = JSON.parse(info);
      if (infoJson.id == "") {
        infoJson.id = null;
      }
      return infoJson;
    },
    deleteMember() {
      return this.$store.state.unityInfo.deleteInfo;
    },
    isUnityLoad() {
      return this.$store.state.unityInfo.isLoad;
    },
    iconTitleShow() {
      if (this.typeList.length == 0) return false;
      else return true;
    },
    noDevTextShow() {
      if (this.modelList.length == 0) return true;
      else return false;
    },
  },
  watch: {
    modelInfo(newVal, oldVal) {
      //先判断新的json是否是默认保存的数据,此步预防页面跳转时的数据初始化
      if (newVal.name != "") {
        //如果：当前是添加操作，向服务器请求模型信息，并把唯一标识赋名给新添加的物体；
        //否则：当前是更新编辑操作，将模型编辑的最新信息上传服务器
        if (oldVal.unityId == "addModel") {
          DeviceEditor.devUpdate(newVal)
            .then((res) => {
              console.log("新建模型更新成功", res);
            })
            .catch((err) => {
              console.error("新建模型更新失败", err);
            });
        } else {
          DeviceEditor.devUpdate(newVal)
            .then((res) => {
              console.log("更新成功", res);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    },
    isUnityLoad(newVal) {
      if (newVal == "success") {
        UsceneManager.loadScene("EditorScene");
        this.getTree({ regionId: 0 }); //初始化左侧区域列表
      }
    },
    deleteMember(newVal) {
      if (newVal != "") {
        console.log("删除设备id：" + newVal);
        DeviceEditor.devGet(newVal)
          .then((res) => {
            res.data.set = false;
            this.modelList.push(res.data);
            DeviceEditor.devUpdate(res.data)
              .then(() => {
                console.log("删除设备信息更新成功");
                this.$store.commit("upDeleteInfo", "");
              })
              .catch(() => {
                console.log("更新失败");
              });
          })
          .catch(() => {
            console.log("---删除设备信息更改失败---");
          });
      }
    },
  },
  beforeDestroy() {
    this.clearInfo();
    document.onkeyup = null; //取消监听事件
  },
};
</script>

<style>
.canvas_manager {
  height: 93.5vh;
  background-color: #f1f2f6;
}
.district_divide {
  height: 100%;
}

/* 中间区域style */
.middle_view {
  position: relative;
  width: 100%;
  margin: 0 20px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(35, 35, 35, 0.2);
}
.scene_canvas {
  height: 100%;
}
/* 设备ui显隐 */
.dev_channels {
  position: absolute;
  top: 100px;
  left: 3%;
  z-index: 1;
}
.dev_channels ul li {
  height: 100%;
  display: inline-block;
  margin-right: 1.2vw;
}
.dev_channels ul li input {
  margin-right: 7px;
  width: 20px;
  height: 20px;
  vertical-align: bottom;
}
.dev_channels ul li label {
  font-size: 20px;
  display: inline-block;
}
.active_color {
  color: #207bff;
}
/*快捷键注释*/
.shortcut_help {
  position: absolute;
  right: 2%;
  top: 100px;
  z-index: 1;
}
.shortcut_help .icon_helper {
  padding: 0;
  padding-left: 1px;
  left: 16px;
  width: 40px;
  height: 40px;
  font-size: 30px;
  border-radius: 50%;
  border: 3px solid;
  color: #207bff;
}
.shortcut_help .icon_helper:focus,
.shortcut_help .icon_helper:hover {
  background-color: #207bff;
  color: #fff;
}
/* 右边内容 */
.right_content {
  padding: 5px 17px 10px 25px;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  /* justify-content: space-between; */
  align-content: flex-start;
  flex-wrap: wrap;
  overflow-y: scroll;
}
.right_content li {
  box-shadow: 0 0 5px rgba(35, 35, 35, 0.2);
  border-radius: 2px;
  width: 100%;
  height: 3.8vw;
  margin-bottom: 14px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #fff;
}
.right_content li:hover {
  background-color: #e8f1fe;
  border: 1px solid #207bff;
}
/* 当区域无设备时展示内容 */
.no_dev_text {
  color: #999999;
  font-size: 16px;
  text-align: center;
  letter-spacing: 1px;
  padding-top: 10px;
  box-shadow: none !important;
  background-color: #fff !important;
  border: none !important;
  cursor: default !important;
}
/*修改滚动条样式*/
.right_content::-webkit-scrollbar {
  width: 0.4vw;
}
.right_content::-webkit-scrollbar-thumb {
  background: #f1f0f0;
  border-radius: 10px;
}
.right_content::-webkit-scrollbar-thumb:hover {
  background: #e6e6e6;
}
/*设备盒样式*/
.right_content li .img {
  position: relative;
  background-color: #207bff;
  border-radius: 50%;
  top: 22%;
  left: 7%;
  width: 2.2vw;
  height: 2.2vw;
  overflow: hidden;
}
.right_content li .img img {
  position: absolute;
  left: 10%;
  top: 10%;
  width: 80%;
  height: 80%;
}
.right_content li .discribe {
  position: relative;
  left: 32%;
  top: -35%;
  color: #207bff;
  font-size: 0.7vw;
}
/* el-tree相关style */
.visual_tree .el-tree-node .el-tree-node__content {
  height: 36px;
}
.visual_tree .el-tree-node .el-tree-node__content .el-tree-node__label,
.visual_tree .el-tree-node .el-tree-node__content .el-icon-caret-right:before {
  font-size: 20px;
}
.visual_tree .el-tree-node .el-tree-node__content .el-icon-caret-right {
  margin-left: 20px;
}
.visual_tree .el-tree-node .el-tree-node__content:hover {
  background: rgba(59, 106, 177, 0.1);
}
.visual_tree .el-tree-node:focus > .el-tree-node__content {
  background-color: rgba(59, 106, 177, 0.1);
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: rgba(59, 106, 177, 0.1);
}
</style>
