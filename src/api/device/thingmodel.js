/*
 * @Author: Yelucc
 * @Date: 2021-07-02 15:59:00
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-07-02 17:09:23
 * @Description: 
 */
import request from '@/utils/request'

// 查询物模型管理列表
export function listThingmodel(query) {
  return request({
    url: '/device/thingmodel/list',
    method: 'get',
    params: query
  })
}

// 物模型
export function getThingModelByCode(query) {
  return request({
    url: '/device/thingModels/getOneByCode',
    method: 'get',
    params: query
  })
}
// 查询物模型管理详细
export function getThingmodel(id) {
  return request({
    url: '/device/thingmodel/' + id,
    method: 'get'
  })
}

// 新增物模型管理
export function addThingmodel(data) {
  return request({
    url: '/device/thingmodel',
    method: 'post',
    data: data
  })
}

// 修改物模型管理
export function updateThingmodel(data) {
  return request({
    url: '/device/thingmodel',
    method: 'put',
    data: data
  })
}

// 删除物模型管理
export function delThingmodel(id) {
  return request({
    url: '/device/thingmodel/' + id,
    method: 'delete'
  })
}
