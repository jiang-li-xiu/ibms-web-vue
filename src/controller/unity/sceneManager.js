/*
 * @Author       : Humility
 * @Date         : 2020-11-02 09:02:48
 * @LastEditTime : 2021-10-19 10:54:53
 * @LastEditors  : Imor
 * @Description  : 场景相关方法
 */

import $store from "@/store";

export default {
  /**
   * @description: 加载场景
   * @param {sceneName} 场景名称
   */
  loadScene(sceneName) {
    try {
      $store.state.unityvue.message("WebSceneManager", "LoadScene", sceneName);
    } catch (err) {
      console.log("场景未初始化。");
    }
  },
  /**
   * @description: 大楼切换
   * @param {string}  buildingName 大楼名 A、B、C、D、E、F、G、H
   * @return {void}
   */
  buildingJump(buildingName) {
    console.log("切换大楼", buildingName);
    let timer;
    // 由于要等待场景加载完才能再该场景下切换楼层
    timer = setTimeout(function () {
      $store.state.unityvue.message("WebSceneManager", "BuildingJump", buildingName);
    }, 200);
    clearTimeout(timer);
  },
  /**
   * @description: 楼层切换
   * @param {string}  floorName 楼层名 A01,B02,C02
   * @return {void}
   */
  floorJump(floorName) {
    console.log("切换楼层", floorName);
    let timer;
    // 由于要等待场景加载完才能再该场景下切换楼层
    timer = setTimeout(function () {
      $store.state.unityvue.message("WebSceneManager", "FloorJump", floorName);
    }, 150);
    clearTimeout(timer);
  },
  /**
   * @description: UI显示隐藏自控
   * @param {string}  type m1、m2、m3...
   * @return {void}
   */
  uiIconController(type) {
    $store.state.unityvue.message("SceneManager", "UIIconController", type);
  },
  /**
   * @description: 透视/正交转换
   * @return {void}
   */
  perspOrOrtho() {
    $store.state.unityvue.message("SceneManager", "PerspOrOrtho");
  },
  /**
   * @description: 将模型的全部信息返回给Unity,用于还原场景
   * @param {string} modelInfo name/type/_3Did/transform
   */
  sendModelsInfo(modelInfo) {
    $store.state.unityvue.message("SceneManager", "LoadScene", modelInfo);
  },
  /**
   * @description: 控制模型能否变换
   */
  editAndNonEdit() {
    $store.state.unityvue.message("SceneManager", "ChangeLayer");
  }
}