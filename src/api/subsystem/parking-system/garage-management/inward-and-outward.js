/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-07 14:11:22
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-08 17:44:37
 */
import request from '@/utils/request'

// 获取出入口列表
export function getInAndOutList(params) {
    return request({
        url: `/parkinglot/entrance/list`,
        method: 'get',
        params
    })
}


// 详情
export function getDetail(entranceIndexCode) {
    return request({
        url: `/parkinglot/entrance/${entranceIndexCode}`,
        method: 'get',
    })
}