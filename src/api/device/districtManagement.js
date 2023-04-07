/*
 * @Descripttion:
 * @Author: PengXuanwei
 * @Date: 2021-08-02 14:12:13
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-13 14:58:56
 */
import request from '@/utils/request'

// 获取绿化信息
export function getGreening(query) {
    return request({
        url: '/device/regioninfo/geening/list',
        method: 'GET',
        params: query
    })
}

// 编辑绿化信息
export function editGreening(data) {
    return request({
        url: '/device/regioninfo/geening/update',
        method: 'PUT',
        data
    })
}

// 获取区域树形数据
export function getAreaTree(query) {
    return request({
        url: '/device/regioninfo/treelist',
        method: 'GET',
        params: query
    })
}

// 添加区域树形节点
export function addAreaTree(data) {
    return request({
        url: '/device/regioninfo/add',
        method: 'PUT',
        data
    })
}

// 删除区域树形节点
export function deleteAreaTree(regionIds) {
    return request({
        url: '/device/regioninfo/' + regionIds,
        method: 'DELETE',
    })
}

// 重命名区域树形节点
export function renameAreaTree(data) {
    return request({
        url: '/device/regioninfo/edit',
        method: 'PUT',
        data
    })
}

// 查询区域树形列表下的设备列表
export function getAreaDevice(query) {
    return request({
        url: '/device/regioninfo/treelist/deviceinfo',
        method: 'GET',
        params: query
    })
}
// 查询未绑定区域的设备列表
export function getNoBindingList(query) {
    return request({
        url: '/device/regioninfo/list/binding/no',
        method: 'GET',
        params: query
    })
}
// 绑定与解绑
export function putBindingAndUnbinding(data) {
    return request({
        url: '/device/regioninfo/binding',
        method: 'PUT',
        data
    })
}