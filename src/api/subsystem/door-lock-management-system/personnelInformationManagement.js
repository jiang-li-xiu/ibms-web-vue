/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-15 11:20:06
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-21 09:17:25
 */
import request from '@/utils/request'

// 查询人员信息管理列表
export function getPersonnlInfoList(params) {
    return request({
        url: `/doorlock/user/List`,
        method: 'get',
        params
    })
}

// 添加
export function addPersonnlInfo(data) {
    return request({
        url: `/doorlock/user/addUser`,
        method: 'POST',
        data
    })
}

// 编辑
export function editPersonnlInfo(data) {
    return request({
        url: `/doorlock/user/updateUser`,
        method: 'put',
        data
    })
}

// 删除
export function deletePersonnlInfo(ids) {
    return request({
        url: `/doorlock/user/${ids}`,
        method: 'delete',
    })
}

// 详情
export function getDetail(id) {
    return request({
        url: `/doorlock/user/${id}`,
        method: 'get',
    })
}
// 修改密码
export function changePassword(data) {
    return request({
        url: `/doorlock/lockDevice/do-edit/password`,
        method: 'post',
        data
    })
}