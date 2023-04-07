/*
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-08-03 14:45:21
 * @LastEditors: Chen
 * @LastEditTime: 2021-08-10 16:43:28
 */
import request from '@/utils/request'

/**
 * @description: 分页查询
 * @param {*} query
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function pageList(query) {
    return request({
        url: '/notice/noticeConfig/v1/page',
        method: 'get',
        params: query
    })
}

/**
 * @description: 根据ID获取通知配置
 * @param {*} id
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function findOne(id) {
    return request({
        url: `/notice/noticeConfig/v1/${id}`,
        method: 'get',
    })
}

/**
 * @description: 根据类型和服务商获取通知配置列表
 * @param {*} type
 * @param {*} serviceProvider
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function findListByTypeAndService(type, serviceProvider) {
    return request({
        url: `/notice/noticeConfig/v1/list/${type}/${serviceProvider}`,
        method: 'get',
    })
}

/**
 * @description: 保存通知配置
 * @param {*} vo
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function saveNoticeConfig(vo) {
    return request({
        url: '/notice/noticeConfig/v1',
        method: 'post',
        data: vo
    })
}

/**
 * @description: 修改通知配置
 * @param {*} vo
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function editNoticeConfig(vo) {
    return request({
        url: '/notice/noticeConfig/v1',
        method: 'put',
        data: vo
    })
}

/**
 * @description: 删除通知配置
 * @param {*} ids
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function delNoticeConfig(ids) {
    return request({
        url: `/notice/noticeConfig/v1/${ids}`,
        method: 'delete',
    })
}

/**
 * @description: 根据类型和服务商获取表单元数据
 * @param {*} type
 * @param {*} serviceProvider
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function getFormMetadata(type, serviceProvider) {
    return request({
        url: `/notice/noticeConfig/v1/config/${type}/${serviceProvider}/metadata`,
        method: 'get'
    })
}

/**
 * @description: 下载
 * @param {*} id
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function download(id) {
    return request({
        url: `/notice/noticeConfig/v1/download/${id}`,
        method: 'get'
    })
}

/**
 * @description: 消息发送
 * @param {*} notifierSend
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function send(notifierSend) {
    return request({
        url: '/notice/notifier/v1/send',
        method: 'post',
        data: notifierSend
    })
}

/**
 * @description: 获取变量名
 * @param {*} id
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function getVariableFields(id) {
    return request({
        url: `/notice/notifier/v1/${id}/fields`,
        method: 'get'
    })
}

/**
 * @description: 通知记录分页查询 
 * @param {*} configIdRelation
 * @param {*} query
 * @return {*}
 * @author: Chen
 * @since: 1.0
 */
export function pageListByHistory(configIdRelation, query) {
    return request({
        url: `/notice/noticeHistory/v1/page/${configIdRelation}`,
        method: 'get',
        params: query
    })
}