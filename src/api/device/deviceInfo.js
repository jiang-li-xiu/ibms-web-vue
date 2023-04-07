/*
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-26 14:05:07
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-06-15 16:02:41
 */
import request from '@/utils/request'

// 获取设备在线数
export function countDeviceinfo(query) {
  return request({
    url: '/device/deviceinfo/list/count',
    method: 'get',
    params: query
  })
}

// 查询设备列表
export function listDeviceinfo(query) {
  return request({
    url: '/device/deviceinfo/list',
    method: 'get',
    params: query
  })
}

// 查询设备详细
export function getDeviceinfo(deviceId) {
  return request({
    url: '/device/deviceinfo/' + deviceId,
    method: 'get'
  })
}

// 新增设备
export function addDeviceinfo(data) {
  return request({
    url: '/device/deviceinfo',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updateDeviceinfo(data) {
  return request({
    url: '/device/deviceinfo',
    method: 'put',
    data: data
  })
}

// 删除设备
export function delDeviceinfo(deviceId) {
  return request({
    url: '/device/deviceinfo/' + deviceId,
    method: 'delete'
  })
}

// 获取设备类
export function getDeviceType() {
  return request({
    url: '/device/devicetype/list/nopage',
    method: 'GET'
  })
}

// 获取设备详情
export function getDeviceDetail(deviceId) {
  return request({
    url: '/device/deviceinfo/' + deviceId,
    method: 'GET'
  })
}
// 编辑设备基础信息
export function editDeviceDetail(data) {
  return request({
    url: '/device/deviceinfo/attribute/edit',
    method: 'PUT',
    data
  })
}
// 获取编辑后的设备基础信息
export function getDeviceDetailBasis(deviceId) {
  return request({
    url: '/device/deviceinfo/basis/' + deviceId,
    method: 'GET',
  })
}

//  
export function getDeviceThingModel(deviceId) {
  return request({
    url: `/device/deviceinfo/${deviceId}/thingModel`,
    method: 'GET',
  })
}

// 获取所有子系统 
export function getSystemData() {
  return request({
    url: `/subsystem/subSystems/v1/list`,
    method: 'GET',
  })
}

// 根据子系统的 code 获取 子插件 
export function getSubsystemSubPluginsV1List(subSystemCode) {
  return request({
    url: `/subsystem/subPlugins/v1/list/${subSystemCode}`,
    method: 'GET',
  })
}

// 根据子插件的 code 获取物模型
export function getSubsystemThingModelsV1List(subPluginCode) {
  return request({
    url: `/subsystem/thingModels/v1/list/${subPluginCode}`,
    method: 'GET',
  })
}

// 选择参数后同步数据（已废弃）
export function synchronizeDevice(modelId) {
  return request({
    url: '/device/deviceinfo/synchronous/' + modelId,
    method: 'POST'
  })
}

// 同步弹窗提交 
export function getDeviceinfoSynchronousSet({ subSystem, subPlug, modeId }) {
  return request({
    url: `/device/deviceinfo/synchronous/set/${subSystem}/${subPlug}/${modeId}`,
    method: 'GET',
  })
}

// 获取冲突/不冲突的数据 
export function getDeviceDeviceinfoSynchronousGet(m) {
  return request({
    url: `/device/deviceinfo/synchronous/get/${m}`,
    method: 'GET',
  })
}

// 获取设备类型
export function getDeviceDeviceinfoSynchronousGetDeviceType(modeId) {
  return request({
    url: `/device/deviceinfo/synchronous/getDeviceType/${modeId}`,
    method: 'GET',
  })
}

// 同步数据（修改数据/添加数据）
export function getDeviceDeviceinfoSynchronousSaveDeviceInfo(data) {
  return request({
    url: `/device/deviceinfo/synchronous/saveDeviceInfo`,
    method: 'POST',
    data
  })
}

// 设置设备参数
export function setPower(data) {
  return request({
    url: `/device/deviceinfo/setPower`,
    method: 'POST',
    data
  })
}