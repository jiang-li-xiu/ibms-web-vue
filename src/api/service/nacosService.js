/*
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-09-06 17:21:48
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-19 09:01:14
 */
import request from '@/utils/request'

/*
 * @description: 服务启用
 * @param {*} serviceName
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function subSystemEnable(serviceName) {
    return request({
        url: `/subsystem/service/req/v2/subSystem/${serviceName}/enable`,
        method: 'get'
    })
}

/*
 * @description: 服务停用
 * @param {*} serviceName
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function subSystemDisable(serviceName) {
    return request({
        url: `/subsystem/service/req/v2/subSystem/${serviceName}/disable`,
        method: 'get'
    })
}

/*
 * @description: 服务启用
 * @param {*} serviceName
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function subPluginEnable(serviceName) {
    return request({
        url: `/subsystem/service/req/v2/subPlugin/${serviceName}/enable`,
        method: 'get'
    })
}

/*
 * @description: 服务停用
 * @param {*} serviceName
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function subPluginDisable(serviceName) {
    return request({
        url: `/subsystem/service/req/v2/subPlugin/${serviceName}/disable`,
        method: 'get'
    })
}

// 选择插件
export function putSelectPlug(data) {
    let { code, subsystem } = data;
    return request({
        url: `/subsystem/subPlugins/v1/use/${code}/${subsystem}`,
        method: 'PUT'
    })
}