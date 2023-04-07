/*
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-10-08 15:59:15
 * @LastEditors: Chen
 * @LastEditTime: 2021-10-09 14:15:42
 */
import request from '@/utils/request'

/**
 * @description: 分页查询
 * @param {*} query
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function queryPage(query) {
    return request({
        url: '/subsystem/serviceRecords/v1/page',
        method: 'get',
        params: query
    })
}

/**
 * @description: 批量删除
 * @param {*} ids
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function delBatch(ids) {
    return request({
        url: `/subsystem/serviceRecords/v1/remove/${ids}`,
        method: 'delete'
    })
}

/**
 * @description: 清空服务记录日志
 * @param {*}
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function clean() {
    return request({
        url: `/subsystem/serviceRecords/v1/clean`,
        method: 'delete'
    })
}