/*
 * @Author: Yelucc
 * @Date: 2021-08-10 14:07:35
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-11 17:01:38
 * @Description: 
 */
import request from '@/utils/request'

// 监控设备列表
export function getEquipmentTableList(query) {
    return request({
        url: '/video/device/local/list',
        method: 'GET',
        params: query
    })
}

// 添加视图
export function postVideoView(data) {
    return request({
        url: '/video/view',
        method: 'POST',
        data
    })
}

// 编辑视图
export function putVideoView(data) {
    return request({
        url: '/video/view',
        method: 'PUT',
        data
    })
}


// 获取视图列表
export function getVideoViewList(query) {
    return request({
        url: '/video/view/list',
        method: 'GET',
        params: query
    })
}

// 拖动添加文件
export function postVideoViewAddCamera(data) {
    return request({
        url: '/video/view/addCamera',
        method: 'POST',
        data
    })
}

// 删除视图
export function deleteVideoViewDelete(id) {
    return request({
        url: '/video/view/delete/' + id,
        method: 'DELETE',
    })
}


// 删除点位信息
export function deleteVideoViewDeleteCamera(id) {
    return request({
        url: '/video/view/deleteCamera/' + id,
        method: 'DELETE',
    })
}

// 获取回放流
export function getStreamGetPlaybackStream(query) {
    return request({
        url: '/video/stream/getPlaybackUrl',
        method: 'GET',
        params: query
    })
}

// 控制云台方向
export function getControlDirection(query) {
    return request({
        url: '/video/device/controlCamera/direct',
        method: 'GET',
        params: query
    })
}

// 画面放大缩小
export function getZoomInAndOut(query) {
    return request({
        url: '/video/device/controlCamera/zoom',
        method: 'GET',
        params: query
    })
}
export function listVideoDevice() {
    return request({
        url: '/video/region/treelist',
        method: 'get',
    })
}
export function getStreamUrlByDeviceId(query) {
    return request({
        url: '/video/stream/getStreamUrl',
        method: 'GET',
        params: query
    })
}
export function getUserViewUri(row) {
    return request({
        url: '/video/stream/getUserViewUri/' + row,
        method: 'get',
    })
}
export function addVideoView(data) {
    return request({
        url: '/video/view',
        method: 'post',
        data: data
    })
}
export function addVideoViewPoint(data) {
    return request({
        url: '/video/view/addCamera',
        method: 'post',
        data: data
    })
}
export function delVideoView(data) {
    return request({
        url: '/video/view/delete/' + data,
        method: 'delete',
    })
}

export function getUrlByChannelId(query) {
    return request({
        url: '/video/stream/getStreamUrl',
        method: 'get',
        params: query
    })
}

// 获取key
export function getVideoDeviceHikInfo() {
    return request({
        url: '/video/device/hikInfo',
        method: 'GET',
    })
}