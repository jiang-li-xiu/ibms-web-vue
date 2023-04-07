/*
 * @Author: MJ
 * @Date: 2021-09-24 09:09:35
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-22 14:19:13
 * @Description: 
 */
import request from '@/utils/request'

// 查询事件告警预案管理列表
export function listPlan(query) {
    return request({
        url: '/event/plan/list',
        method: 'get',
        params: query
    })
}

// 查询事件告警预案管理详细
export function getPlan(id) {
    return request({
        url: '/event/plan/' + id,
        method: 'get'
    })
}

// 新增事件告警预案管理
export function addPlan(data) {
    return request({
        url: '/event/plan',
        method: 'post',
        data: data
    })
}

// 修改事件告警预案管理
export function updatePlan(data) {
    return request({
        url: '/event/plan',
        method: 'put',
        data: data
    })
}

// 删除事件告警预案管理
export function delPlan(id) {
    return request({
        url: '/event/plan/' + id,
        method: 'delete'
    })
}

// 获取子系统列表
export function listSubSystem() {
    return request({
        url: '/event/plan/listSubSystem',
        method: 'get'
    })
}

// 获取每一个子系统下的所有设备对应数据
export function getListTree() {
    return request({
        url: '/event/plan/listTree',
        method: 'get'
    })
}

// 获取每一个子系统下的所有设备对应数据
export function getDeviceTypeNameListPlanList(deviceTypeName) {
    return request({
        url: '/event/plan/list/' + deviceTypeName,
        method: 'get'
    })
}

// 获取设备类型
export function getDeviceClassTypeList(query) {
    return request({
        url: '/device/devicetype/list/nopage',
        method: 'GET',
        params: query
    })
}

// 获取设备树型图
export function getDeviceListTrees() {
    return request({
        url: '/event/plan/deviceListTrees',
        method: 'get'
    })
}

// 忽略
export function postHistoryProcessing(id) {
    return request({
        url: `/event/history/processing/${id}/2`,
        method: 'POST',
        data: {}
    })
}