/*
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-09-01 15:11:52
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-01 18:14:24
 */
import request from '@/utils/request'

// 菜单显示隐藏
export function putSubsystemSubPluginsV1ServiceSetVisible(data) {
    return request({
        url: `/subsystem/subPlugins/v1/service/setVisible`,
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
export function queryPage(code, query) {
    return request({
        url: `/subsystem/subPlugins/v1/page/${code}`,
        method: 'get',
        params: query
    })
}

/**
 * @description: 查询子插件
 * @param {*} code
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function findOneByCode(code) {
    return request({
        url: `/subsystem/subPlugins/v1/${code}/one`,
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
        url: '/subsystem/subPlugins/v1',
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
        url: '/subsystem/subPlugins/v1',
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
        url: `/subsystem/subPlugins/v1/${ids}`,
        method: 'delete',
    })
}