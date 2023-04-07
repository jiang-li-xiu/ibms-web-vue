/*
 * @Author: RobertFan
 * @Date: 2022-06-07 18:25:08
 * @LastEditors: RobertFan
 * @LastEditTime: 2022-06-14 14:08:06
 * @Description: 
 */
import request from '@/utils/request'

/**
 * @description: 查询基本任务列表
 * @param {*} query
 * @return {*}
 */
export function getTableList(query) {
    return request({
        url: '/maintenance/task/list',
        method: 'get',
        params: query
    })
}

/**
 * @description: 新增基本任务
 * @param {*} data
 * @return {*}
 */
export function addList(data) {
    return request({
        url: '/maintenance/task/add',
        method: 'post',
        data: data
    })
}

/**
 * @description: 修改基本任务
 * @param {*} data
 * @return {*}
 */
export function editList(data) {
    return request({
        url: '/maintenance/task/edit',
        method: 'put',
        data: data
    })
}

/**
 * @description: 基本任务详情
 * @param {*} taskId
 * @return {*}
 */
export function getDetails(taskId) {
    return request({
        url: `/maintenance/task/${taskId}`,
        method: 'get'
    })
}

/**
 * @description: 删除基本任务
 * @param {*} taskIds
 * @return {*}
 */
export function deleteList(taskIds) {
    return request({
        url: `/maintenance/task/${taskIds}`,
        method: 'delete'
    })
}

/**
 * @description: 获取设备类型
 * @param {*} 
 * @return {*}
 */
export function getDeviceType() {
    return request({
        url: '/maintenance/task/getDevTypeList',
        method: 'get'
    })
}

/**
 * @description: 获取负责人列表
 * @param {*} 
 * @return {*}
 */
export function getUserList() {
    return request({
        url: '/maintenance/task/getUserList',
        method: 'get'
    })
}