/*
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-03-22 14:35:25
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-22 14:44:16
 */
import request from '@/utils/request'

// 查询告警记录列表
export function getAlarmRecordList(query) {
    return request({
        url: '/event/history/list',
        method: 'get',
        params: query
    })
}

// 查询告警记录详细
export function getAlarmRecordDetail(id) {
    return request({
        url: '/event/history/' + id,
        method: 'get'
    })
}

// 新增告警记录
export function addHistory(data) {
    return request({
        url: '/event/history',
        method: 'post',
        data: data
    })
}

// 修改告警记录
export function updateHistory(data) {
    return request({
        url: '/event/history',
        method: 'put',
        data: data
    })
}

// 删除告警记录
export function delHistory(id) {
    return request({
        url: '/event/history/' + id,
        method: 'delete'
    })
}

// 查询报信息
export function alarminofList() {
    return request({
        url: '/event/history/alarminofList',
        method: 'get'
    })
}

// 查询设备信息
export function deiceList() {
    return request({
        url: '/event/history/deviceList',
        method: 'get'
    })
}

// 忽略
export function postHistoryProcessing(id) {
    return request({
        url: `/event/history/processing/${id}/2`,
        method: 'POST',
    })
}

// 处理告警事件
export function processingHistory(data, id) {
    return request({
        url: '/event/history/processing/' + id + '/0',
        method: 'POST',
        data: data
    })
}

// 确认事件
export function editConfirmStatus(query) {
    return request({
        url: '/event/history/editconfirmstatus',
        method: 'get',
        params: query
    })
}