import request from '@/utils/request'
/* 楼控-温控设备列表 */
// 获取设备列表
export function getTableList(params) {
    return request({
        url: `/tempcontrol/temp/device/local/list`,
        method: 'get',
        params
    })
}

// 获取控制详情
export function getDetail(params) {
    return request({
        url: `/tempcontrol/temp/getDeviceStatus`,
        method: 'get',
        params
    })
}

// 控制面板操作
export function postControl(data) {
    return request({
        url: `/tempcontrol/temp/switch`,
        method: 'post',
        data
    })
}