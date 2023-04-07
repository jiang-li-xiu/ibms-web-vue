/*
 * @Author       : Imor
 * @Date         : 2021-08-25 17:05:21
 * @LastEditTime : 2021-08-30 16:41:04
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\api\device\deviceEditor.js
 * @Description  : 
 */

import request from '@/utils/request'

export default {
  /**
   * @description:删除设备请求
   */
  devDelete: (devId) => {
    request({
        url: '/device/unity/device/' + devId,
        method: 'DELETE',
      })
      .then(() => {
        console.log("删除成功");
      })
      .catch(() => {
        console.log("删除失败");
      });
  },
  /**
   * @description:新增设备请求
   * @return {Promise} Promise
   */
  devAdd: (devData) => {
    return request({
      url: '/device/unity/device',
      method: 'POST',
      data: devData
    })
  },
  /**
   * @description:更新设备请求
   * @return {Promise} Promise
   */
  devUpdate: (devData) => {
    return request({
      url: '/device/unity/device',
      method: 'PUT',
      data: devData
    })
  },
  /**
   * @description:获取设备信息
   * @return {Promise} Promise
   */
  devGet: (devId) => {
    return request({
      url: '/device/unity/device/' + devId,
      method: 'GET',
    })
  },
  /**
   * @description:创建场景
   * @return {Promise} Promise
   */
  sceneCreate: (sceneData) => {
    return request({
      url: '/device/unity/scenes',
      method: 'POST',
      data: sceneData
    })
  },
  /**
   * @description:更新场景
   */
  sceneUpdate: (sceneData) => {
    request({
        url: '/device/unity/scenes/',
        method: 'PUT',
        data: sceneData
      })
      .then((res) => {
        console.log("场景更新成功", res);
      })
      .catch((err) => {
        console.log("场景更新失败", err);
      });
  },
  /**
   * @description:获取场景信息
   * @return {Promise} Promise
   */
  sceneGet: (sceneId) => {
    return request({
      url: '/device/unity/scenes/' + sceneId,
      method: 'GET',
    })
  },
  /**
   * @description:获取所有场景信息
   * @return {Promise} Promise
   */
  sceneGetAll: () => {
    return request({
      url: '/device/unity/scenes/listAll',
      method: 'GET'
    })
  },
  /**
   * @description:删除场景
   * @return {Promise} Promise
   */
  sceneDelete: (sceneId) => {
    return request({
      url: '/device/unity/scenes/' + sceneId,
      method: 'DELETE'
    })
  },
  /**
   * @description:通过场景名获取场景信息
   * @return {Promise} Promise
   */
  sceneGetByName: (sceneName) => {
    return request({
      url: '/device/unity/scenes/findByName/' + sceneName,
      method: 'GET',
    })
  }
}