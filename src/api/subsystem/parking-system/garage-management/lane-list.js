/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-07 14:18:53
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-08 18:08:26
 */
import request from '@/utils/request'

export function getRoadWayList(params) {
    return request({
        url: `/parkinglot/roadway/list`,
        method: 'get',
        params
    })
}

// 详情
export function getDetail(roadwayIndexCode) {
    return request({
        url: `/parkinglot/roadway/${roadwayIndexCode}`,
        method: 'get',
    })
}