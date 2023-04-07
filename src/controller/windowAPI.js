/*
 * @Author       : Humility
 * @Date         : 2020-11-02 14:05:11
 * @LastEditTime : 2021-12-22 16:34:48
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\controller\windowAPI.js
 * @Description  : window下挂载方法给Unity调用
 */
import $store from "@/store";
import request from '@/utils/request'
export default () => {
  /**
   * @description: 返回字符串的哈希码
   * @param {void}
   * @return {string} 哈希码
   */
  String.prototype.hashCode = () => {
    var hash = 0,
      i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
  /**
   * @description: 场景层级
   * @param {string} leve 层级
   * @return {void}
   */
  window.sceneLeve = (leve) => {
    $store.commit('upSceneLeve', leve)
  };
  /**
   * @description: 大楼名称
   * @param {string} name 楼名
   * @return {void}
   */
  window.buildingName = (name) => {
    $store.commit('upBuildingName', name)
  };
  /**
   * @description: 楼层名称
   * @param {string} name 楼层名
   * @return {void}
   */
  window.floorName = (name) => {
    $store.commit('upFloorName', name)
  };
  /**
   * @description: 物体名称
   * @param {string} name 物体名
   * @return {void}
   */
  window.objectName = (name) => {
    if (name.indexOf("Building") > -1) {
      window.buildingName(name);
    } else if (name.indexOf("Facade") > -1) {
      window.floorName(name);
    } else {
      $store.commit('upObjectName', name)
    }
  };
  /**
   * @description: 鼠标悬停激活unityid通信
   * @param {string} id unityid
   * @return {*}
   */
  window.hoverDeviceId = (id) => {
    $store.commit('upHoverDeviceId', id)
  };
  /**
   * @description: 鼠标悬停激活设备服务器唯一标识通信
   * @param {string} id 唯一标识
   * @return {*}
   */
  window.hoverServeId = (id) => {
    $store.commit('upHoverServeId', id)
  };
  window.deviceId = (id) => {
    $store.commit('upDeviceId', id)
  };
  /**
   * @description: 当前相机ID
   * @param {string} id 相机id
   * @return {void}
   */
  window.cameraId = (id) => {
    $store.commit('upCameraId', id)
  };
  /**
   * @description: 当前场景名
   * @param {string} name 场景名
   * @return {void}
   */
  window.sceneName = (name) => {
    $store.state.unityInfo.sceneName = name;
  };
  /**
   * @description: 获取场景保存信息
   * @param {string} modelInfo 场景保存信息
   * @return {void}
   */
  window.getSceneInfo = (modelInfo) => {
    $store.commit('upModelInfo', modelInfo)
  };
  /**
   * @description: 获取删除模型的id信息
   * @param {string} modelID 模型id
   * @return {void}
   */
  window.getDeleteModelId = (modelID) => {
    $store.commit('upDeleteInfo', modelID)
  };
  /**
   * @description: 场景是否加载完成
   * @param {string} isLoad success/waiting
   * @return {*}
   */
  window.isSceneLoad = (isLoad) => {
    $store.commit("upIsLoad", isLoad)
  };
  /**
   * @description: 门禁控制
   * @param {string} deviceId 设备ID
   * @param {string} controlCode 控制代码
   * @return {void}
   */
  window.accessDevControl = (deviceId, controlCode) => {
    let data = { deviceCode: deviceId, openModel: controlCode };
    request({
      url: '/access/device',
      method: 'PUT',
      data
    }).then(() => {
      console.log("控制成功---", deviceId, "---", controlCode);
    }).catch(() => {
      console.log("---------控制失败-----------");
    })
  }
}

/**
   * @description: 门禁控制
   * @param {string} deviceId 设备ID
   * @param {string} controlCode 控制代码
   * @return {void}
   */
 window.accessDevControl = (deviceId, controlCode) => {
  let data = { deviceCode: deviceId, openModel: controlCode };
  request({
    url: '/access/device',
    method: 'PUT',
    data
  }).then(() => {
    console.log("控制成功---", deviceId, "---", controlCode);
  }).catch(() => {
    console.log("---------控制失败-----------");
  })
}