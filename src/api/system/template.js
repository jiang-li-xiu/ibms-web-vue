/*
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-08-05 15:07:11
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-28 14:29:54
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
        url: '/notice/noticeTemplate/v1/page',
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
        url: `/notice/noticeTemplate/v1/${id}`,
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
        url: `/notice/noticeTemplate/v1/list/${type}/${serviceProvider}`,
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
export function saveNoticeTemplate(vo) {
    return request({
        url: '/notice/noticeTemplate/v1',
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
export function editNoticeTemplate(vo) {
    return request({
        url: '/notice/noticeTemplate/v1',
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
export function delNoticeTemplate(ids) {
    return request({
        url: `/notice/noticeTemplate/v1/${ids}`,
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
        url: `/notice/noticeTemplate/v1/config/${type}/${serviceProvider}/metadata`,
        method: 'get'
    })
}

// 查询文件模板列表
/**
 * @description: 获取模版管理表格数据
 * @param {*} query 查询条件
 * @return {*}
 */
export function getTableList(query) {
    return request({
        url: '/system/template/list',
        method: 'get',
        params: query
    })
}

// 查询文件模板详细
export function getTemplate(id) {
    return request({
        url: '/system/template/' + id,
        method: 'get'
    })
}

// 新增文件模板
export function addTemplate(data) {
    return request({
        url: '/system/template/upload',
        method: 'post',
        data: data
    })
}

// 修改文件模板
export function updateTemplate(data) {
    return request({
        url: '/system/template',
        method: 'put',
        data: data
    })
}

// 删除文件模板
export function delTemplate(id) {
    return request({
        url: '/system/template/' + id,
        method: 'delete'
    })
}

export function getInfoByFileType(params) {
    return request({
        url: '/system/template',
        method: 'get',
        params
    })
}
