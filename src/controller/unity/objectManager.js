/*
 * @Author       : Humility
 * @Date         : 2020-11-02 18:21:43
 * @LastEditTime : 2021-09-14 09:45:08
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\controller\unity\objectManager.js
 * @Description  : 对象相关方法
 */
import $store from "@/store";

export default {
  /**
   * @description: 电梯移动
   * @param {string} objectName 电梯名
   * @param {Int16Array} floorNumber 楼层下标
   * @return {void}
   */
  liftMoveTo(objectName, floorNumber) {
    $store.state.unityvue.message(objectName, "LiftMoveToByIndex", floorNumber);
  },
  /**
   * @description: 电梯移动
   * @param {string} objectName 电梯名
   * @param {Int16Array} floorIndex  楼层下标
   * @return {void}
   */
  liftMoveToByIndex(objectName, floorIndex) {
    $store.state.unityvue.message(objectName, "LiftMoveToByIndex", floorIndex);
  },
  /**
   * @description: 电梯移动
   * @param {string} objectName 电梯名
   * @param {string} floorName 楼层名称
   * @return {void}
   */
  liftMoveToByName(objectName, floorName) {
    $store.state.unityvue.message(objectName, "LiftMoveToByName", floorName);
  },
  /**
   * @description: 显示物体
   * @param {string} objName 对象名
   * @return {void}
   */
  setActiveTrue(objName) {
    console.log("显示物体：", objName);
    $store.state.unityvue.message("WebObjectManager", "SetActiveTrue", objName);
  },
  /**
   * @description: 隐藏物体
   * @param {string} objName 对象名
   * @return {void}
   */
  setActiveFalse(objName) {
    console.log("隐藏物体：", objName);
    $store.state.unityvue.message("WebObjectManager", "SetActiveFalse", objName);
  },
  /**
   * @description: 设置物体状态
   * @param {string} objName_state 对象名_状态
   * @return {void}
   */
  setActive(objName_state) {
    console.log("控制物体状态：", objName_state);
    $store.state.unityvue.message("WebObjectManager", "SetActive", objName_state);
  },
  /**
   * @description: 添加模型
   * @param {string} model_code 模型标识
   * @return {void}
   */
  addModel(model_code) {
    console.log("添加模型：", model_code);
    $store.state.unityvue.message("ModelsPool", "AddModel", model_code);
  },
  /**
   * @description: 删除模型
   * @return {void}
   */
  removeModel() {
    console.log("删除模型");
    $store.state.unityvue.message("ModelsPool", "RemoveModel");
  },
  /**
   * @description: 切换编辑模式
   * @param {Int16Array} gizmoType
   * @return {*}
   */
  changeGizmo(gizmoType) {
    switch (gizmoType) {
      case '1':
        console.log("当前编辑状态：移动");
        break;
      case '2':
        console.log("当前编辑状态：旋转");
        break;
      case '3':
        console.log("当前编辑状态：缩放");
        break;
      default:
        console.log("当前编辑状态：移动");
    }
    $store.state.unityvue.message("ModelsPool", "ChangGizmo", gizmoType);
  },
  /**
   * @description: 发送单个模型的详细信息回Unity
   * @param {string} idNumber
   * @return {void}
   */
  sendModelInfo(mInfo) {
    // console.log("发送ID回Unity" + idNumber);
    $store.state.unityvue.message("ModelsPool", "SetModelInfo", mInfo);
  },
  /**
   * @description: 把设备的详细信息传回去给UI显示
   * @param {*} uinfo 传送给UI的设备信息
   * @return {*}
   */
  sendUIInfo(uinfo) {
    $store.state.unityvue.message("DevicePlateManager", "SetText", uinfo);
  }
}