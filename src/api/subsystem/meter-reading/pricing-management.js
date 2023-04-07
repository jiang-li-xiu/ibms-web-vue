/*
 * @Descripttion: 
 * @Author: ZhouFanSong
 * @Date: 2021-09-15 14:07:08
 * @LastEditors: ZhouFanSong
 * @LastEditTime: 2021-10-12 10:06:56
 */
import request from '@/utils/request'
/* 远程抄表-计价管理 */
// 查询计价方案列表
export function getMeterReadingList(params) {
    return request({
        url: '/meterread/valuation/list',
        method: 'get',
        params
    })
}

// 新增计价方案
export function getMeterReadingAdd(data) {
    return request({
        url: '/meterread/valuation',
        method: 'post',
        data
    })
}
// 修改计价方案
export function getMeterReadingEdit(data) {
    return request({
        url: '/meterread/valuation',
        method: 'put',
        data
    })
}
// 删除计价方案
export function deleteVideoViewDelete(id) {
    return request({
        url: '/meterread/valuation/' + id,
        method: 'DELETE',
    })
}
/* 远程抄表-数据采集 */
// 根据区域编号获取抄表数据
export function getMeterreadList(params) {
    return request({
        url: '/meterread/data/listByRegionId',
        method: 'get',
        params
    })
}
// 获取详细信息
export function getOneByDataId(params) {
    return request({
        url: '/meterread/history/getOneByDataId',
        method: 'get',
        params
    })
}
/* 远程抄表-能耗报表 */
// 能耗报表数据
export function getEnergyConsumptionList(data) {
    return request({
        url: '/meterread/report/energyConsumption',
        method: 'post',
        data
    })
}
/* 远程抄表-视图报表 */
// 用水统计
export function getBrokenLineDate(data) {
    return request({
        url: '/meterread/report/brokenLineDate',
        method: 'post',
        data
    })
}
// 楼栋使用情况
export function getBuildingUse(data) {
    return request({
        url: '/meterread/report/buildingUse',
        method: 'post',
        data
    })
}
// 用水分类统计
export function getPieChartReport(data) {
    return request({
        url: '/meterread/report/pieChartReport',
        method: 'post',
        data
    })
}