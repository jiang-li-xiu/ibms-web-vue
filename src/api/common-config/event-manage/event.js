/*
 * @Author: MJ
 * @Date: 2021-09-24 09:09:35
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-18 18:06:34
 * @Description: 
 */
import request from '@/utils/request'


// 查询事件记录列表
export function getEventList(query) {
    return request({
        url: '/event/event/list',
        method: 'get',
        params: query
    })
}

// 查询事件记录详细
export function getEventDetail(id) {
    return request({
        url: '/event/event/' + id,
        method: 'get'
    })
}

// 新增事件记录
export function addEvent(data) {
    return request({
        url: '/event/event',
        method: 'post',
        data: data
    })
}

// 修改事件记录
export function editEvent(data) {
    return request({
        url: '/event/event',
        method: 'put',
        data: data
    })
}

// 删除事件记录
export function delEvent(id) {
    return request({
        url: '/event/event/' + id,
        method: 'delete'
    })
}

// 忽略
export function ignoreEvent(id) {
    return request({
        url: `/event/event/processing/${id}/2`,
        method: 'POST',
        data: {}
    })
}

// 处理事件
export function processEvent(data, id) {
    return request({
        url: '/event/event/processing/' + id + '/0',
        method: 'POST',
        data: data
    })
}

// 确认事件
export function editConfirmStatus(query) {
    return request({
        url: '/event/event/editconfirmstatus',
        method: 'get',
        params: query
    })
}