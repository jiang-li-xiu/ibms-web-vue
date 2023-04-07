/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-09 11:13:30
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-09 14:32:53
 */
import request from '@/utils/request'

// 查询车辆管理列表
export function getVehicleList(params) {
    return request({
        url: `/parkinglot/manager/list`,
        method: 'get',
        params
    })
}

// 添加车辆
export function addVehicle(data) {
    return request({
        url: `/parkinglot/manager`,
        method: 'POST',
        data
    })
}

// 编辑车辆
export function editVehicle(data) {
    return request({
        url: `/parkinglot/manager`,
        method: 'put',
        data
    })
}


// 删除
export function deleteVehicle(vehicleIds) {
    return request({
        url: '/parkinglot/manager/' + vehicleIds,
        method: 'delete',
    })
}

// 详情
export function getDetail(vehicleId) {
    return request({
        url: '/parkinglot/manager/' + vehicleId,
        method: 'get',
    })
}