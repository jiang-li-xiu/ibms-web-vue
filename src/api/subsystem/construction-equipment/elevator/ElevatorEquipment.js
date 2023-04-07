import request from '@/utils/request'
// 电梯管理系统

// 获取设备列表
export function getEquipmentList(params) {
    return request({
        url: '/elevator/device/local/list',
        method: 'get',
        params
    })
}
// 获取设备详情
export function getEquipmentDetails(params) {
    return request({
        url: '/elevator/elevator/getDeviceListStatus',
        method: 'get',
        params
    })
}
// 获取告警记录列表
export function getRecordList(params) {
    return request({
        url: '/elevator/fault/list',
        method: 'get',
        params
    })
}