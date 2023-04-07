/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-10 08:55:08
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-10 10:15:13
 */
import request from '@/utils/request'

// 查询门禁设备列表
export function getAccessControlList(params) {
    return request({
        url: `/access/entranceguardDevice/list`,
        method: 'get',
        params
    })
}

// 详情
export function getDetail(indexCode) {
    return request({
        url: '/access/entranceguardDevice/' + indexCode,
        method: 'get',
    })
}