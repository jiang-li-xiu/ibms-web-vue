/*
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-28 11:01:00
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-09-30 09:01:11
 */

import request from '@/utils/request'
/* 环境监测系统-环境监控数据 */
// 获取环境监控数据
export function getSelectEnvironmentData(params) {
    return request({
        url: `/environment/selectEnvironmentData`,
        method: 'get',
        params
    })
}
/* 环境监测系统-环境监控数据 */
// 获取环境监控折线图
export function getMonitorData(data) {
    return request({
        url: `/environment/monitorData`,
        method: 'post',
        data
    })
}
//监控数据平均值
export function getCurrentData(data) {
    return request({
        url: `/environment/currentData`,
        method: 'post',
        data
    })
}
//设置检测频率
export function getSetFrequency(data) {
    return request({
        url: `/environment/setFrequency`,
        method: 'post',
        data
    })
}
/* 环境监测是设备查看 */
//设备信息
export function getDeviceInfo(params) {
    return request({
        url: `/environment/getDeviceInfo`,
        method: 'get',
        params
    })
}
//设备信息
export function getEnvironmentData(params) {
    return request({
        url: `/environment/getEnvironmentData`,
        method: 'get',
        params
    })
}

//折线图
export function lineChart(data) {
    return request({
        url: `/environment/lineChart`,
        method: 'post',
        data
    })
}

//折线图
export function columnChart(data) {
    return request({
        url: `/environment/columnChart`,
        method: 'post',
        data
    })
}