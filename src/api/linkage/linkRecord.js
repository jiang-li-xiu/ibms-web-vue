/*
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-09-13 18:27:44
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-22 09:44:19
 */
import request from '@/utils/request'

// 查询联动记录列表
export function getLinkRecordList(query) {
  return request({
    url: '/link/record/v1/list',
    method: 'get',
    params: query
  })
}

// 查询联动记录详细
export function getLinkRecordDatail(id) {
  return request({
    url: '/link/record/v1/detail/' + id,
    method: 'get'
  })
}


// 删除联动记录
export function delLinkRecord(ids) {
  return request({
    url: '/link/record/v1/delete/' + ids,
    method: 'delete'
  })
}


// 导出联动记录列表
export function exportLinkRecord(query) {
  return request({
    url: '/link/record/v1/export',
    method: 'get',
    params: query
  })
}