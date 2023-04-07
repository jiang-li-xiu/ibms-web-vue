/*
 * @Author: MJ
 * @Date: 2021-10-27 14:51:52
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-29 15:28:39
 * @Description: 
 */
import request from '@/utils/request'

// -------------------------------------会议室查看（start）----------------------------------------------
// 会议室查看数据列表
export function getMeetingMeetingRoomList(query) {
    return request({
        url: '/meeting/meetingRoom/list',
        method: 'GET',
        params: query
    })
}

// 根据 id 获取会议详情
export function getMeetingMeetingRoom(id) {
    return request({
        url: `/meeting/meetingRoom/${id}`,
    })
}
// -------------------------------------会议室查看（end）----------------------------------------------


// -------------------------------------预约信息查看（start）----------------------------------------------
// 预约信息查看列表
export function getMeetingMeetingList(query) {
    return request({
        url: '/meeting/meeting/list',
        method: 'GET',
        params: query
    })
}

// 根据 id 获取预约信息查看详情
export function getMeetingMeeting(id) {
    return request({
        url: `/meeting/meeting/${id}`,
    })
}
// -------------------------------------预约信息查看（end）----------------------------------------------


// -------------------------------------资源查看（start）----------------------------------------------
// 资源查看数据列表
export function getMeetingResourceList(query) {
    return request({
        url: '/meeting/resource/list',
        method: 'GET',
        params: query
    })
}
// -------------------------------------资源查看（end）----------------------------------------------

// -------------------------------------用户查看（start）----------------------------------------------
// 用户查看列表
export function getMeetingMeetingUserList(query) {
    return request({
        url: '/meeting/meetingUser/list',
        method: 'GET',
        params: query
    })
}
// -------------------------------------用户查看（end）----------------------------------------------



// 根据树形获取数据数据
export function putAccessDevice(data) {
    return request({
        url: '/access/device',
        method: 'PUT',
        data
    })
}