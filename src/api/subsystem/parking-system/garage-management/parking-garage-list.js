/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-07 11:45:34
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-08 17:54:36
 */
import request from '@/utils/request'

// 获取停车库列表
export function getParkingList(params) {
    return request({
        url: `/parkinglot/parkinglot/list`,
        method: 'get',
        params
    })
}

// 详情
export function getDetail(parkIndexCode) {
    return request({
        url: `/parkinglot/parkinglot/${parkIndexCode}`,
        method: 'get',
    })
}