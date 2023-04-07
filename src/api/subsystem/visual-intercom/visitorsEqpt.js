/*
 * @Author: MJ
 * @Date: 2021-09-26 10:19:45
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-18 10:35:56
 * @Description: 
 */
import request from '@/utils/request'

// 查询设备信息
export function getTableList(query) {
    return request({
        url: '/intercom/intercom/device/page',
        method: 'GET',
        params: query
    })
}

// 可视对讲开关门
export function postSwitchOff({ id, operation }) {
    return request({
        url: `/intercom/intercom/device/switchOff/${id}/${operation}`,
        method: 'POST',
        data: {}
    })
}

// 设备开门账号密码修改或保存（单个，批量）
export function postSaveOrUpdate(data) {
    return request({
        url: `/intercom/intercom/acount/saveOrUpdate`,
        method: 'POST',
        data
    })
}

// 获取设备账号密码
export function getAccount(query) {
    return request({
        url: '/intercom/intercom/acount/getAccount',
        method: 'GET',
        params: query
    })
}