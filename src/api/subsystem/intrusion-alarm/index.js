/*
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-09-24 16:53:42
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-05 09:06:22
 */

import request from '@/utils/request'

// 查询入侵报警记录
export function getInvasionRecordList(params) {
    return request({
        url: '/intrusion/intrusion/getAreaRecordPage',
        method: 'get',
        params
    })
}

// 获取区域树形数据
export function getAreaTree(query) {
    return request({
        url: '/device/regioninfo/treelist',
        method: 'GET',
        params: query
    })
}

// 查询各个区域的告警数量
export function getAreaAlarmAmount(params) {
    return request({
        url: '/intrusion/intrusion/getAreaRegionCount',
        method: 'GET',
        params
    })
}

// 获取按照时间统计告警数量
export function getAreaRegionCountByTime(params) {
    return request({
        url: '/intrusion/intrusion/getAreaRegionCountByTime',
        method: 'GET',
        params
    })
}

// 导出数据
export function exportData(data) {
    return request({
        url: '/intrusion/intrusion/export',
        method: 'POST',
        data
    })
}


/*入侵报警设备 start */
/**
 * @description: 获取入侵报警设备
 * @param {*} regionId 区域Id
 * @param {*} deviceName 设备名称
 * @param {*} isStatus 设备状态
 * @param {*} pageNum 页码
 * @param {*} pageSize 每页总数
 * @return {*} json
 */
export function getDeviceList(params) {
    return request({
        url: '/intrusion/intrusion/getDeviceList',
        method: 'GET',
        params
    })
}

/**
 * @description: 布防、撤防
 * @param {*} deviceCode 设备Id
 * @param {*} sysStatus 布撤防操作 ：0：撤防，1：布防
 * @return {*} json
 */
export function postDefense(data) {
    return request({
        url: '/intrusion/intrusion/upSubStatus',
        method: 'POST',
        data
    })
}

/**
 * @description: 导出
 * @param {*} ids 需导出的设备Id
 * @param {*} sysStatus 布撤防操作 ：0：撤防，1：布防
 * @return {*} json
 */
export function exportDeviceList(data) {
    return request({
        url: '/intrusion/intrusion/exportDeviceList',
        method: 'POST',
        data
    })
}
/*入侵报警设备 end */