/*
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-09-08 09:28:08
 * @LastEditors: Chen
 * @LastEditTime: 2021-09-08 09:30:44
 */
import request from '@/utils/request'

/**
 * @description: 根据子系统Code分页查询
 * @param {*} serviceName
 * @param {*} query
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function queryPageByCode(serviceName, query) {
    return request({
        url: `/subsystem/subPlugins/v1/page/${serviceName}`,
        method: 'get',
        params: query
    })
}

/**
 * @description: 统计子插件起停用数量
 * @param {*} serviceName
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function countOfStatus(serviceName) {
    return request({
        url: `/subsystem/subPlugins/v1/count/${serviceName}`,
        method: 'get',
    })
}

