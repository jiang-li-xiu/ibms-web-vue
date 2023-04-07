/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-05 09:24:15
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-05 10:41:58
 */
import request from '@/utils/request'

// 重大事件列表
export function getTableList(query) {
    return request({
        url: '/event/important/list',
        method: 'get',
        params: query
    })
}

// 删除
export function delList(ids) {
    return request({
        url: `/event/important`,
        method: 'delete',
        data: ids
    })
}

// 添加
export function addImportEvents(data) {
    return request({
        url: '/event/important',
        method: 'post',
        data: data,
    })
}

// 修改
export function editImportEvents(data) {
    return request({
        url: '/event/important',
        method: 'put',
        data,
    })
}

// 详情
export function getDetail(id) {
    return request({
        url: `/event/important/${id}`,
        method: 'get'
    })
}