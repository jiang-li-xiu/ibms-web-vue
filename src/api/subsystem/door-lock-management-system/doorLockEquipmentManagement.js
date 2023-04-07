/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 14:49:06
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-17 09:20:12
 */
import request from '@/utils/request'

// 查询门锁设备管理列表
export function getEquipmentList(params) {
    return request({
        url: `/doorlock/lockDevice/local/list`,
        method: 'get',
        params
    })
}

// 控制门锁
export function getControlLock(deviceCode, mode) {
    return request({
        url: `/doorlock/lockDevice/do-ctrl/${deviceCode}/${mode}`,
        method: 'get',
    })
}