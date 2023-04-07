/*
 * @Author: Yelucc
 * @Date: 2021-07-23 09:16:56
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-07-23 15:06:54
 * @Description: 
 */
import request from '@/utils/request'

// 查询大数据分析方案列表
export function listScheme(query) {
  return request({
    url: '/bigdata/scheme/list',
    method: 'get',
    params: query
  })
}

// 查询大数据分析方案详细
export function getScheme(schemeId) {
  return request({
    url: '/bigdata/scheme/' + schemeId,
    method: 'get'
  })
}

// 新增大数据分析方案
export function addScheme(data) {
  return request({
    url: '/bigdata/scheme',
    method: 'post',
    data: data
  })
}

// 修改大数据分析方案
export function updateScheme(data) {
  return request({
    url: '/bigdata/scheme',
    method: 'put',
    data: data
  })
}

// 删除大数据分析方案
export function delScheme(schemeId) {
  return request({
    url: '/bigdata/scheme/' + schemeId,
    method: 'delete'
  })
}

// 查询数据库列表
export function selectDbTableList() {
  return request({
    url: '/bigdata/scheme/db/list',
    method: 'get'
  })
}

// 查询数据表字段列表
export function columnList(query) {
  return request({
    url: '/bigdata/scheme/column?tableName=' + query,
    method: 'get',
    // query:query
  })
}
