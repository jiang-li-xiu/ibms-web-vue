import request from '@/utils/request'

// 巡更设备列表
export function getRecordList(parameter) {
    return request({
        url: `/patrol/record/list`,
        method: 'GET',
        params: parameter
    })
}