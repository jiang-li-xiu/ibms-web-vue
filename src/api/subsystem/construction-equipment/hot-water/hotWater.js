import request from '@/utils/request'
// 热水交换系统

// 获取设备列表
export function getEquipmentList(params) {
    return request({
        url: '/tempcontrol/hotExchange/device/local/list',
        method: 'get',
        params
    })
}

// 获取设备详情
export function getEquipmentDetails(params) {
    return request({
        url: '/tempcontrol/hotExchange/getDeviceStatus',
        method: 'get',
        params
    })
}
// 控制设备
export function postControl(data) {
    return request({
        url: `/tempcontrol/hotExchange/switch`,
        method: 'POST',
        data: data
    })
}