/*
 * @Author: RobertFan
 * @Date: 2022-06-09 18:40:43
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-06-09 21:35:48
 * @Description: 
 */
import request from '@/utils/request'

/**
 * @description: 查询个人任务列表
 * @param {*} query
 * @return {*}
 */
export function getTableList(query) {
    return request({
        url: '/maintenance/task/myList',
        method: 'get',
        params: query
    })
}

/**
 * @description: 添加维保任务
 * @param {*} data
 * @return {*}
 */
export function addMaintenanceList(data) {
    return request({
        url: '/maintenance/task/maintainResult',
        method: 'put',
        data: data
    })
}