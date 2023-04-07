/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-07 11:55:07
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-09 11:12:18
 */
import request from '@/utils/request'

// 查询停车库节点信息
export function getParkingNodeList(params) {
    return request({
        url: `/parkinglot/message/list`,
        method: 'get',
        params
    })
}

// 详情
export function getDetail(indexCode) {
    return request({
        url: `/parkinglot/message/${indexCode}`,
        method: 'get',
    })
}



// 批量添加车辆
export function addVehicle(params) {
    return request({
        url: `/api/resource/v1/vehicle/batch/add`,
        method: 'POST',
        params
    })
}

// 编辑车辆
export function editVehicle(params) {
    return request({
        url: `/api/resource/v1/vehicle/single/update`,
        method: 'POST',
        params
    })
}


// 删除
export function deleteVehicle(vehicleIds) {
    return request({
        url: '/api/resource/v1/vehicle/batch/delete' + vehicleIds,
        method: 'delete',
    })
}