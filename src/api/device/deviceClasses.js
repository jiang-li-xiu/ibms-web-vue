/*
 * @Author: Yelucc
 * @Date: 2021-07-02 11:17:38
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-12 17:50:37
 * @Description: 
 */
import request from '@/utils/request'


// 设备类管理列表
export function devicetypeList(query) {
    return request({
        url: '/device/devicetype/list',
        method: 'GET',
        params: query
    })
}

// 设备类管理删除
export function deleteDeviceDevicetype(id) {
    return request({
        url: '/device/devicetype/' + id,
        method: 'DELETE'
    })
}

// 设备类管理详情页
export function getDeviceDevicetype(id) {
    return request({
        url: '/device/devicetype/' + id,
        method: 'GET'
    })
}

// 设备类管理修改状态 
export function statusUpdate({ deviceTypeId, isStatus }) {
    return request({
        // url: '/device/devicetype/status/update',
        url: `/device/devicetype/update/${deviceTypeId}/status/${isStatus}`,
        method: 'PUT'
    })
}

// 设备类管理编辑
export function editDeviceDevicetype(data) {
    return request({
        url: '/device/devicetype',
        method: 'PUT',
        data
    })
}

// 设备类管理 告警设置列表
export function getDeviceAlarmList(query) {
    return request({
        url: '/device/alarm/list/v2',
        method: 'GET',
        params: query
    })
}

// 告警设置-告警设置-删除
export function deleteDeviceAlarm(id) {
    return request({
        url: '/device/alarm/v2/' + id,
        method: 'DELETE'
    })
}

// 告警设置-告警设置-修改状态
export function putDeviceAlarmStatusUpdate(data) {
    return request({
        url: '/device/alarm/status/update/v2',
        method: 'PUT',
        data
    })
}

// 事件 面板数据
export function getDeviceDevicetypeEvents(id) {
    return request({
        url: '/device/devicetype/events/' + id,
        method: 'GET'
    })
}

// 属性 面板数据
export function getDeviceDevicetypeProperties(id) {
    return request({
        url: '/device/devicetype/properties/' + id,
        method: 'GET'
    })
}

// 新增告警设置-告警设置
export function postDeviceAlarm(data) {
    return request({
        url: '/device/alarm/v2',
        method: 'POST',
        data
    })
}

// 获取告警设置-告警设置详情
export function getDeviceAlarm(id) {
    return request({
        url: '/device/alarm/v2/' + id,
        method: 'GET'
    })
}

// 告警设置-告警设置 修改 
export function putDeviceAlarm(data) {
    return request({
        url: '/device/alarm/v2',
        method: 'PUT',
        data
    })
}

// 获取告警记录列表
export function getDeviceAlarmListAlarmHistory(query) {
    return request({
        url: '/device/alarm/list/alarmHistory/',
        method: 'GET',
        params: query
    })
}

// 查看设备类下的设备
export function getDeviceDevicetypeListDevice(query) {
    return request({
        url: `/device/devicetype/list/device`,
        method: 'GET',
        params: query
    })
}

// 删除设备
export function deleteDeviceDeviceinfo(id) {
    return request({
        url: '/device/deviceinfo/' + id,
        method: 'DELETE'
    })
}

// 告警记录处理
export function putDeviceAlarmHistoryUpdate(data) {
    return request({
        url: '/device/alarm/history/update',
        method: 'PUT',
        data
    })
}

// 设备类型详情-物模型
export function putDeviceDevicetypeDeviceTypeIdThingModel(deviceTypeId) {
    return request({
        url: `/device/devicetype/${deviceTypeId}/thingModel`,
        method: 'GET'
    })
}




























// 查询设备类管理列表
export function listDeviceclasses(query) {
    return request({
        url: '/device/deviceclasses/list',
        method: 'get',
        params: query
    })
}


// 查询设备类管理详细
export function getDeviceclasses(id) {
    return request({
        url: '/device/deviceclasses/' + id,
        method: 'get'
    })
}

// 新增设备类管理
export function addDeviceclasses(data) {
    return request({
        url: '/device/deviceclasses',
        method: 'post',
        data: data
    })
}

// 修改设备类管理
export function updateDeviceclasses(data) {
    return request({
        url: '/device/deviceclasses',
        method: 'put',
        data: data
    })
}

// 删除设备类管理
export function delDeviceclasses(id) {
    return request({
        url: '/device/deviceclasses/' + id,
        method: 'delete'
    })
}