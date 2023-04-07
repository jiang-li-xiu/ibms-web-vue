/*
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-06-14 15:00:39
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-06-15 17:38:56
 */
import request from '@/utils/request'


// 设备故障管理列表
export function getEquipmentList(query) {
    return request({
        url: '/device/fault/list',
        method: 'GET',
        params: query
    })
}
// 设备故障管理详情
export function getDetailList(faultId) {
    return request({
        url: `/device/fault/${faultId}`,
        method: 'GET',
    })
}
// 设备故障管理故障记录修改
export function getRecordDataEdit(data) {
    return request({
        url: '/device/fault',
        method: 'PUT',
        data
    })
}
// 设备故障管理维修记录列表
export function getMaintenanceList(query) {
    return request({
        url: '/device/fault/recordList',
        method: 'GET',
        params: query
    })
}
// 设备故障管理维修记录详情
export function getRecordList(query) {
    return request({
        url: '/device/fault/recordInfo',
        method: 'GET',
        params: query
    })
}
// 设备故障管理维修记录详情
export function getRecordData(data) {
    return request({
        url: '/device/fault/maintainRecord',
        method: 'POST',
        data
    })
}
// 设备故障管理维修记录详情
export function getRecordDataDelete(recordId) {
    return request({
        url: `/device/fault/${recordId}`,
        method: 'DELETE',
    })
}
// 设备故障管理本月故障告警次数统计
export function getAlarmNum(query) {
    return request({
        url: '/device/fault/faultCount',
        method: 'GET',
        params: query
    })
}
// 设备故障管理每日告警次数统计
export function getEveryDayAlarm(query) {
    return request({
        url: '/device/fault/faultCountByDay',
        method: 'GET',
        params: query
    })
}