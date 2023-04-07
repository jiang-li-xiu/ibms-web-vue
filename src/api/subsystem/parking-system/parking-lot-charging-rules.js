/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-07 10:11:15
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-08 14:27:54
 */
import request from '@/utils/request'

// 停车场收费规则列表
export function getChargeRules(params) {
    return request({
        url: `/parkinglot/rule/list`,
        method: 'get',
        params
    })
}

// 详情
export function getDetailParkingChargingRules(id) {
    return request({
        url: `/parkinglot/rule/${id}`,
        method: 'get',
    })
}