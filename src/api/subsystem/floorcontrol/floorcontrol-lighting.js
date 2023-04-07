/*
 * @Descripttion: 
 * @Author: gyk
 * @Date: 2021-09-30 15:14:29
 * @LastEditors: gyk
 * @LastEditTime: 2021-10-13 15:27:39
 */

import request from '@/utils/request'
/* 照明系统-获取设备 */
// 获取设备列表
export function getDeviceList(params) {
    return request({
        url: `/lighting/lighting/device/list`,
        method: 'get',
        params
    })
}
// 设备开关
export function getInfoSendControl(deviceCode) {
    return request({
        url: `/lighting/lighting/switch/${deviceCode}`,
        method: 'post'
    })
}
// 可视化设备开关
export function getInfoBtnControl(unityModelId, switchT) {
    return request({
        url: `/lighting/lighting/device/${unityModelId}/${switchT}`,
        method: 'post'
    })
}
// 批量设备开关
export function switchBatch(status, data) {
    return request({
        url: `/lighting/lighting/list/switch/${status}`,
        method: 'post',
        data: data
    })
}
