import request from '@/utils/request'

// 查询分析变量列表
export function listVariable(query) {
  return request({
    url: '/bigdata/variable/list',
    method: 'get',
    params: query
  })
}

// 查询分析变量详细
export function getVariable(varId) {
  return request({
    url: '/bigdata/variable/' + varId,
    method: 'get'
  })
}

// 新增分析变量
export function addVariable(data) {
  return request({
    url: '/bigdata/variable',
    method: 'post',
    data: data
  })
}

// 修改分析变量
export function updateVariable(data) {
  return request({
    url: '/bigdata/variable',
    method: 'put',
    data: data
  })
}

// 删除分析变量
export function delVariable(varId) {
  return request({
    url: '/bigdata/variable/' + varId,
    method: 'delete'
  })
}
