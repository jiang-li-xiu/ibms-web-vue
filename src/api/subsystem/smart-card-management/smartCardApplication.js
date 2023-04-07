/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-19 11:17:47
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-22 09:45:42
 */
import request from '@/utils/request'

// 查询卡片列表
export function getList(params) {
    return request({
        url: `/intercom/card/list`,
        method: 'get',
        params
    })
}

// 添加
export function addSmart(data) {
    return request({
        url: `/intercom/card/add`,
        method: 'POST',
        data
    })
}

// 删除
export function deleteSmart(data) {
    return request({
        url: `/intercom/card/remove`,
        method: 'delete',
        data
    })
}

// 详情
export function getDetail(id) {
    return request({
        url: `/intercom/card/info/${id}`,
        method: 'get',
    })
}

// 查询设备信息
export function getEquimentList(query) {
    return request({
        url: '/intercom/intercom/device/page',
        method: 'GET',
        params: query
    })
}