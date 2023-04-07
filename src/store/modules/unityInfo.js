/*
 * @Author       : Humility
 * @Date         : 2020-12-17 14:09:48
 * @LastEditTime : 2021-09-13 17:30:24
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\store\modules\unityInfo.js
 * @Description  : Unity相关信息
 */
export default {
  namespace: true,
  state: {
    sceneLeve: "Campus", // 场景等级
    buildingName: "DefaultBuilding", // 建筑名
    floorName: "DefaultFloor", // 楼层名
    objectName: "DefaultObject", // 物体名
    hoverDeviceId: "DefaultHoverId", // 鼠标悬停设备UnityID
    hoverServeId: "DefaultServeId", // 鼠标悬停设备唯一标识
    deviceId: "DefaultDeviceID", // 设备ID
    cameraId: "DefaultCameraID", // 相机ID
    modelInfo: JSON.stringify({
      "id": null,
      "deviceId": null,
      "name": "",
      "type": "",
      "unityId": "default",
      "position": [0, 0, 0],
      "rotation": [0.0, 0.0, 0.0],
      "scale": [1.0, 1.0, 1.0],
      "regionId": 0,
      "set": true
    }),
    deleteInfo: "",
    isLoad: "waiting",
  },
  actions: {},
  mutations: {
    upSceneLeve(state, newVal) {
      state.sceneLeve = newVal;
    },
    upBuildingName(state, newVal) {
      state.buildingName = newVal;
    },
    upFloorName(state, newVal) {
      state.floorName = newVal;
    },
    upObjectName(state, newVal) {
      state.objectName = newVal;
    },
    upHoverDeviceId(state, newVal) {
      state.hoverDeviceId = newVal;
    },
    upHoverServeId(state, newVal) {
      state.hoverServeId = newVal;
    },
    upDeviceId(state, newVal) {
      state.deviceId = newVal;
    },
    upCameraId(state, newVal) {
      state.cameraId = newVal;
    },
    upModelInfo(state, newVal) {
      state.modelInfo = newVal;
      // console.log(state.modelInfo);
    },
    upDeleteInfo(state, newVal) {
      state.deleteInfo = newVal;
      // console.log("删除物体", state.deleteInfo);
    },
    upIsLoad(state, newVal) {
      state.isLoad = newVal;
    }
  },
  getters: {}
}