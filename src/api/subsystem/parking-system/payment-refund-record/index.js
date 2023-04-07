/*
 * @Author: MJ
 * @Date: 2021-11-11 09:19:13
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-11 15:48:14
 * @Description: 
 */
import request from '@/utils/request'

// -------------------------------车辆缴费记录（start）-------------------------------
// 查询缴费记录
export function getParkinglotCost(params) {
    return request({
        url: `/parkinglot/cost`,
        method: 'GET',
        params
    })
}

// 收费来源 
export function getParkinglotCostChargeSources() {
    return request({
        url: `/parkinglot/cost/chargeSources`,
        method: 'GET',
    })
}

// 收费方式
export function getParkinglotCostChargeTypes() {
    return request({
        url: `/parkinglot/cost/chargeTypes`,
        method: 'GET',
    })
}

// 根据 id 获取详情数据
export function getParkinglotCostId(id) {
    return request({
        url: `/parkinglot/cost/${id}`,
        method: 'GET',
    })
}
// -------------------------------车辆缴费记录（end）-------------------------------


// -------------------------------车辆充值退款记录（start）-------------------------------
// 获取车辆充值退款记录数据
export function getParkinglotCarCharge(params) {
    return request({
        url: `/parkinglot/carCharge`,
        method: 'GET',
        params
    })
}

// 获取交易类型数据
export function getParkinglotCarChargeTradeTypes() {
    return request({
        url: `/parkinglot/carCharge/tradeTypes`,
        method: 'GET',
    })
}

// 获取交易方式数据
export function getParkinglotCarChargeTradeWays() {
    return request({
        url: `/parkinglot/carCharge/tradeWays`,
        method: 'GET',
    })
}

// 根据id获取详情数据
export function getParkinglotCarChargeId(id) {
    return request({
        url: `/parkinglot/carCharge/${id}`,
        method: 'GET',
    })
}
// -------------------------------车辆充值退款记录（end）-------------------------------


// -------------------------------账户充值退款记录（start）-------------------------------
// 获取账户充值退款记录
export function getParkinglotAccount(params) {
    return request({
        url: `/parkinglot/account`,
        method: 'GET',
        params
    })
}

// 获取交易类型数据
export function getParkinglotAccountTradeTypes() {
    return request({
        url: `/parkinglot/account/tradeTypes`,
        method: 'GET',
    })
}

// 获取交易方式数据
export function getParkinglotAccountTradeWays() {
    return request({
        url: `/parkinglot/account/tradeWays`,
        method: 'GET',
    })
}

// 根据id获取详情数据
export function getParkinglotAccountId(id) {
    return request({
        url: `/parkinglot/account/${id}`,
        method: 'GET',
    })
}
// -------------------------------账户充值退款记录（end）-------------------------------