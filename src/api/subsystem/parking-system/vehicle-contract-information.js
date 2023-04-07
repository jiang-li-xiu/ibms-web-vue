/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-07 09:54:19
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-08 11:50:09
 */
import request from '@/utils/request'

// 取消车辆包期
export function getCancelPackage(plateNo) {
    return request({
        url: `/parkinglot/period/cancel/${plateNo}`,
        method: 'get',
    })
}

// 查询车辆包期信息
export function getCarPageList(params) {
    return request({
        url: `/parkinglot/period/list`,
        method: 'get',
        params
    })
}

// 查询已经取消的包期列表
export function getCarPageCancelList(params) {
    return request({
        url: `/parkinglot/period/cancel`,
        method: 'get',
        params
    })
}

// 详情
export function getDetail(id) {
    return request({
        url: `/parkinglot/period/${id}`,
        method: 'get',
    })
}

// 详情
export function getCancelDetail(id) {
    return request({
        url: `/parkinglot/period/cancel/details/${id}`,
        method: 'get',
    })
}