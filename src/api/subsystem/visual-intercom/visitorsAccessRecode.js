/*
 * @Author: MJ
 * @Date: 2021-09-26 11:35:01
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-11 10:47:57
 * @Description: 
 */
import request from '@/utils/request'

// 获取访客出入记录数据
export function postIntercomEventQuery(query) {
    return request({
        url: '/intercom/intercom/evetn/page',
        method: 'GET',
        params: query
    })
}

// 访客统计 
export function postIntercomEventTotal() {
    return request({
        url: '/intercom/eventTotal',
        method: 'GET'
    })
}

// 获取出入记录抓拍图片
export function getPicUrl(id) {
    return request({
        url: `/intercom/intercom/evetn/getPicUrl/${id}`,
        method: 'GET'
    })
}