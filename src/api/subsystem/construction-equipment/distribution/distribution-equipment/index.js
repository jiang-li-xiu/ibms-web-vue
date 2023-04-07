/*
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-04-07 16:22:19
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-07 16:22:48
 */
import request from '@/utils/request'

/* 变配电系统系统-变配电设备 */
// 获取设备列表
export function getTableList(params) {
    return request({
        url: `/electricsystem/electricSystem/device/list`,
        method: 'get',
        params
    })
}

// 获取设备详情
export function getLisDetail(params) {
    return request({
        url: `/electricsystem/electricSystem/getOneElectricStatus`,
        method: 'get',
        params
    })
}