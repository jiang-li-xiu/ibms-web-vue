/*
 * @Author: MJ
 * @Date: 2021-09-08 11:00:29
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-17 11:24:54
 * @Description: 
 */
import request from '@/utils/request'

// 获取区域树形
export function getRegionTree(query) {
    return request({
        url: '/device/regioninfo/treelist',
        method: 'GET',
        params: query
    })
}

// 根据树形获取数据数据
export function getTableList(query) {
    return request({
        url: '/access/device/local/list',
        method: 'GET',
        params: query
    })
}

// 根据树形获取数据数据
export function putAccessDevice(data) {
    return request({
        url: '/access/device',
        method: 'PUT',
        data
    })
}


// 根据树形获取数据数据
export function exportDevice(data) {
    return request({
        url: '/deviceinfo/exportBy',
        method: 'post',
        data
    })
}
