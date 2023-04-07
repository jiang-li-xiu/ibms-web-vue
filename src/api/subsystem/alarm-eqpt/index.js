/*
 * @Author: MJ
 * @Date: 2021-11-04 14:40:47
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-05 09:20:19
 * @Description: 
 */
import request from '@/utils/request'

// -------------------报警设备查看（start）-------------------
// 获取 报警设备查看 数据列表
export function getAlarmEqptList(query) {
    return request({
        url: '/firealarm/firealarm/device/list',
        method: 'GET',
        params: query
    })
}
// -------------------报警设备查看（end）-------------------


// -------------------消防报警分析（start）-------------------
// 获取 报警类型统计 报警类型统计
export function getUseClassification(query) {
    return request({
        url: '/firealarm/firealarm/countAlarmType',
        method: 'GET',
        params: query
    })
}

// 获取 报警类型统计 楼栋报警排行
export function getCountBuilding(query) {
    return request({
        url: '/firealarm/firealarm/countBuildingFireType',
        method: 'GET',
        params: query
    })
}

// 获取 报警类型统计 年度报警统计
export function getStatistics(query) {
    return request({
        url: '/firealarm/firealarm/countAlarmYear',
        method: 'GET',
        params: query
    })
}
// -------------------消防报警分析（end）-------------------


// -------------------消防告警记录（start）-------------------
// 获取 消防告警记录 数据列表
export function getAlarmLog(query) {
    return request({
        url: '/firealarm/firealarm/getAreaRecordPage',
        method: 'GET',
        params: query
    })
}
// -------------------消防告警记录（end）-------------------