/*
 * @Author: MJ
 * @Date: 2021-09-08 17:40:43
 * @LastEditors: MJ
 * @LastEditTime: 2021-09-08 18:08:33
 * @Description: 
 */
import request from '@/utils/request'

// 获取区域树形
export function getAccessRecord(query) {
    return request({
        url: '/access/record',
        method: 'GET',
        params: query
    })
}
// 获取图片信息
export function getImageUrl(query) {
    return request({
        url: '/access/record/getImageUrl',
        method: 'GET',
        params:query
    })
}
