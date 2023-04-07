/*
 * @Author: Yelucc
 * @Date: 2021-08-02 17:13:21
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-08-04 15:49:41
 * @Description: 
 */
import request from '@/utils/request'

// 查询大数据分析脚本列表
export function listScriptManager(query) {
  return request({
    url: '/bigdata/scriptManager/list',
    method: 'get',
    params: query
  })
}

// 查询大数据分析脚本详细
export function getScriptManager(scriptId) {
  return request({
    url: '/bigdata/scriptManager/' + scriptId,
    method: 'get'
  })
}

// 执行一次
export function execScript(scriptId) {
  return request({
    url: '/bigdata/scriptManager/exec/' + scriptId,
    method: 'get'
  })
}

// 新增大数据分析脚本
export function addScriptManager(data) {
  return request({
    url: '/bigdata/scriptManager',
    method: 'post',
    data: data
  })
}



// 修改大数据分析脚本
export function updateScriptManager(data) {
  return request({
    url: '/bigdata/scriptManager',
    method: 'put',
    data: data
  })
}

// 审核大数据分析脚本
export function checkedScriptManager(data) {
  return request({
    url: '/bigdata/scriptManager/checked',
    method: 'put',
    data: data
  })
}


// 删除大数据分析脚本
export function delScriptManager(scriptId) {
  return request({
    url: '/bigdata/scriptManager/' + scriptId,
    method: 'delete'
  })
}
