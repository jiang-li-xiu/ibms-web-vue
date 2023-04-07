/*
 * @Author: MJ
 * @Date: 2021-09-24 09:09:35
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-22 11:04:26
 * @Description: 
 */
import request from '@/utils/request'

// 查询报警列表
export function listAlarminfo(query) {
    return request({
        url: '/event/alarminfo/list',
        method: 'get',
        params: query
    })
}

// 查询报警详细
export function getAlarminfo(alarmId) {
    return request({
        url: '/event/alarminfo/' + alarmId,
        method: 'get'
    })
}

// 新增报警
export function addAlarminfo(data) {
    return request({
        url: '/event/alarminfo',
        method: 'post',
        data: data
    })
}

// 修改报警
export function updateAlarminfo(data) {
    return request({
        url: '/event/alarminfo',
        method: 'put',
        data: data
    })
}

// 删除报警
export function delAlarminfo(alarmId) {
    return request({
        url: '/event/alarminfo/' + alarmId,
        method: 'delete'
    })
}


// 查询所有设备类型
export function listDeviceType() {
    return request({
        url: '/event/alarminfo/listDeviceType',
        method: 'GET'
    })
}

// 查询设备类型详情
export function deviceTypeByType(type) {
    return request({
        url: '/event/alarminfo/devicetype/' + type,
        method: 'get'
    })
}