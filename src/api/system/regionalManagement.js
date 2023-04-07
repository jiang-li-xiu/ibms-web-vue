import request from '@/utils/request'

// 获取区域树形数据
export function getAreaTree(query) {
  return request({
    url: '/device/regioninfo/treelist/detail',
    method: 'GET',
    params: query
  })
}

// 获取所有子系统列表
export function getSubSystemList() {
  return request({
    url: '/subsystem/subSystems/v1/list',
    method: 'GET'
  })
}

// 新增区域
export function addRegion(data) {
  return request({
    url: '/device/regioninfo/v1/add',
    method: 'PUT',
    data
  })
}

// 删除区域
export function removeRegion(id) {
  return request({
    url: `/device/regioninfo/v1/${id}`,
    method: 'DELETE',
  })
}

// 获取区域详情
export function getRegionDetails(id) {
  return request({
    url: `/device/regioninfo/v1/details/${id}`,
    method: 'GET',
  })
}

// 获取区域详情树形列表数据
export function getRegionDetailsTree(query) {
  return request({
    url: '/device/regioninfo/treelist/detail',
    method: 'GET',
    params: query
  })
}


// 获取父级区域信息
export function getParentRegion(id) {
  return request({
    url: `/device/regioninfo/${id}`,
    method: 'GET',
  })
}

// 修改区域信息
export function updateRegionInfo(data) {
  return request({
    url: `/device/regioninfo/v1/edit`,
    method: 'PUT',
    data
  })
}
