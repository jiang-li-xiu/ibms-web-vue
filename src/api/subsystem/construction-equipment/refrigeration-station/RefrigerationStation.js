import request from '@/utils/request'

/* 建筑设备监控系统-冷冻站系统 */
// 获取设备列表
export function getEquipmentList(params) {
    return request({
        url: `/tempcontrol/coolStation/device/local/list`,
        method: 'get',
        params
    })
}

// 获取设备详情
export function getEquipmentDetails(params) {
    return request({
        url: '/tempcontrol/coolStation/getDeviceStatus',
        method: 'get',
        params
    })
}

// 控制设备
export function postControl(data) {
    return request({
        url: `/tempcontrol/coolStation/switch`,
        method: 'POST',
        data: data
    })
}