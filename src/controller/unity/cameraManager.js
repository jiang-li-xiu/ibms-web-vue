/*
 * @Author       : Humility
 * @Date         : 2020-11-17 10:41:12
 * @LastEditTime : 2021-04-23 08:55:57
 * @LastEditors  : Humility
 * @FilePath     : \visualization-template\src\controller\unity\cameraManager.js
 * @Description  : 相机（虚拟相机）
 */
import $store from "@/store";

export default {
    /**
     * @description: 切换虚拟相机
     * @param {string} cameraName 虚拟相机名称
     * @return {void}
     */
    switchVirtualCamera(cameraName) {
        console.log("虚拟相机视角切换至：", cameraName)
        $store.state.unityvue.message("WebCameraManager", "SwitchVirtualCamera", cameraName);
    },
    /**
     * @description: 切换园区漫游状态
     * @param {void}
     * @return {void}
     */
    campusRoam() {
        console.log("切换漫游状态")
        $store.state.unityvue.message("RoamTrack", "Roam");
    }
}