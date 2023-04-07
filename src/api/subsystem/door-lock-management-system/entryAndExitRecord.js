/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 16:11:03
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-16 17:26:06
 */
import request from '@/utils/request'

// 查询人员进出记录列表
export function getPeopletList(params) {
    return request({
        url: `/doorlock/record/List`,
        method: 'get',
        params
    })
}

export function getDetail(id) {
    return request({
        url: `/doorlock/record/${id}`,
        method: 'get'
    })
}