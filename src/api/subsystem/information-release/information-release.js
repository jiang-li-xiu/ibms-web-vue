/*
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-30 15:14:29
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-10-13 15:27:39
 */

import request from '@/utils/request'
/* 信息发布系统-信息发布设备 */
// 获取设备列表
export function getInfomationsList(params) {
    return request({
        url: `/infomations/data/list`,
        method: 'get',
        params
    })
}
// 设备开关
export function getInfoSendControl(params) {
    return request({
        url: `/infomations/data/sendControl`,
        method: 'get',
        params
    })
}
/* 信息发布系统-信息消息发布 */
// 获取消息列表
export function getProgramList(params) {
    return request({
        url: `/infomations/program/list`,
        method: 'get',
        params
    })
}
// 删除消息
export function deleteProgramDelete(ids) {
    return request({
        url: `/infomations/program/${ids}`,
        method: 'post',
    })
}
// 上传图片
export function uploadProgramImg(data) {
    return request({
        url: `/infomations/program/upload`,
        method: 'post',
        data: data,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}
// 添加消息
export function addProgramMsg(data) {
    return request({
        url: `/infomations/program`,
        method: 'post',
        data: data
    })
}
// 修改消息
export function updateProgramMsg(data) {
    return request({
        url: `/infomations/program`,
        method: 'put',
        data: data
    })
}
/* 信息发布系统-信息消息管理 */
// 添加任务
export function addInfomationsPlan(data) {
    return request({
        url: `/infomations/plan`,
        method: 'post',
        data
    })
}
// 修改任务
export function updateInfomationsPlan(data) {
    return request({
        url: `/infomations/plan`,
        method: 'put',
        data
    })
}
// 获取任务列表
export function getInfomationsPlanList(params) {
    return request({
        url: `/infomations/plan/list`,
        method: 'get',
        params
    })
}
// 删除任务
export function deleteInfomationsPlan(ids) {
    return request({
        url: `/infomations/plan/${ids}`,
        method: 'delete'
    })
}

// 发布任务
export function releasePlan(data) {
    return request({
        url: `/infomations/plan/releasePlan`,
        method: 'post',
        data
    })
}