/*
 * @Author: Yelucc
 * @Date: 2021-08-10 14:07:35
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-14 16:45:55
 * @Description: 
 */
import request from '@/utils/request'

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
        url: '/stream/getPlaybackStream',
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
export function getStreamUrlByDeviceId(id) {
    return request({
        url: '/video/stream/getStreamUrl/' + id,
        method: 'get',
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