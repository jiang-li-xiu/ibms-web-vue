/*
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-07 09:54:51
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-09 10:44:09
 */

import request from '@/utils/request'
// 送排风系统

// 获取设备列表
export function getEquipmentList(params) {
    return request({
        url: '/exhaust/getDeviceList',
        method: 'get',
        params
    })
}

// 获取设备详情
export function getEquipmentDetails(params) {
    return request({
        url: '/exhaust/getDeviceStatus',
        method: 'get',
        params
    })
}