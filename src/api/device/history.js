/*
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-31 11:21:57
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-07-31 11:54:06
 */
import request from '@/utils/request'

// 查询设备日志列表
export function listHistory(query) {
  return request({
    url: '/device/deviceinfo/getInfoHistory',
    method: 'get',
    params: query
  })
}

// 查询设备日志详细
export function getAlarmRecordDetail(deviceinfoHistoryId) {
  return request({
    url: '/system/history/' + deviceinfoHistoryId,
    method: 'get'
  })
}

// 新增设备日志
export function addHistory(data) {
  return request({
    url: '/system/history',
    method: 'post',
    data: data
  })
}

// 修改设备日志
export function updateHistory(data) {
  return request({
    url: '/system/history',
    method: 'put',
    data: data
  })
}

// 删除设备日志
export function delHistory(deviceinfoHistoryId) {
  return request({
    url: '/system/history/' + deviceinfoHistoryId,
    method: 'delete'
  })
}
