/*
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-23 10:41:07
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-08 18:03:22
 */

import request from '@/utils/request'
/* 停车场设备查看 */
// 获取设备列表
export function getParkinglotDeviceinfo(params) {
    return request({
        url: `/device/regioninfo/treelist/deviceinfo`,
        method: 'get',
        params
    })
}
/*  */
// 获取单个设备
export function getParkinglotDeviceCode(deviceCode) {
    return request({
        url: `/parkinglot/device/getOne/${deviceCode}`,
        method: 'get'
    })
}
// 获取设备列表
export function getParkinglotList(params) {
    return request({
        url: '/parkinglot/device/list',
        method: 'get',
        params
    })
}

// 查询车辆场内记录
export function getParkinglotNow(params) {
    return request({
        url: '/parkinglot/device/v2/now',
        method: 'get',
        params
    })
}
// 车位信息
export function getParkinglotInfo(params) {
    return request({
        url: `/parkinglot/info/` + params,
        method: 'get',
    })
}
// 查询车辆进出记录
export function getParkinglotRecord(params) {
    return request({
        url: `/parkinglot/record`,
        method: 'get',
        params
    })
}

// 获取图片信息
export function getParkingImageUrl(query) {
    return request({
        url: '/parkinglot/record/getImageUrl',
        method: 'GET',
        params: query
    })
}


// 查询车辆进出记录
export function getParkinglotRecordTotal(params) {
    return request({
        url: `/parkinglot/record/total`,
        method: 'get',
        params
    })
}

//道闸反控
export function putParkLot(data) {
    return request({
        url: '/parkinglot/device',
        method: 'PUT',
        data
    })
}
