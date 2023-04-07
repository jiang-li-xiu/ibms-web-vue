/*
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-12-24 14:55:01
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-12-24 17:50:43
 */
import request from '@/utils/request'

// 巡更设备列表
export function getPatrolDeviceList(params) {
    return request({
        url: `/patrol/patrolDevice/list`,
        method: 'get',
        params
    })
}

// 巡更地点列表
export function getPatrolPositionList(params) {
    return request({
        url: `/patrol/position/list`,
        method: 'get',
        params
    })
}


// 巡更记录列表
export function getPatrolRecordList(params) {
    return request({
        url: `/patrol/record/list`,
        method: 'get',
        params
    })
}

// 巡更线路列表
export function getPatrolRouterList(params) {
    return request({
        url: `/patrol/route/list`,
        method: 'get',
        params
    })
}
// 添加巡更线路
export function addRouter(data) {
    return request({
        url: `/patrol/route`,
        method: 'post',
        data
    })
}
// 更新巡更线路
export function updateRouter(data) {
    return request({
        url: `/patrol/route`,
        method: 'put',
        data
    })
}

// 更新巡更线路
export function deleteRouter(data) {
    return request({
        url: `/patrol/route` + data,
        method: 'delete',
    })
}

// 删除巡更线路
export function deletePatrolRoute(ids) {
    return request({
        url: `/patrol/route/${ids}`,
        method: 'DELETE',
    })
}

// 根据路线id查地点
export function getPatrolRoute(id,data) {
    return request({
        url: `/patrol/route/getPositionByRouterId/${id}`,
        method: 'GET',
        params:data
    })
}

// 删除线路
export function deleteLineRoute(id) {
    return request({
        url: `/patrol/route/${id}`,
        method: 'DELETE',
    })
}

// 解除绑定地点
export function putRoutUnbindByIds(routerId, ids) {
    return request({
        url: `/patrol/route/unbindByIds/${routerId}/${ids}`,
        method: 'PUT',
    })
}

// 获取线路未绑定的地点
export function getRoutGetUnBindPosition(parameter) {
    return request({
        url: `/patrol/route/getUnBindPosition`,
        method: 'GET',
        params: parameter
    })
}

// 获取线路未绑定的地点
export function putRout(parameter) {
    return request({
        url: `/patrol/route`,
        method: 'PUT',
        data: parameter
    })
}