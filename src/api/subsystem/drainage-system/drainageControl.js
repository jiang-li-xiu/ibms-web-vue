/*
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-07 15:20:51
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-09 10:43:33
 */
import request from '@/utils/request'
// 给排水系统

// 获取设备列表
export function getEquipmentList(params) {
    return request({
        url: '/water/getDeviceList',
        method: 'get',
        params
    })
}

// 获取设备详情
export function getEquipmentDetails(params) {
    return request({
        url: '/water/getDeviceStatus',
        method: 'get',
        params
    })
}