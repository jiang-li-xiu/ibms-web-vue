<!--
 * @Author       : Imor
 * @Date         : 2021-10-09 18:18:04
 * @LastEditTime : 2022-04-19 17:48:31
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\views\visualization\device-electronic-patrol\index.vue
 * @Description  : 
-->
<template>
  <div class="app-container canvas_manager">
    <page-loading :isShow="loadingIsShow"></page-loading>
    <div class="district_divide flex">
      <scene-tree
        @inputText="filterSceneName"
        :componentTitle="leftTitle"
        :default_pholder="leftPlaceHolder"
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
                <b>1.显示设备信息：</b
                >鼠标移入设备图标后会显示设备信息顶牌，但是鼠标移出后会隐藏设备信息顶牌；<br />
                <b>2.视图的缩放与移动：</b
                >鼠标中键滚轮可实现缩放视图，鼠标中键按住拖动可实现视图移动查看；<br />
                <b>3.区域选择：</b
                >左侧区域列表可进行区域选择，点击后实现场景切换；<br />
                <b>4.区域查询：</b>区域列表的搜索栏可通过模糊搜索查询区域；
                <p style="color: red">
                  <b>注：</b>此页面不支持设备的移动、添加或删除
                </p>
                <p />
              </div>
              <el-button slot="reference" class="icon_helper">?</el-button>
            </el-popover>
          </div>
          <dev-state></dev-state>
          <unity-view></unity-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UsceneManager from "@/controller/unity/sceneManager.js";
import UnityView from "@/layout/components/UnityView.vue";
import DeviceEditor from "@/api/device/deviceEditor.js";
import { getAreaTree } from "@/api/device/districtManagement.js";
//局部共用组件
import SceneTree from "../components/SceneTree.vue";
import DevState from "../components/DeviceState";
import IconShow from "../components/IconShow";
import CanvasTitle from "../components/CanvasTitle";
//loading
import PageLoading from "../components/PageLoading";
export default {
  mounted() {
    UsceneManager.loadScene("EditorScene");
  },
  data() {
    return {
      leftTitle: "区域列表",
      leftPlaceHolder: "输入区域名称查询",
      // 树形数据
      treeData: [],
      // 修改树形默认数据
      defaultProps: {
        children: "children",
        label: "regionName",
      },
      modelList: [],
      typeList: [],
      sceneName: "园区",
      loadingIsShow: true,
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
        this.$message.success("当前场景：" + this.treeData[4].regionName);
        DeviceEditor.sceneGet(this.treeData[4].regionId)
          .then((res) => {
            this.modelList = res;
            this.modelList.forEach((child) => {
              if (child.set) {
                let childType = child.type.split("_")[0]; //m1,m2,m3......
                if (parseInt(childType.split("m")[1]) == 5) {
                  UsceneManager.sendModelsInfo(JSON.stringify(child));
                  if (childType.split("m")[1] == "5") {
                    this.getTypeListMember(child.type, "电子巡更");
                  }
                }
              }
            });
            console.log("typeList：", this.typeList);
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
      let timer = setTimeout(() => {
        UsceneManager.editAndNonEdit();
      }, 2000);
      DeviceEditor.sceneGet(data.regionId)
        .then((res) => {
          this.modelList = res;
          this.typeList.length = 0; //清空数组
          console.log(res);
          this.modelList.forEach((child) => {
            if (child.set) {
              let childType = child.type.split("_")[0]; //m1,m2,m3......
              if (parseInt(childType.split("m")[1]) == 5) {
                UsceneManager.sendModelsInfo(JSON.stringify(child));
                if (childType.split("m")[1] == "5") {
                  this.getTypeListMember(child.type, "电子巡更");
                }
              }
            }
          });
          console.log("typeList：", this.typeList);
        })
        .catch((err) => {
          console.error("获取场景信息错误！");
        });
    },
    //获取typeList子集的方法
    getTypeListMember(ctype, typeName) {
      if (this.typeList.length == 0) {
        this.typeList.push({
          name: typeName,
          state: true,
          type: ctype,
        });
      } else {
        if (this.typeList.findIndex((tl) => tl.type === ctype) < 0) {
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
    //还原全局（模型具体信息、存储删除信息以及加载场景信息）的默认值
    clearInfo() {
      this.$store.commit("upDeleteInfo", "");
      this.$store.commit("upIsLoad", "waiting");
      console.log("---------------clearclearclear----------------");
    },
    filterSceneName(text) {
      this.$refs.tree.filter(text);
    },
  },
  computed: {
    isUnityLoad() {
      return this.$store.state.unityInfo.isLoad;
    },
    iconTitleShow() {
      if (this.typeList.length == 0) return false;
      else return true;
    },
    deviceId() {
      return this.$store.state.unityInfo.deviceId;
    },
  },
  watch: {
    isUnityLoad(newVal) {
      if (newVal == "success") {
        UsceneManager.loadScene("EditorScene");
        let timer = setTimeout(() => {
          UsceneManager.editAndNonEdit();
        }, 2600);
        this.getTree({ regionId: 0 });
      }
    },
  },
  beforeDestroy() {
    this.clearInfo();
  },
};
</script>
<style>
.canvas_manager {
  height: 93.5vh;
  background-color: #f1f2f6;
  /* 标签不可被选中 */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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