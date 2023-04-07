/*
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-04-07 16:23:29
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-04-07 16:46:12
 */
import request from '@/utils/request'

/* 新风机系统-新风机设备 */
// 获取设备列表
export function getTableList(params) {
    return request({
        url: `newfan/newFan/device/list`,
        method: 'get',
        params
    })
}

// 获取设备详情
export function getLisDetail(params) {
    return request({
        url: `newfan/newFan/getOneDeviceStatus`,
        method: 'get',
        params
    })
}

// 控制设备
export function postControl(data) {
    return request({
        url: `newfan/newFan/switch`,
        method: 'POST',
        data: data
    })
}