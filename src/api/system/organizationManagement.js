/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-22 16:34:06
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-23 14:11:23
 */
import request from '@/utils/request'

// 新增组织
export function addOrganization(data) {
    return request({
        url: '/ent_hik/org',
        method: 'post',
        data
    })
}
// 修改组织
export function EditOrganization(data) {
    return request({
        url: '/ent_hik/org',
        method: 'put',
        data
    })
}

// 删除
export function removeOrganization(indexCode) {
    return request({
        url: `/ent_hik/org/${indexCode}`,
        method: 'DELETE',
    })
}

// 获取组织树形
export function getOrganizationTree(query) {
    return request({
        url: '/ent_hik/orgList/tree',
        method: 'GET',
        params: query
    })
}