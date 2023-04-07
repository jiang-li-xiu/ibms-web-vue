/*
 * @Author: MJ
 * @Date: 2021-07-23 09:29:12
 * @LastEditors: MJ
 * @LastEditTime: 2021-09-04 15:31:43
 * @Description: 
 */
import request from '@/utils/request'


// 联动管理列表
export function getLinkConfig(query) {
    return request({
        url: '/link/config',
        method: 'GET',
        params: query
    })
}

// 联动管理修改状态
export function getLinkConfigSetStatus(query) {
    return request({
        url: '/link/config/setStatus',
        method: 'GET',
        params: query
    })
}

// 联动管理删除
export function deleteLinkConfig(id) {
    return request({
        url: '/link/config?actionId=' + id,
        method: 'DELETE',
    })
}

// 设备类管理修改状态
export function statusUpdate(data) {
    return request({
        url: '/device/devicetype/status/update',
        method: 'PUT',
        data
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

// 设备数据列表 
export function getDeviceinfoList(query) {
    return request({
        url: '/device/deviceinfo/list',
        method: 'GET',
        params: query
    })
}

// 选择设备类型 
export function getDevicetypeListNopage() {
    return request({
        url: '/device/devicetype/list/nopage',
        method: 'GET',
    })
}

// 设备属性
export function getDeviceDeviceinfoProperties(id) {
    return request({
        url: '/device/deviceinfo/properties/' + id,
        method: 'GET',
    })
}

// 设备事件
export function getDeviceDeviceinfoEvents(id) {
    return request({
        url: '/device/deviceinfo/events/' + id,
        method: 'GET',
    })
}

// 设备功能
export function getDeviceDeviceinfoFunctions(id) {
    return request({
        url: '/device/deviceinfo/functions/' + id,
        method: 'GET',
    })
}

// 新增联动
export function postLinkConfig(data) {
    return request({
        url: '/link/config',
        method: 'POST',
        data
    })
}

// 联动详情
export function getLinkConfigDetail(params) {
    return request({
        url: '/link/config/detail',
        method: 'GET',
        params
    })
}

// 联动修改
export function putLinkConfig(data) {
    return request({
        url: '/link/config',
        method: 'PUT',
        data
    })
}

// 根据类型获取列表
export function getNoticeNoticeConfigV1List(type) {
    return request({
        url: '/notice/noticeConfig/v1/list/' + type,
        method: 'GET',
    })
}

// 根据服务商获取列表
export function getNoticeNoticeTemplateV1List(serviceProvider) {
    return request({
        url: '/notice/noticeTemplate/v1/list/' + serviceProvider,
        method: 'GET',
    })
}
