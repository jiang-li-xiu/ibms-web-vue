/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-22 10:28:08
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-24 09:47:17
 */
import request from '@/utils/request'

// 获取组织树形
export function getOrganizationTree(query) {
    return request({
        url: '/ent_hik/orgList/tree',
        method: 'GET',
        params: query
    })
}

// 查询人员管理列表
export function getPersonnlList(params) {
    return request({
        url: `/ent_hik/personList`,
        method: 'get',
        params
    })
}

// 添加
export function addPersonnlInfo(data) {
    return request({
        url: `/ent_hik/person`,
        method: 'POST',
        data
    })
}

// 编辑
export function editPersonnlInfo(data) {
    return request({
        url: `/ent_hik/person`,
        method: 'put',
        data
    })
}

// 删除
export function deletePersonnlInfo(personIds) {
    return request({
        url: `/ent_hik/person/${personIds}`,
        method: 'delete',
    })
}



// 查看人员图片详情
export function getPeoplePicturesDetail(params) {
    return request({
        // url: `/ent_hik/person/getImg/${serverIndexCode}/${picUri}`,
        url: `/ent_hik/person/getImg`,
        method: 'get',
        params
    })
}

// 添加人脸
export function addFace(data) {
    return request({
        url: `/ent_hik/personPhoto`,
        method: 'POST',
        data
    })
}

// 修改人脸
export function editFace(data) {
    return request({
        url: `/ent_hik/personPhoto`,
        method: 'put',
        data
    })
}

// 删除人脸
export function deleteFace(personId) {
    return request({
        url: `/ent_hik/personPhoto/${personId}`,
        method: 'delete',
    })
}