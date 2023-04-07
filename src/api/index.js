/*
 * @Author: MJ
 * @Date: 2021-08-16 15:43:14
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-01 17:28:28
 * @Description: 
 */
import request from '@/utils/request'


// 设备在线情况
export function getDeviceDeviceinfoListCount() {
    return request({
        url: '/device/deviceinfo/list/count',
        method: 'GET',
    })
}

// 获取 联动记录 数据
export function getLinkRecordV1List(query) {
    return request({
        url: '/link/record/v1/list',
        method: 'GET',
        params: query
    })
}

// 获取 联动控制台 数据
export function getLinkConfigV1GetManuals(query) {
    return request({
        url: '/link/config/v1/getManuals',
        method: 'GET',
        params: query
    })
}

// 手动触发
export function getLinkConfigV1Manual(id) {
    return request({
        url: '/link/config/v1/manual/' + id,
        method: 'GET',
    })
}

// 当月设备告警数量 {time}
export function getDeviceAlarmHistoryCount(id) {
    return request({
        url: '/device/alarm/history/count/' + id,
        method: 'GET',
    })
}

// 获取子系统便捷导航 
export function getSubsystemConvenientNavigation() {
    return request({
        url: '/subsystem/subSystems/v1/list/home',
        method: 'GET',
    })
}

// 子系统便捷导航详情 
export function getServiceRecords(query) {
    return request({
        url: '/subsystem/serviceRecords/v1/page',
        method: 'GET',
        params: query
    })
}

/**
 * @description: 消息记录未读数
 * @param {*} 无
 * @return {*} json
 */
export function getUnReadTotal() {
    return request({
        url: "/link/record/v1/multi/unReadTotal",
        method: 'GET',
    })
}