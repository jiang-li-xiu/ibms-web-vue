/*
 * @Author: Yelucc
 * @Date: 2021-06-24 09:54:58
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2021-09-22 17:50:47
 * @Description: 
 */
import request from '@/utils/request'
import { EventSourcePolyfill } from "event-source-polyfill";
import { getToken } from "@/utils/auth";

// 获取子系统
export function getSystemData() {
  return request({
    url: `/subsystem/subSystems/v1/list`,
    method: 'GET',
  })
}

// 根据选择的子系统 code 获取子插件
export function getPlugData(code) {
  return request({
    url: `/subsystem/subPlugins/v1/list/${code}`,
    method: 'GET',
  })
}

// 根据子插件的 code 获取物模型
export function getModelData(code) {
  return request({
    url: `/subsystem/thingModels/v1/list/${code}`,
    method: 'GET',
  })
}

// 查询子系统管理列表
export function listSystem(query) {
  return request({
    url: '/subsystem/subSystems/v1/list/system/plugin',
    method: 'get',
    params: query
  })
}

// 查询子系统管理详细
export function getSystem(id) {
  return request({
    url: '/subsystem/subSystems/v1/' + id + '/one',
    method: 'get'
  })
}

// 根据子插件ID查询物模型列表
export function getThingModelByPid(code) {
  return request({
    url: '/subsystem/thingModels/v1/list/' + code,
    method: 'get'
  })
}

// 根据物模型ID查询物模型列表
export function getThingModelByTid(id) {
  return request({
    url: '/subsystem/thingModels/v1/' + id,
    method: 'get'
  })
}

// 新增设备类型
export function addDeviceType(data) {
  return request({
    url: '/device/devicetype',
    method: 'post',
    data: data
  })
}

// 获取微服务监控
export function getApplications() {
  return request({
    url: '/monitor/applications',
    method: 'get',
    headers: { "Accept": "application/json" }
  })
}

// 监控流
export function getApplicationsStream() {
  return new EventSourcePolyfill(
    "/dev-api/monitor/applications",
    {
      headers: { Authorization: "Bearer " + getToken() },
    }
  )
}