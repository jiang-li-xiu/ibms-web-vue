import request from '@/utils/request'

// 查询测试菜单列表
export function listTestTable(query) {
  return request({
    url: '/test/testTable/list',
    method: 'get',
    params: query
  })
}

// 查询测试菜单详细
export function getTestTable(testId) {
  return request({
    url: '/test/testTable/' + testId,
    method: 'get'
  })
}

// 新增测试菜单
export function addTestTable(data) {
  return request({
    url: '/test/testTable',
    method: 'post',
    data: data
  })
}

// 修改测试菜单
export function updateTestTable(data) {
  return request({
    url: '/test/testTable',
    method: 'put',
    data: data
  })
}

// 删除测试菜单
export function delTestTable(testId) {
  return request({
    url: '/test/testTable/' + testId,
    method: 'delete'
  })
}
