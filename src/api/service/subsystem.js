/*
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-09-01 15:11:40
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-01 17:10:38
 */
import request from '@/utils/request'

// 菜单显示隐藏
export function putSubSystemsV1SetVisible(data) {
    return request({
        url: '/subsystem/subSystems/v1/setVisible',
        method: 'PUT',
        data: data
    })
}

/**
 * @description: 分页查询
 * @param {*}
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function queryPage(query) {
    return request({
        url: '/subsystem/subSystems/v1/page',
        method: 'get',
        params: query
    })
}

/**
 * @description: 获取对象
 * @param {*} id
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function findOne(id) {
    return request({
        url: `/subsystem/subSystems/v1/${id}`,
        method: 'get',
    })
}

/**
 * @description: 保存子系统
 * @param {*} data
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function save(data) {
    return request({
        url: '/subsystem/subSystems/v1',
        method: 'post',
        data: data
    })
}

/**
 * @description: 修改子系统
 * @param {*} data
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function edit(data) {
    return request({
        url: '/subsystem/subSystems/v1',
        method: 'put',
        data: data
    })
}

/**
 * @description: 批量删除子系统
 * @param {*} ids
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function delBatch(ids) {
    return request({
        url: `/subsystem/subSystems/v1/${ids}`,
        method: 'delete',
    })
}