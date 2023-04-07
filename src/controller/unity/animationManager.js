/*
 * @Author       : Humility
 * @Date         : 2020-11-16 11:12:32
 * @LastEditTime : 2021-04-23 08:55:46
 * @LastEditors  : Humility
 * @FilePath     : \visualization-template\src\controller\unity\animationManager.js
 * @Description  : 动画相关方法
 */
import $store from "@/store";

export default {
    /**
     * @description: 播放模型动画
     * @param {string} objName_aniClip 模型名_动画片段
     * @return {void}
     */
    playAnimation(objName_aniClip) {
        console.log("动画命令：", objName_aniClip)
        $store.state.unityvue.message("WebAnimationManager", "PlayAnimation", objName_aniClip);
    },
}