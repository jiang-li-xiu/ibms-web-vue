/*
 * @Author: MJ
 * @Date: 2021-10-08 09:13:55
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-18 09:02:09
 * @Description: 
 */
import request from '@/utils/request'

// 获取区域树形
export function getRegionTree(query) {
    return request({
        url: '/device/regioninfo/treelist',
        method: 'GET',
        params: query
    })
}

// 获取 广播设备查看 table 数据
export function getEquipmentTable(query) {
    return request({
        url: '/broadcast/broadcast/device/list',
        method: 'GET',
        params: query
    })
}






// 获取 获取歌单列表 数据
export function getSongSheet() {
    return request({
        url: '/broadcast/broadcast/getDirectory',
        method: 'GET',
    })
}

// 根据 歌单列表 id 获取 table 数据
export function getSongSheetTable(query) {
    return request({
        url: '/broadcast/broadcast/getSongsByNameOrId',
        method: 'GET',
        params: query
    })
}


/******************** 定时播放管理(start) ************************** */

// 定时播放管理 获取数据列表
export function getJobTable(query) {
    return request({
        url: '/schedule/broadcast/job/list',
        method: 'GET',
        params: query
    })
}

// 定时播放管理 新增 
export function postBroadcastJobAdd(data) {
    return request({
        url: '/schedule/broadcast/job/add',
        method: 'POST',
        data
    })
}

// 定时播放管理/公共广播设置 获取所有歌曲 
export function getSongsAll() {
    return request({
        url: '/broadcast/broadcast/getSongsAll',
        method: 'GET',
    })
}

// 定时播放管理 删除数据
export function deleteJob(jobId) {
    return request({
        url: `/schedule/broadcast/job/delete/${jobId}`,
        method: 'POST',
    })
}

// 定时播放管理 修改状态
export function putStatus(jobId) {
    return request({
        url: `/schedule/broadcast/job/update/${jobId}`,
        method: 'POST',
    })
}

// 定时播放管理 根据 jobId 获取数据 
export function getOneJob(query) {
    return request({
        url: `/schedule/broadcast/job/getOne`,
        method: 'GET',
        params: query
    })
}

// 定时播放管理 更新数据
export function updateJob(data) {
    return request({
        url: `/schedule/broadcast/job/update`,
        method: 'POST',
        data
    })
}

/******************** 定时播放管理(end) ************************** */

/******************** 公共广播设置(start) ************************** */

// // 公共广播设置 获取系统状态 
// export function getSystemState(query) {
//     return request({
//         url: `/broadcast/broadcast/getSystemState`,
//         method: 'GET',
//         params: query
//     })
// }

// // 公共广播设置 获取广播设备在线离线状态数量
// export function getDeviceStatusCount(query) {
//     return request({
//         url: `/broadcast/broadcast/getDeviceStatusCount`,
//         method: 'GET',
//         params: query
//     })
// }

// 公共广播设置 公共广播总控制状态信息
export function getControlState() {
    return request({
        url: `/broadcast/current/controllerStats`,
        method: 'GET',
    })
}

// 公共广播设置 公共广播总控制
export function putTotalControl(query) {
    return request({
        url: `/broadcast/current/setController`,
        method: 'PUT',
        data: query
    })
}

// 公共广播设置 公共广播总控制 音量、歌曲等
export function putDetailControl(query) {
    return request({
        url: `/broadcast/current/controller`,
        method: 'PUT',
        data: query
    })
}

// 公共广播设置 公共广播服务器信息 
export function getSystemStateAndDeviceStatusCount() {
    return request({
        url: `/broadcast/broadcast/getSystemStateAndDeviceStatusCount`,
        method: 'GET',
    })
}

// 公共广播设置 获取全部歌单 
export function getDirectory(query) {
    return request({
        url: `/broadcast/broadcast/getDirectory`,
        method: 'GET',
        data: query
    })
}

// 公共广播设置 通过 歌单ID 获取歌曲
export function getSongsId(query) {
    return request({
        url: `/broadcast/broadcast/getSongs`,
        method: 'GET',
        params: query
    })
}

// 公共广播设置 查询播放设备状态
export function getCurrentList(query) {
    return request({
        url: `/broadcast/broadcast/current/list`,
        method: 'GET',
        params: query
    })
}

// 公共广播设置 播放歌曲
export function putCurrentPlay(data) {
    return request({
        url: `/broadcast/current/play`,
        method: 'PUT',
        data
    })
}

/******************** 公共广播设置(end) ************************** */