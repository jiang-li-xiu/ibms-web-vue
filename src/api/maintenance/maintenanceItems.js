/*
 * @Author: RobertFan
 * @Date: 2022-06-07 18:25:08
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-06-08 11:15:02
 * @Description: 
 */
import request from '@/utils/request'

/**
 * @description: 查询维保项目列表
 * @param {*} query
 * @return {*}
 */
export function getTableList(query) {
    return request({
        url: '/maintenance/project/list',
        method: 'get',
        params: query
    })
}

/**
 * @description: 新增维保项目
 * @param {*} data
 * @return {*}
 */
export function addList(data) {
    return request({
        url: '/maintenance/project/add',
        method: 'post',
        data: data
    })
}

/**
 * @description: 修改维保项目
 * @param {*} data
 * @return {*}
 */
export function editList(data) {
    return request({
        url: '/maintenance/project/edit',
        method: 'put',
        data: data
    })
}

/**
 * @description: 维保项目详情
 * @param {*} maintenanceId
 * @return {*}
 */
export function getDetails(maintenanceId) {
    return request({
        url: `/maintenance/project/${maintenanceId}`,
        method: 'get'
    })
}

/**
 * @description: 删除维保项目
 * @param {*} maintenanceIds
 * @return {*}
 */
export function deleteList(maintenanceIds) {
    return request({
        url: `/maintenance/project/${maintenanceIds}`,
        method: 'delete'
    })
}